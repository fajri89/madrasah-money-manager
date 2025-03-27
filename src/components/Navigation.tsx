
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, Users, FileText, CreditCard, BarChart, TrendingUp, TrendingDown, UserCog, Eye, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Animation variants
const menuVariants = {
  closed: {
    x: '-100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

// Navigation component
const Navigation = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);
  const { user, hasPermission } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  
  // Update media query state when window resizes
  useEffect(() => {
    const updateMedia = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  // Update active menu item when route changes
  useEffect(() => {
    setActiveMenuItem(location.pathname);
  }, [location.pathname]);

  // Close menu when route changes on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      const handleRouteChange = () => {
        onClose();
      };

      window.addEventListener('popstate', handleRouteChange);
      return () => {
        window.removeEventListener('popstate', handleRouteChange);
      };
    }
  }, [isMobile, isOpen, onClose]);
  
  // Handle clicking outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Get role-based menu items
  const getMenuItems = () => {
    const adminMenuItems = [
      { 
        path: '/', 
        label: 'Dashboard', 
        icon: <Home className="h-5 w-5 mr-3" />,
      },
      { 
        path: '/master-data', 
        label: 'Data Master', 
        icon: <Users className="h-5 w-5 mr-3" />,
      },
      { 
        path: '/finance', 
        label: 'Pemasukan & Pengeluaran', 
        icon: <FileText className="h-5 w-5 mr-3" />,
      },
      { 
        path: '/student-payment', 
        label: 'SPP Siswa', 
        icon: <CreditCard className="h-5 w-5 mr-3" />,
      },
      { 
        path: '/reports', 
        label: 'Laporan', 
        icon: <BarChart className="h-5 w-5 mr-3" />,
      },
      { 
        path: '/user-management', 
        label: 'Kelola Pengguna', 
        icon: <UserCog className="h-5 w-5 mr-3" />,
      },
    ];

    const bendaharaMenuItems = [
      { 
        path: '/', 
        label: 'Dashboard', 
        icon: <Home className="h-5 w-5 mr-3" />,
      },
      { 
        path: '/student-payment', 
        label: 'Input Pembayaran SPP', 
        icon: <CreditCard className="h-5 w-5 mr-3" />,
      },
      { 
        path: '/finance?tab=expense', 
        label: 'Input Pengeluaran', 
        icon: <TrendingDown className="h-5 w-5 mr-3" />,
      },
      { 
        path: '/finance?tab=income', 
        label: 'Input Pemasukan', 
        icon: <TrendingUp className="h-5 w-5 mr-3" />,
      },
    ];

    const kepalaSekolahMenuItems = [
      { 
        path: '/', 
        label: 'Dashboard', 
        icon: <Home className="h-5 w-5 mr-3" />,
      },
      { 
        path: '/reports?tab=spp', 
        label: 'Riwayat Pembayaran SPP', 
        icon: <Eye className="h-5 w-5 mr-3" />,
      },
      { 
        path: '/reports?tab=expense', 
        label: 'Riwayat Pengeluaran', 
        icon: <Eye className="h-5 w-5 mr-3" />,
      },
      { 
        path: '/reports?tab=income', 
        label: 'Riwayat Pemasukan', 
        icon: <Eye className="h-5 w-5 mr-3" />,
      },
      { 
        path: '/reports', 
        label: 'Laporan Keuangan', 
        icon: <Wallet className="h-5 w-5 mr-3" />,
      },
    ];

    const siswaMenuItems = [
      { 
        path: '/', 
        label: 'Dashboard', 
        icon: <Home className="h-5 w-5 mr-3" />,
      }
    ];

    if (!user) return [];

    if (user.level === 'admin') return adminMenuItems;
    if (user.level === 'bendahara') return bendaharaMenuItems;
    if (user.level === 'kepala_sekolah') return kepalaSekolahMenuItems;
    return siswaMenuItems;
  };

  const menuItems = getMenuItems();

  return (
    <motion.div
      ref={navRef}
      className="fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg pt-16"
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={menuVariants}
    >
      <div className="absolute top-4 right-4">
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close menu"
        >
          <X className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      <div className="px-4 py-4">
        <h2 className="text-xl font-bold text-green-700 mb-6">Madrasah Aliyah At-Tahzib Kekait</h2>
        
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${activeMenuItem === item.path
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => {
                    setActiveMenuItem(item.path);
                    if (isMobile) {
                      onClose();
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {user && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="px-4 py-2">
              <p className="text-xs text-gray-500">Logged in as</p>
              <p className="font-medium">{user.nama}</p>
              <p className="text-xs text-gray-500 capitalize">{user.level.replace('_', ' ')}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Navigation;
