import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/schema/signupSchema";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type z from "zod";
import { Loader } from "lucide-react";

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      oldpassword: "",
      newpassword: "",
    },
  });

  const onPasswordUpdate = async (
    values: z.infer<typeof changePasswordSchema>
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${URL}/users/change-password`,
        values,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message);
      } else {
        toast.error("Failed to change the password");
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        const errorMessage =
          (err.response.data as any).message || "Something went wrong";
        toast.error(errorMessage);
      } else if (err.request) {
        toast.error("Network issue");
      } else {
        toast.error("An unexpected error occured");
      }

      console.error("Change password error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onPasswordUpdate)}>
          <DialogTrigger asChild>
            <Button variant="outline">Change Password</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Change your current password
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="oldpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {isLoading ? (
                  <span>
                    <Loader className="w-5 h-5 animate-spin" />
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
