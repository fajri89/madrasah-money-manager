
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles = [] }: ProtectedRouteProps) => {
  let auth = {
    isAuthenticated: false,
    loading: true,
    user: null,
    hasPermission: (roles: string[]) => false
  };
  
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context not available:", error);
    // If auth context is not available, navigate to login
    return <Navigate to="/login" replace />;
  }
  
  const { isAuthenticated, hasPermission, loading, user } = auth;

  useEffect(() => {
    // Show a toast message if user doesn't have permission to view this page
    if (!loading && isAuthenticated && allowedRoles.length > 0 && !hasPermission(allowedRoles)) {
      toast.error(`Anda tidak memiliki akses untuk halaman ini. Dibutuhkan role: ${allowedRoles.join(", ")}`);
    }
  }, [loading, isAuthenticated, allowedRoles, hasPermission]);

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
