import { Save, Menu, X } from "lucide-react";
import axios, { AxiosError } from "axios";
import { fullNameSchema, emailSchema } from "@/schema/signupSchema";
import { URL } from "@/utils/constants";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useUser } from "@/context/UserContext";
import { ProfilePicture } from "./ProfilePicture";
import { DialogClose } from "@radix-ui/react-dialog";
import { CreateGroupForm } from "./CreateGroupForm";
import { ChangePasswordForm } from "./ChangePasswordForm";

// automatically add the http-cookies to the request
axios.defaults.withCredentials = true;

type Warnings = {
  emailWarning: string;
  nameWarning: string;
};

export function UserActions() {
  // create new group
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [fullName, setFullName] = useState<string>(user?.fullName ?? "");
  const [warning, setWarning] = useState<Warnings>({
    emailWarning: "",
    nameWarning: "",
  });
  const navigate = useNavigate();

  const onLogout = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${URL}/users/logout`);

      if (response.status === 200) {
        toast.success(response.data.message);

        navigate("/");
      } else {
        toast.error("Unable to logout ");
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

      console.error("Logout error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onNameUpdate = async () => {
    const result = fullNameSchema.safeParse(fullName);

    if (!result.success) {
      setWarning({ ...warning, nameWarning: result.error.message });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.patch(`${URL}/users/change-name`, {
        fullName: fullName,
      });

      if (response.status === 201) {
        toast.success(response.data.message);
      } else {
        toast.error("Failed to update the Name");
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

      console.error("Change Name error: ", err);
    } finally {
      setIsLoading(true);
      setWarning({ emailWarning: "", nameWarning: "" });
    }
  };

  const onEmailUpdate = async () => {
    // check for validation
    const result = emailSchema.safeParse(email);

    if (!result.success) {
      setWarning({ ...warning, emailWarning: result.error.message });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.patch(`${URL}/users/change-email`, {
        email: email,
      });

      if (response.status === 201) {
        toast.success(response.data.message);
      } else {
        toast.error("Failed to update the email");
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

      console.error("Change email error: ", err);
    } finally {
      setIsLoading(true);
      setWarning({ emailWarning: "", nameWarning: "" });
    }
  };

  return (
    <div>
      <div>
        <div>
          <ProfilePicture name={user?.fullName} />
          <span>
            <h4>{user?.fullName}</h4>
            <p>{user?.username}</p>
          </span>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"}>
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <CreateGroupForm />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Dialog>
                  <DialogTrigger>Profile</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{user?.fullName}</DialogTitle>
                      <DialogDescription>{user?.username}</DialogDescription>
                    </DialogHeader>
                    <div>
                      <div>
                        <span>
                          <Label>Name</Label>
                          <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </span>
                        <Button
                          size="icon"
                          disabled={
                            isLoading ||
                            fullName === user?.fullName ||
                            !!warning.nameWarning
                          }
                          onClick={() => onNameUpdate()}
                        >
                          <Save />
                        </Button>
                      </div>
                      <div>
                        <span>
                          <Label>Name</Label>
                          <Input
                            value={fullName}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </span>
                        <Button
                          size="icon"
                          disabled={
                            fullName === user?.email ||
                            !!warning.emailWarning ||
                            isLoading
                          }
                          onClick={() => onEmailUpdate()}
                        >
                          <Save />
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                  <DialogFooter>
                    <DialogClose asChild>
                      <X />
                    </DialogClose>
                  </DialogFooter>
                </Dialog>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ChangePasswordForm />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onLogout()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
