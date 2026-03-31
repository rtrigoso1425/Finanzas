import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBalance } from '@/hooks/useBalance';

const IncomeExpenseChart = () => {
  const [range, setRange] = useState('mes');
  const { balance, isLoading } = useBalance();

  const hoy = new Date();
  const thisMonth = hoy.getMonth();
  const thisYear = hoy.getFullYear();

  const weekData = useMemo(() => {
    if (!balance) return [];
    const days = [
      { name: 'Lun', ingreso: 0, gasto: 0 },
      { name: 'Mar', ingreso: 0, gasto: 0 },
      { name: 'Mié', ingreso: 0, gasto: 0 },
      { name: 'Jue', ingreso: 0, gasto: 0 },
      { name: 'Vie', ingreso: 0, gasto: 0 },
      { name: 'Sáb', ingreso: 0, gasto: 0 },
      { name: 'Dom', ingreso: 0, gasto: 0 },
    ];

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
          days[indexArray].ingreso += item.amount;
        } else {
          days[indexArray].gasto += item.amount;
        }
      }
    });
    return days;
  }, [balance]);

  const monthData = useMemo(() => {
    if (!balance) return [];
    const weeks = [
      { name: 'Sem 1', ingreso: 0, gasto: 0 },
      { name: 'Sem 2', ingreso: 0, gasto: 0 },
      { name: 'Sem 3', ingreso: 0, gasto: 0 },
      { name: 'Sem 4', ingreso: 0, gasto: 0 },
    ];

    balance.forEach(item => {
      const date = new Date(item.date);
      if (date.getMonth() === thisMonth && date.getFullYear() === thisYear) {
        const day = date.getDate();
        let idx = 0;
        
        if (day >= 8 && day <= 14) idx = 1;
        else if (day >= 15 && day <= 21) idx = 2;
        else if (day >= 22) idx = 3;

        if (item.type === 'income') weeks[idx].ingreso += item.amount;
        else weeks[idx].gasto += item.amount;
      }
    });
    return weeks;
  }, [balance, thisMonth, thisYear]);

  const yearData = useMemo(() => {
    if (!balance) return [];
    const months = [
      { name: 'Ene', ingreso: 0, gasto: 0 }, { name: 'Feb', ingreso: 0, gasto: 0 },
      { name: 'Mar', ingreso: 0, gasto: 0 }, { name: 'Abr', ingreso: 0, gasto: 0 },
      { name: 'May', ingreso: 0, gasto: 0 }, { name: 'Jun', ingreso: 0, gasto: 0 },
      { name: 'Jul', ingreso: 0, gasto: 0 }, { name: 'Ago', ingreso: 0, gasto: 0 },
      { name: 'Sep', ingreso: 0, gasto: 0 }, { name: 'Oct', ingreso: 0, gasto: 0 },
      { name: 'Nov', ingreso: 0, gasto: 0 }, { name: 'Dic', ingreso: 0, gasto: 0 },
    ];

    balance.forEach(item => {
      const date = new Date(item.date);
      // Evaluamos solo las transacciones del año actual
      if (date.getFullYear() === thisYear) {
        const monthIdx = date.getMonth();
        
        if (item.type === 'income') months[monthIdx].ingreso += item.amount;
        else months[monthIdx].gasto += item.amount;
      }
    });
    return months;
  }, [balance, thisYear]);

  const chartData = useMemo(() => {
    if (range === 'semana') return weekData;
    if (range === 'ano') return yearData;
    return monthData;
  }, [range, weekData, monthData, yearData]);

  return (
    isLoading ? (
      <Card className="bg-white border-slate-800 text-black h-full flex items-center justify-center min-h-[320px]">
        <p className="text-sm text-gray-500 animate-pulse">Cargando flujo de caja...</p>
      </Card>
    ) : (
      <Card className="bg-white border-slate-800 text-black h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-black">Flujo de Caja</CardTitle>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[120px] h-8 bg-[#f3f3f3] border-0 text-xs focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#f3f3f3] border-slate-700 text-black">
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mes</SelectItem>
              <SelectItem value="ano">Año</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pb-4 px-4 w-full flex-1">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngreso" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff2e2e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff2e2e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d24', borderColor: '#2a2d35', color: '#fff', borderRadius: '8px' }} 
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="ingreso" stroke="#10b981" fillOpacity={1} fill="url(#colorIngreso)" />
                <Area type="monotone" dataKey="gasto" stroke="#ff0000" fillOpacity={1} fill="url(#colorGasto)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  );
};

export default IncomeExpenseChart;