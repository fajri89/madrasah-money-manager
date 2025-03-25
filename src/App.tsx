
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import MasterData from "./pages/MasterData";
import Finance from "./pages/Finance";
import StudentPayment from "./pages/StudentPayment";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import UserManagementPage from "./pages/UserManagementPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="relative min-h-screen bg-background">
              <Header onMenuToggle={toggleMenu} />
              <AnimatePresence>
                {menuOpen && (
                  <Navigation 
                    isOpen={menuOpen} 
                    onClose={() => setMenuOpen(false)} 
                  />
                )}
              </AnimatePresence>
              <main className="pt-16"> {/* Added padding to account for fixed header */}
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/access-denied" element={<AccessDenied />} />
                  
                  {/* Protected routes for all authenticated users */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                  
                  {/* Admin only routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/master-data" element={<MasterData />} />
                    <Route path="/user-management" element={<UserManagementPage />} />
                  </Route>
                  
                  {/* Admin and bendahara routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin', 'bendahara']} />}>
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/student-payment" element={<StudentPayment />} />
                  </Route>
                  
                  {/* Admin and kepala_sekolah routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin', 'kepala_sekolah']} />}>
                    <Route path="/reports" element={<Reports />} />
                  </Route>
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
