
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FinanceCard from './FinanceCard';
import StudentPayment from './StudentPayment';
import TransactionHistory from './TransactionHistory';
import WhatsAppNotification from './WhatsAppNotification';
import { api } from '@/utils/api';

const Dashboard = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [sppCollection, setSppCollection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch financial data
        const [pemasukan, pengeluaran, spp] = await Promise.all([
          api.getPemasukan(),
          api.getPengeluaran(),
          api.getSpp()
        ]);
        
        // Calculate totals
        const totalIncome = pemasukan.reduce((sum, item) => sum + item.jumlah, 0);
        const totalExpense = pengeluaran.reduce((sum, item) => sum + item.jumlah, 0);
        const totalSpp = spp.reduce((sum, item) => sum + item.jumlah, 0);
        
        setIncome(totalIncome);
        setExpense(totalExpense);
        setBalance(totalIncome - totalExpense);
        setSppCollection(totalSpp);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate random trends for demo purposes
  const getRandomTrend = () => {
    return Math.floor(Math.random() * 30) - 10;
  };

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="pt-20 px-4 sm:px-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold">Sistem Keuangan Madrasah</h1>
        <p className="text-muted-foreground">Pantau dan kelola keuangan madrasah dengan mudah</p>
      </motion.div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <svg
            className="animate-spin h-10 w-10 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <FinanceCard
              title="Total Pemasukan"
              amount={income}
              icon="trending-up"
              trend={getRandomTrend()}
              period="bulan lalu"
              color="green"
            />
            <FinanceCard
              title="Total Pengeluaran"
              amount={expense}
              icon="trending-down"
              trend={getRandomTrend()}
              period="bulan lalu"
              color="red"
            />
            <FinanceCard
              title="Saldo Keuangan"
              amount={balance}
              icon="wallet"
              trend={getRandomTrend()}
              period="bulan lalu"
              color="blue"
            />
            <FinanceCard
              title="Pembayaran SPP"
              amount={sppCollection}
              icon="credit-card"
              trend={getRandomTrend()}
              period="bulan lalu"
              color="purple"
            />
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <StudentPayment />
              <TransactionHistory />
            </div>
            
            <div>
              <WhatsAppNotification />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
