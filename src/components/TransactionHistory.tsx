
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api, formatRupiah, formatDate } from '@/utils/api';

interface Transaction {
  id: number;
  tanggal: string;
  jumlah: number;
  keterangan: string;
  type: 'masuk' | 'keluar';
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pemasukan, pengeluaran] = await Promise.all([
          api.getPemasukan(),
          api.getPengeluaran()
        ]);
        
        // Format the data with type indicators
        const pemasukanWithType = pemasukan.map(item => ({
          ...item,
          type: 'masuk' as const
        }));
        
        const pengeluaranWithType = pengeluaran.map(item => ({
          ...item,
          type: 'keluar' as const
        }));
        
        // Combine, sort by date (newest first)
        const combined = [...pemasukanWithType, ...pengeluaranWithType]
          .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
        
        setTransactions(combined);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <motion.div
      className="glass-card rounded-xl p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Riwayat Transaksi Terbaru</h3>
        
        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          Lihat Semua
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
      
      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>Belum ada transaksi</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-hidden">
          {transactions.slice(0, 5).map((transaction, index) => (
            <motion.div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'masuk' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'masuk' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 15 6-6 6 6"></path>
                    </svg>
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-medium">{transaction.keterangan}</p>
                  <p className="text-xs text-gray-500">{formatDate(transaction.tanggal)}</p>
                </div>
              </div>
              
              <div className={`text-sm font-semibold ${
                transaction.type === 'masuk' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {transaction.type === 'masuk' ? '+' : '-'} {formatRupiah(transaction.jumlah)}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TransactionHistory;
