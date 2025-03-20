
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { getMonthlySummary } from "@/utils/api";
import { slideUp, staggerContainer } from "@/utils/transitions";
import { formatRupiah } from "@/utils/api";

const FinancialCharts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["financial-summary"],
    queryFn: getMonthlySummary
  });

  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  
  // Get current month name in Indonesian
  useEffect(() => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const currentMonth = months[new Date().getMonth()];
    setActiveMonth(currentMonth);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-green-700">Memuat data keuangan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-red-500">Terjadi kesalahan saat memuat data keuangan</p>
      </div>
    );
  }

  const chartConfig = {
    income: {
      label: "Penerimaan",
      theme: {
        light: "#059669",
        dark: "#10b981",
      },
    },
    expense: {
      label: "Pengeluaran",
      theme: {
        light: "#e11d48",
        dark: "#f43f5e",
      },
    },
    spp: {
      label: "SPP",
      theme: {
        light: "#0369a1",
        dark: "#0ea5e9",
      },
    },
  };

  // Filter for current month data
  const currentMonthIncomeData = data?.income.find(item => item.name === activeMonth);
  const currentMonthExpenseData = data?.expenses.find(item => item.name === activeMonth);
  const currentMonthSppData = data?.spp.find(item => item.name === activeMonth);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
    >
      {/* Penerimaan Bulanan Chart */}
      <motion.div variants={slideUp} className="col-span-1 md:col-span-2 lg:col-span-1">
        <Card className="overflow-hidden border-green-100">
          <CardHeader className="bg-green-50 pb-2">
            <CardTitle className="text-lg text-green-700">Penerimaan Bulanan</CardTitle>
            <CardDescription>
              Total bulan {activeMonth}: {formatRupiah(currentMonthIncomeData?.value || 0)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ChartContainer 
                config={chartConfig}
                className="h-full"
              >
                <BarChart data={data?.income}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }} 
                    tickFormatter={(value) => value.substring(0, 3)}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value/1000}k`}
                    tick={{ fontSize: 10 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        formatter={(value: number) => formatRupiah(value)}
                      />
                    }
                  />
                  <Bar 
                    dataKey="value" 
                    name="income" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                    fill="url(#colorIncome)"
                  />
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pengeluaran Bulanan Chart */}
      <motion.div variants={slideUp} className="col-span-1 md:col-span-2 lg:col-span-1">
        <Card className="overflow-hidden border-red-100">
          <CardHeader className="bg-red-50 pb-2">
            <CardTitle className="text-lg text-red-700">Pengeluaran Bulanan</CardTitle>
            <CardDescription>
              Total bulan {activeMonth}: {formatRupiah(currentMonthExpenseData?.value || 0)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ChartContainer 
                config={chartConfig}
                className="h-full"
              >
                <LineChart data={data?.expenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }} 
                    tickFormatter={(value) => value.substring(0, 3)}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value/1000}k`}
                    tick={{ fontSize: 10 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        formatter={(value: number) => formatRupiah(value)}
                      />
                    }
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="expense"
                    stroke="#e11d48" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* SPP Bulanan Chart */}
      <motion.div variants={slideUp} className="col-span-1 md:col-span-2 lg:col-span-1">
        <Card className="overflow-hidden border-blue-100">
          <CardHeader className="bg-blue-50 pb-2">
            <CardTitle className="text-lg text-blue-700">SPP Terbayar</CardTitle>
            <CardDescription>
              Total bulan {activeMonth}: {formatRupiah(currentMonthSppData?.value || 0)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ChartContainer 
                config={chartConfig}
                className="h-full"
              >
                <BarChart data={data?.spp}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }} 
                    tickFormatter={(value) => value.substring(0, 3)}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value/1000}k`}
                    tick={{ fontSize: 10 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        formatter={(value: number) => formatRupiah(value)}
                      />
                    }
                  />
                  <Bar 
                    dataKey="value" 
                    name="spp"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                    fill="url(#colorSpp)"
                  />
                  <defs>
                    <linearGradient id="colorSpp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0369a1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0369a1" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FinancialCharts;
