import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/global.css";
import { Toaster } from "@/components/ui/sonner";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Home, NotFound, ChatPage, Signup, Login } from "@/pages";
import { Protection } from "./components";
import { UserProvider } from "@/context/UserContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/chat",
    element: (
      <Protection>
        <ChatPage />
      </Protection>
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
      <RouterProvider router={router} />
      <Toaster richColors />
    </UserProvider>
  </StrictMode>
);
