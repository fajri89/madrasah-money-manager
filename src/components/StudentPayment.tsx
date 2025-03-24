import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api, formatRupiah } from '@/utils/api';

interface StudentPaymentItem {
  id: number;
  siswa_id: number;
  tanggal: string;
  bulan: string;
  tahun: string;
  jumlah: number;
  status: string;
}

interface Student {
  id: number;
  nis: string;
  nama: string;
  telepon: string; // Added telepon property to fix the error
}

const StudentPayment = () => {
  const [payments, setPayments] = useState<StudentPaymentItem[]>([]);
  const [students, setStudents] = useState<Record<number, Student>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsData, studentsData] = await Promise.all([
          api.getSpp(),
          api.getSiswa()
        ]);
        
        // Convert student array to a lookup object by id
        const studentsMap = studentsData.reduce((acc, student) => {
          acc[student.id] = student;
          return acc;
        }, {} as Record<number, Student>);
        
        setPayments(paymentsData);
        setStudents(studentsMap);
      } catch (error) {
        console.error('Error fetching payment data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const student = students[payment.siswa_id];
    if (!student) return false;
    
    const searchString = `${student.nama} ${student.nis} ${payment.bulan} ${payment.tahun} ${payment.status}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'lunas':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'belum lunas':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'menunggak':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sendWhatsAppReminder = async (studentId: number) => {
    const student = students[studentId];
    if (!student) return;
    
    try {
      await api.sendWhatsAppNotification(
        student.telepon,
        `Pengingat: Pembayaran SPP untuk bulan ini belum dilunasi. Mohon segera melakukan pembayaran. Terima kasih.`
      );
      // Here you would show a success message using a toast
      console.log('WhatsApp notification sent successfully');
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
    }
  };

  return (
    <motion.div
      className="glass-card rounded-xl p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Pembayaran SPP Siswa</h3>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Cari siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-1 pl-8 pr-4 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
          />
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
            className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
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
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p>Tidak ada data pembayaran ditemukan</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Siswa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.slice(0, 5).map((payment) => {
                const student = students[payment.siswa_id];
                if (!student) return null;
                
                return (
                  <motion.tr 
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layout
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.nama}</div>
                          <div className="text-xs text-gray-500">{student.nis}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.bulan} {payment.tahun}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatRupiah(payment.jumlah)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.status.toLowerCase() !== 'lunas' && (
                        <button
                          onClick={() => sendWhatsAppReminder(payment.siswa_id)}
                          className="text-blue-600 hover:text-blue-900 text-xs flex items-center"
                        >
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
                            className="mr-1"
                          >
                            <path d="M6 9v13-13z"></path>
                            <rect width="4" height="13" x="10" y="9" rx="1"></rect>
                            <rect width="4" height="13" x="18" y="9" rx="1"></rect>
                            <path d="M4 4h20l-1.938-2H5.938z"></path>
                          </svg>
                          Ingatkan via WA
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default StudentPayment;
