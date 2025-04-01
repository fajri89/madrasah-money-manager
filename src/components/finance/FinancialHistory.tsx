
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api, formatRupiah, formatDate } from "@/utils/api";

interface Transaction {
  id: number;
  tanggal: string;
  jumlah: number;
  keterangan: string;
  type: "masuk" | "keluar";
}

const FinancialHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "masuk" | "keluar">("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both income and expense data from Supabase
        const [pemasukan, pengeluaran] = await Promise.all([
          api.getPemasukan(),
          api.getPengeluaran(),
        ]);

        // Format the data with type indicators
        const pemasukanWithType = pemasukan.map((item) => ({
          ...item,
          type: "masuk" as const,
        }));

        const pengeluaranWithType = pengeluaran.map((item) => ({
          ...item,
          type: "keluar" as const,
        }));

        // Combine, sort by date (newest first)
        const combined = [...pemasukanWithType, ...pengeluaranWithType].sort(
          (a, b) =>
            new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        );

        setTransactions(combined);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter transactions based on selected filter
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Riwayat Transaksi
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "all"
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter("masuk")}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "masuk"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setFilter("keluar")}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "keluar"
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            Pengeluaran
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-gray-600 rounded-full border-t-transparent"></div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p>Tidak ada transaksi</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 font-medium">Tanggal</th>
                <th className="pb-3 font-medium">Keterangan</th>
                <th className="pb-3 font-medium text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTransactions.map((transaction) => (
                <motion.tr
                  key={`${transaction.type}-${transaction.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="py-3">{formatDate(transaction.tanggal)}</td>
                  <td className="py-3">{transaction.keterangan}</td>
                  <td
                    className={`py-3 text-right font-medium ${
                      transaction.type === "masuk"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "masuk" ? "+" : "-"}{" "}
                    {formatRupiah(transaction.jumlah)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default FinancialHistory;
