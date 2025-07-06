import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import {createBrowserRouter, RouterProvider} from "react-router"
import {Home, NotFound, ChatRoom} from "./pages"
import {Protection} from "./components"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path:"/chat-room",
    element: <Protection><ChatRoom /></Protection>,
    errorElement: <NotFound />
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
