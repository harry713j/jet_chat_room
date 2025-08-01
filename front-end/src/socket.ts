import { io } from "socket.io-client";
import axios from "axios";

const URL = import.meta.env.VITE_SERVER_URL;

axios.defaults.withCredentials = true;

const getToken = async () => {
  try {
    const response = await axios.get(`${URL}/users/get-access-token`);

    if (response.status === 200) {
      return response.data.token;
    } else {
      return "";
    }
  } catch (error) {
    console.error((error as Error).message);
    return "";
  }
};

const token = getToken();

const socket = io(URL, {
  autoConnect: false, // By default, the Socket.IO client opens a connection to the server right away, this will prevent this
  auth: {
    token: token,
  },
});

export { socket };
