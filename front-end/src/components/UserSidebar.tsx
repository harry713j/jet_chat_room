import { UserActions, Searchbar, ActiveGroups } from "@/components";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import axios, { AxiosError } from "axios";
import type { Group, SearchResult, Message, ActiveChat } from "@/types/types";
import { useEffect, useState } from "react";
import { URL } from "@/utils/constants";
import { toast } from "sonner";

axios.defaults.withCredentials = true;

export function UserSidebar({
  onRoomSelect,
  setIsLoading,
}: {
  onRoomSelect: (room: Group, messages: Message[]) => void;
  setIsLoading: (state: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<SearchResult>({
    users: [],
    groups: [],
  });
  const [activeRooms, setActiveRooms] = useState<ActiveChat[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!searchQuery.trim()) return;

      axios
        .get(`${URL}/users/search?q=${searchQuery}`)
        .then((res) => setRooms(res.data?.rooms))
        .catch(() => toast.error("Something went wrong"));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    axios
      .get(`${URL}/users/active-chats`)
      .then((res) => setActiveRooms(res.data.activeChats))
      .catch(() => toast.error("Couldn't get user active chats"));
  }, []);

  const onSelectIndividual = async (recieverId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${URL}/chat-group/direct-chat`, {
        recieverId: recieverId,
      });

      if (response.status === 201 || response.status === 200) {
        const group = response.data.group;

        const messagesResponse = await axios.get(
          `${URL}/messages/${group.groupId}?page=1&limit=20`
        );

        if (messagesResponse.status === 200) {
          onRoomSelect(group, messagesResponse.data.messages);
        } else {
          toast.error("Failed to load the messages");
        }
      } else {
        toast.error("Failed to load the chat");
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        const errorMessage = (err.response.data as any).message;
        toast.error(errorMessage);
      } else if (err.request) {
        toast.error("Unable to connect. check your network");
      } else {
        toast.error("An unexpected error occured");
      }

      console.error("Select User error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectGroup = async (groupId: string) => {
    // fetch the group messages
    setIsLoading(true);
    const group = rooms.groups.find((g) => g.groupId === groupId);
    if (!group) return toast.error("Group not found");
    try {
      const response = await axios.get(
        `${URL}/messages/${groupId}?page=1&limit=20`
      );

      if (response.status === 200) {
        onRoomSelect(group, response.data.messages);
      } else {
        toast.error("Failed to load the group messages");
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        const errorMessage = (err.response.data as any).message;
        toast.error(errorMessage);
      } else if (err.request) {
        toast.error("Unable to connect. check your network");
      } else {
        toast.error("An unexpected error occured");
      }

      console.error("Select group error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Searchbar
          rooms={rooms ?? { users: [], groups: [] }}
          onSelectIndividual={onSelectIndividual}
          onSelectGroup={onSelectGroup}
          setSearchQuery={setSearchQuery}
        />
      </SidebarHeader>
      <SidebarContent>
        <ActiveGroups
          activeRooms={activeRooms}
          onSelectIndividual={onSelectIndividual}
          onSelectGroup={onSelectGroup}
        />
      </SidebarContent>
      <SidebarFooter>
        <UserActions />
      </SidebarFooter>
    </Sidebar>
  );
}
