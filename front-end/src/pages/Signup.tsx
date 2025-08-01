import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import axios, { AxiosError } from "axios";
import { signupSchema } from "@/schema/signupSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { URL } from "@/utils/constants";
import { useState } from "react";

export default function Signup() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${URL}/users/register`, data);

      if (response.status < 400) {
        toast.success("User created successfully");
        navigate("/login");
      } else {
        toast.error("Unable to resolve the request");
      }
    } catch (error) {
      // show error on toast
      const err = error as AxiosError;

      if (err.response) {
        const errorMessage =
          (err.response.data as any).message || "Something went wrong";
        toast.error(errorMessage);
      } else if (err.request) {
        // No response (maybe network issue)
        toast.error("No response from server. Check your network.");
      } else {
        toast.error("An unexpected error occurred.");
      }

      console.error("Signup Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-rose-100">
      <Card className="w-1/3 shadow-2xs flex flex-col items-start space-y-3 px-8 py-8 ">
        <CardHeader className="w-full">
          <CardTitle className="w-full text-4xl font-semibold text-rose-700">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col items-start space-y-6 "
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal text-lg text-slate-600">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Harry Potter"
                        className="w-full h-11 text-[1.07rem] text-slate-600 placeholder:text-slate-600/60 border border-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal text-lg text-slate-600">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="harry#17"
                        className="w-full h-11 text-[1.07rem] text-slate-600 placeholder:text-slate-600/60 border border-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal text-lg text-slate-600">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="harry17@example.com"
                        className="w-full h-11 text-[1.07rem] text-slate-600 placeholder:text-slate-600/60 border border-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal text-lg text-slate-600">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="w-full h-11 text-[1.07rem] text-slate-600 placeholder:text-slate-600/60 border border-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-1/5 h-10 text-[1.07rem] font-medium px-4 py-1.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>
                    <Loader className="w-5 h-5 animate-spin" />
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="mt-8">
          <div>
            <p className="text-base text-slate-600/70">
              Already have joined{" "}
              <span className="italic text-rose-500 font-medium ">
                Jet Chat Room
              </span>
              ?{" "}
              <Link
                to={"/login"}
                className="text-blue-400 border-b border-b-blue-400/0 transition-opacity delay-300 hover:border-b-blue-400 "
              >
                Login
              </Link>{" "}
              here.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
