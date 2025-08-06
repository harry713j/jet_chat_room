import { URL } from "@/utils/constants";
import axios from "axios";
import { useState, useEffect } from "react";

export function useAuth() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`${URL}/users/check`, {
        withCredentials: true,
      })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  return { isLoading, isAuthenticated };
}
