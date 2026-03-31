import { useState, useMemo, use } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBalance } from '@/hooks/useBalance';

const BalanceBarChart = ({ incomes, expenses }) => {
  const [range, setRange] = useState('mes');
  const { balance, isLoading } = useBalance();
  const today = new Date()
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const monthData = useMemo(() => {
    const week1 = { name: 'Sem 1', balance: 0.00 };
    const week2 = { name: 'Sem 2', balance: 0.00 };
    const week3 = { name: 'Sem 3', balance: 0.00 };
    const week4 = { name: 'Sem 4', balance: 0.00 };
    const monthBalance = [];
    balance.forEach(item => {
      if (new Date(item.date).getMonth()===thisMonth && new Date(item.date).getFullYear()===thisYear){
        monthBalance.push(item);
      }
    });

    monthBalance.forEach(item => {
      const day = new Date(item.date).getDate();
      switch (true) {
        case (day >= 1 && day <= 7):
          item.type === 'income' ? week1.balance += item.amount : week1.balance -= item.amount;
          break;
        case (day >= 8 && day <= 14):
          item.type === 'income' ? week2.balance += item.amount : week2.balance -= item.amount;
          break;
        case (day >= 15 && day <= 21):
          item.type === 'income' ? week3.balance += item.amount : week3.balance -= item.amount;
          break;
        case (day >= 22 && day <= 31):
          item.type === 'income' ? week4.balance += item.amount : week4.balance -= item.amount;
          break;
      }
    });

    return [
      week1,
      week2,
      week3,
      week4
    ];
  }, [incomes, expenses, isLoading]);

  const weekData = useMemo(() => {
    if (!balance) return [];

    const days = [
      { name: 'Lun', balance: 0.00 },
      { name: 'Mar', balance: 0.00 },
      { name: 'Mié', balance: 0.00 },
      { name: 'Jue', balance: 0.00 },
      { name: 'Vie', balance: 0.00 },
      { name: 'Sab', balance: 0.00 },
      { name: 'Dom', balance: 0.00 },
    ];

    const hoy = new Date();
    const diaActual = hoy.getDay();
    const distanciaAlLunes = diaActual === 0 ? 6 : diaActual - 1;
    
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - distanciaAlLunes);
    inicioSemana.setHours(0, 0, 0, 0);

    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);

    balance.forEach(item => {
      const fechaItem = new Date(item.date);

      if (fechaItem >= inicioSemana && fechaItem <= finSemana) {
        const numDia = fechaItem.getDay(); 
        
        const indexArray = numDia === 0 ? 6 : numDia - 1; 

        if (item.type === 'income') {
          days[indexArray].balance += item.amount;
        } else {
          days[indexArray].balance -= item.amount;
        }
      }
    });

    return days;
  }, [incomes, expenses, isLoading]);

  const chartData = range === 'semana' ? weekData : monthData;

  return (
    isLoading ? (
      <Card className="bg-white border-slate-800 text-black h-full flex items-center justify-center">
        <p className="text-sm text-gray-500">Cargando...</p>
      </Card>
    ) : (
      <Card className="bg-white border-slate-800 text-black h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-black">Balance Neto</CardTitle>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[100px] h-8 bg-gray-50 border-0 text-xs focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-50 border-slate-700 text-black">
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mes</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pb-4 px-4 w-full">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="gray-50" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} interval={0} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1d24', borderColor: '#2a2d35', borderRadius: '8px' }} 
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  cursor={{ fill: '#f1f5f9' }} 
                />
                <Bar dataKey="balance" radius={[4, 4, 4, 4]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.balance >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  );
};

export default BalanceBarChart;