import React, { createContext, useContext, useEffect, useState } from "react";
import type { SocketContextType } from "@/types/types";
import { getSocket } from "@/lib/socket";
import type { Socket } from "socket.io-client";

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getSocket();
      setSocket(res);
    })();
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
