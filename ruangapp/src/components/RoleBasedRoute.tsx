import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function RoleBasedRoute({
  children,
  requiredRole,
}: RoleBasedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
