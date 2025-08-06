import { io, Socket } from "socket.io-client";
import axios from "axios";
import { URL } from "@/utils/constants";

let socket: Socket | null = null;

const getToken = async () => {
  try {
    const response = await axios.get(`${URL}/users/get-access-token`, {
      withCredentials: true,
    });

    return response.data.token || "";
  } catch (error) {
    console.error((error as Error).message);
    return "";
  }
};

const getSocket = async (): Promise<Socket> => {
  if (socket) return socket;

  const token = await getToken();

  socket = io(URL, {
    autoConnect: false, // By default, the Socket.IO client opens a connection to the server right away, this will prevent this
    auth: {
      token: token,
    },
  });

  return socket;
};

export { getSocket };
