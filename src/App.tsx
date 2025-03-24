
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import MasterData from "./pages/MasterData";
import Finance from "./pages/Finance";
import StudentPayment from "./pages/StudentPayment";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

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
                <Route path="/" element={<Index />} />
                <Route path="/master-data" element={<MasterData />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/student-payment" element={<StudentPayment />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
