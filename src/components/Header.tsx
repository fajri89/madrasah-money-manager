
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserProfile from './UserProfile';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if current route is login page
  const isLoginPage = location.pathname === '/login';

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Don't render the header at all on the login page
  if (isLoginPage) {
    return null;
  }

  // Safe access to auth context
  let isAuthenticated = false;
  try {
    const { isAuthenticated: authState } = useAuth();
    isAuthenticated = authState;
  } catch (error) {
    console.error("Auth context not available:", error);
    // If auth context is not available, we'll default to false
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:mr-4"
              onClick={onMenuToggle}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src="/lovable-uploads/ec06af05-0ccf-4881-b9fd-985fbd2d8ba3.png" 
              alt="Logo Madrasah Aliyah At-Tahzib Kekait" 
              className="h-10 w-auto mr-3"
            />
            <div className="lg:text-scroll-container overflow-hidden">
              <div className="font-medium text-green-700 text-sm sm:text-base lg:text-lg xl:text-xl whitespace-nowrap lg:text-scroll">
                Madrasah Aliyah At-Tahzib Kekait
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          {isAuthenticated && <UserProfile />}
        </div>
      </div>
    </header>
  );
};

export default Header;
