import React, { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { URL } from "@/utils/constants";
import type { User, UserContextType } from "@/types/types";

const UserContext = createContext<UserContextType>({
  user: undefined,
  isLoading: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  const getUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${URL}/users/current-user`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUser({ ...response.data.user, userId: response.data.user._id });
      } else {
        console.log("Failed to get user details");
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        console.error((err.response.data as any).message);
      } else {
        console.error("Unable to get the user details");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
