import { useAuth } from "@/hooks/auth";
import { type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Loader } from "lucide-react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();

  console.log("Inside protected route");

  if (isLoading) {
    return (
      <div>
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
  }

  return <>{children}</>;
}
