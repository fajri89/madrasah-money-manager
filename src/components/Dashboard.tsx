
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FinanceCard from './FinanceCard';
import StudentPayment from './StudentPayment';
import TransactionHistory from './TransactionHistory';
import WhatsAppNotification from './WhatsAppNotification';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  BarChart3, 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserManagement from './UserManagement';

const Dashboard = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [sppCollection, setSppCollection] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-green-700 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Render different dashboard based on user role
  if (user.level === 'admin') {
    return renderAdminDashboard();
  } else if (user.level === 'bendahara') {
    return renderBendaharaDashboard();
  } else if (user.level === 'kepala_sekolah') {
    return renderKepalaSekolahDashboard();
  } else {
    return renderSiswaDashboard();
  }

  function renderAdminDashboard() {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold">Selamat Datang, {user.nama}</h1>
          <p className="text-muted-foreground">Dashboard Admin Sistem Keuangan Madrasah</p>
        </motion.div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-green-700 rounded-full border-t-transparent"></div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Card className="col-span-1 md:col-span-2 xl:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Menu Utama</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="flex justify-start items-center h-20 p-4"
                      onClick={() => navigate('/master-data')}
                    >
                      <Users className="h-8 w-8 mr-4 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium">Data Master</div>
                        <div className="text-xs text-muted-foreground">Kelola data sekolah</div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex justify-start items-center h-20 p-4"
                      onClick={() => navigate('/finance')}
                    >
                      <FileText className="h-8 w-8 mr-4 text-green-600" />
                      <div className="text-left">
                        <div className="font-medium">Keuangan</div>
                        <div className="text-xs text-muted-foreground">Pemasukan & Pengeluaran</div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex justify-start items-center h-20 p-4"
                      onClick={() => navigate('/student-payment')}
                    >
                      <CreditCard className="h-8 w-8 mr-4 text-purple-600" />
                      <div className="text-left">
                        <div className="font-medium">SPP Siswa</div>
                        <div className="text-xs text-muted-foreground">Kelola pembayaran SPP</div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex justify-start items-center h-20 p-4"
                      onClick={() => navigate('/reports')}
                    >
                      <BarChart3 className="h-8 w-8 mr-4 text-amber-600" />
                      <div className="text-left">
                        <div className="font-medium">Laporan</div>
                        <div className="text-xs text-muted-foreground">Laporan keuangan</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1 md:col-span-2 xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">Kelola Pengguna</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserManagement />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionHistory />
              <StudentPayment />
            </div>
          </>
        )}
      </div>
    );
  }

  function renderBendaharaDashboard() {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold">Selamat Datang, {user.nama}</h1>
          <p className="text-muted-foreground">Dashboard Bendahara Sistem Keuangan Madrasah</p>
        </motion.div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-green-700 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <FinanceCard
                title="Total SPP"
                amount={sppCollection}
                icon="credit-card"
                trend={getRandomTrend()}
                period="bulan lalu"
                color="purple"
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
                title="Total Pemasukan"
                amount={income}
                icon="trending-up"
                trend={getRandomTrend()}
                period="bulan lalu"
                color="green"
              />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Input Pembayaran SPP</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full h-20 bg-purple-600 hover:bg-purple-700"
                    onClick={() => navigate('/student-payment')}
                  >
                    <CreditCard className="h-6 w-6 mr-2" />
                    Input Pembayaran SPP
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Input Pengeluaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full h-20 bg-red-600 hover:bg-red-700"
                    onClick={() => navigate('/finance')}
                  >
                    <TrendingDown className="h-6 w-6 mr-2" />
                    Input Pengeluaran
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Input Pemasukan</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full h-20 bg-green-600 hover:bg-green-700"
                    onClick={() => navigate('/finance')}
                  >
                    <TrendingUp className="h-6 w-6 mr-2" />
                    Input Pemasukan
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <StudentPayment />
          </>
        )}
      </div>
    );
  }

  function renderKepalaSekolahDashboard() {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold">Selamat Datang, {user.nama}</h1>
          <p className="text-muted-foreground">Dashboard Kepala Sekolah Sistem Keuangan Madrasah</p>
        </motion.div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-green-700 rounded-full border-t-transparent"></div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Riwayat Pembayaran SPP</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full h-20 bg-purple-600 hover:bg-purple-700"
                    onClick={() => navigate('/reports')}
                  >
                    <Eye className="h-6 w-6 mr-2" />
                    Lihat Riwayat SPP
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Riwayat Pengeluaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full h-20 bg-red-600 hover:bg-red-700"
                    onClick={() => navigate('/reports')}
                  >
                    <Eye className="h-6 w-6 mr-2" />
                    Lihat Pengeluaran
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Riwayat Pemasukan</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full h-20 bg-green-600 hover:bg-green-700"
                    onClick={() => navigate('/reports')}
                  >
                    <Eye className="h-6 w-6 mr-2" />
                    Lihat Pemasukan
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionHistory />
              <StudentPayment />
            </div>
          </>
        )}
      </div>
    );
  }

  function renderSiswaDashboard() {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold">Selamat Datang, {user.nama}</h1>
          <p className="text-muted-foreground">Dashboard Siswa</p>
        </motion.div>
        
        <Card>
          <CardHeader>
            <CardTitle>Portal Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Portal siswa masih dalam pengembangan. Silakan hubungi pihak madrasah untuk informasi lebih lanjut.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default Dashboard;
