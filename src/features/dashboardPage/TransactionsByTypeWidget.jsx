import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencySymbol } from '@/utils/currencySimbol';

const COLORS = ['#a855f7', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#64748b'];

const TransactionsByTypeWidget = ({ incomes, expenses }) => {
  const [view, setView] = useState('gastos');
  const Symbol = CurrencySymbol();

  const data = useMemo(() => {
    const source = view === 'gastos' ? expenses : incomes;
    const key = view === 'gastos' ? 'expense' : 'income';
    
    const grouped = source.reduce((acc, curr) => {
      const type = curr.type || 'Otros';
      acc[type] = (acc[type] || 0) + Number(curr[key]);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); 
  }, [incomes, expenses, view]);

  return (
    <Card className="bg-white border-slate-800 text-black h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-black">Desglose por Categoría</CardTitle>
        <div className="flex bg-[#f3f3f3] rounded-lg p-1">
          <button 
            className={`px-3 py-1 text-xs rounded-md transition-colors ${view === 'gastos' ? 'bg-[#1a1d24] text-white' : 'text-black'}`}
            onClick={() => setView('gastos')}
          >
            Gastos
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded-md transition-colors ${view === 'ingresos' ? 'bg-[#1a1d24] text-white' : 'text-black'}`}
            onClick={() => setView('ingresos')}
          >
            Ingresos
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto custom-scrollbar pt-4 space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
              <span className="text-sm text-black">{item.name}</span>
            </div>
            <span className="text-sm font-bold font-mono">
              {view === 'gastos' ? '-' : '+'}{Symbol}{item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TransactionsByTypeWidget;