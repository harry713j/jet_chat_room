import { useUser } from "@/context/UserContext";
import { createChatgroupSchema } from "@/schema/chatgroupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type z from "zod";
import { Loader, Check, PlusCircle, X } from "lucide-react";
import type { UserOption } from "@/types/types";
import { URL } from "@/utils/constants";

export function CreateGroupForm() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof createChatgroupSchema>>({
    resolver: zodResolver(createChatgroupSchema),
    mode: "onSubmit",
    defaultValues: {
      groupName: "",
      members: user?.userId
        ? [
            {
              userId: user?.userId,
              fullName: user?.fullName,
              username: user?.username,
            },
          ]
        : [],
    },
  });

  useEffect(() => {
    // debounce it
    const timeoutId = setTimeout(() => {
      if (!searchQuery.trim()) return;

      axios
        .get(`${URL}/users?query=${searchQuery}`, { withCredentials: true })
        .then((res) => setUsers(res.data.users))
        .catch((err) => console.error("Error searching users ", err));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const selectedUsers = form.watch("members");

  const toggleUser = (user: UserOption) => {
    const exists = selectedUsers.find((u) => u.userId === user.userId);
    if (exists) {
      form.setValue(
        "members",
        selectedUsers.filter((u) => u.userId !== user.userId)
      );
    } else {
      form.setValue("members", [...selectedUsers, user]);
    }
  };

  const removeUser = (userId: string) => {
    form.setValue(
      "members",
      selectedUsers.filter((u) => u.userId !== userId)
    );
  };

  const onCreateGroup = async (
    values: z.infer<typeof createChatgroupSchema>
  ) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        members: values.members.map((member) => member.userId),
      };

      const response = await axios.post(
        `${URL}/chat-group/create-group`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message);
      } else {
        toast.error("Failed to create group");
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

      console.error("Create Group error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onCreateGroup)}>
          <DialogTrigger asChild>
            <Button variant="outline">New Group</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Group</DialogTitle>
              <DialogDescription>Create a new chat group</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="awesome eggs" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Members</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add members
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      placeholder="Search by name or username..."
                    />
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandList>
                      {users.map((user) => {
                        const isSelected = selectedUsers.some(
                          (u) => u.userId === user.userId
                        );
                        return (
                          <CommandItem
                            key={user.userId}
                            onSelect={() => toggleUser(user)}
                            className="flex justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {user.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                @{user.username}
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-green-500" />
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>

            {/* Selected members */}
            {selectedUsers.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-muted-foreground">
                  Selected Members:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((u) => (
                    <div
                      key={u.userId}
                      className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
                    >
                      {u.fullName} (@{u.username})
                      <X
                        className="ml-1 h-4 w-4 cursor-pointer"
                        onClick={() => removeUser(u.userId)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
