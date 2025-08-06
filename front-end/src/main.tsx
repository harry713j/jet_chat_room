import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/global.css";
import { Toaster } from "@/components/ui/sonner";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Home, NotFound, ChatPage, Signup, Login } from "@/pages";
import { AuthLayer } from "./components";
import { UserProvider } from "@/context/UserContext";
import { SocketProvider } from "@/context/SocketContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/chat",
    element: (
      <AuthLayer>
        <ChatPage />
      </AuthLayer>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <SocketProvider>
        <RouterProvider router={router} />
        <Toaster richColors />
      </SocketProvider>
    </UserProvider>
  </StrictMode>
);
