import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, hasPermission, loading } = useAuth();

  // Show loading indicator if still checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-green-700 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If we have roles specified and user doesn't have permission
  if (allowedRoles.length > 0 && !hasPermission(allowedRoles)) {
    return <Navigate to="/access-denied" replace />;
  }

  // Otherwise, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
