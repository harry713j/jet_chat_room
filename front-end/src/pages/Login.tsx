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
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { loginSchema } from "@/schema/loginSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { URL } from "@/utils/constants";
import { useState } from "react";

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${URL}/users/login`, data);

      if (response.status < 400) {
        toast.success("User login successfully");
        navigate("/chat");
      } else {
        toast.error("Unable to resolve the request");
      }
    } catch (error) {
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

      console.error("Login Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-rose-100">
      <Card className="w-1/3 shadow-2xs flex flex-col items-start space-y-3 px-8 py-8 ">
        <CardHeader className="w-full">
          <CardTitle className="w-full text-4xl font-semibold text-rose-700">
            Log in
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col items-start space-y-6 "
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal text-lg text-slate-600">
                      Email / Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ash0@example.com or ash_7"
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
                className="w-1/5 h-10 cursor-pointer text-[1.07rem] font-medium px-4 py-1.5"
              >
                {isSubmitting ? (
                  <span>
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="mt-8">
          <div>
            <p className="text-base text-slate-600/70">
              Haven't joined{" "}
              <span className="italic text-rose-500 font-medium ">
                Jet Chat Room
              </span>
              ?{" "}
              <Link
                to={"/signup"}
                className="text-blue-400 border-b border-b-blue-400/0 transition-opacity delay-300 hover:border-b-blue-400 "
              >
                Register
              </Link>{" "}
              here.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
