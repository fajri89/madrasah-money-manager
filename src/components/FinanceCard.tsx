
import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatRupiah } from '@/utils/api';

interface FinanceCardProps {
  title: string;
  amount: number;
  icon: string;
  trend: number;
  period: string;
  color: 'blue' | 'green' | 'red' | 'purple';
}

const FinanceCard = ({ title, amount, icon, trend, period, color }: FinanceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100',
      border: 'border-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      iconBg: 'bg-green-100',
      border: 'border-green-100'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      iconBg: 'bg-red-100',
      border: 'border-red-100'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      iconBg: 'bg-purple-100',
      border: 'border-purple-100'
    }
  };
  
  const selectedColor = colorClasses[color];
  
  const renderIcon = () => {
    const icons: Record<string, JSX.Element> = {
      'trending-up': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
      ),
      'trending-down': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
      ),
      'wallet': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
      ),
      'credit-card': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
      ),
      'dollar-sign': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      ),
      'bar-chart': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"></line><line x1="18" x2="18" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="16"></line></svg>
      )
    };
    
    return icons[icon] || null;
  };

  return (
    <motion.div
      className={`relative rounded-xl ${selectedColor.bg} border ${selectedColor.border} p-5 overflow-hidden transition-all duration-300`}
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-full ${selectedColor.iconBg}`}>
          <div className={`${selectedColor.text}`}>
            {renderIcon()}
          </div>
        </div>
        
        <motion.span 
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          } flex items-center`}
          animate={{ scale: isHovered ? 1.05 : 1 }}
        >
          {trend > 0 ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 19"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <polyline points="22 17 13.5 8.5 8.5 13.5 2 5"></polyline>
              <polyline points="16 17 22 17 22 11"></polyline>
            </svg>
          )}
          {Math.abs(trend)}%
        </motion.span>
      </div>
      
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      
      <motion.div
        className="text-xl font-bold mb-1"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {formatRupiah(amount)}
      </motion.div>
      
      <p className="text-xs text-gray-500">
        dibanding {period}
      </p>
      
      <motion.div
        className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-tr from-current to-transparent"
        style={{ color: selectedColor.text.replace('text-', '') }}
        animate={{ scale: isHovered ? 1.2 : 1 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

export default FinanceCard;
