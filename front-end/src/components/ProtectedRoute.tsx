import { useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router"

export function ProtectedRoute({children }: {children : ReactNode}){
    const nickname = localStorage.getItem("nickname")
    const navigate = useNavigate()

    useEffect(() => {
    if (!nickname) {
      navigate("/");
    }
  }, [nickname, navigate]);

  // While redirecting, don't render children
  if (!nickname) {
    return null;
  }

    return <>{children}</>
}