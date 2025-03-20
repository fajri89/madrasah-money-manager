
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/utils/api';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const [sekolahInfo, setSekolahInfo] = useState({ nama: '', alamat: '' });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchSekolahInfo = async () => {
      try {
        const info = await api.getSekolahInfo();
        setSekolahInfo(info);
      } catch (error) {
        console.error('Error fetching school info:', error);
      }
    };

    fetchSekolahInfo();

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onMenuToggle}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div className="flex flex-col">
            <motion.h1 
              className="text-lg sm:text-xl font-semibold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {sekolahInfo.nama}
            </motion.h1>
            <motion.p 
              className="text-xs text-muted-foreground hidden sm:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {sekolahInfo.alamat}
            </motion.p>
          </div>
        </div>
        
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <span className="text-sm font-medium">A</span>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
