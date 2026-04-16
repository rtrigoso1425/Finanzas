import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencySymbol } from '@/utils/currencySimbol';

const ObjectivesSummary = ({ personalObjs, groupObjs }) => {
  const Symbol = CurrencySymbol();
  const sortedObjectives = useMemo(() => {
    const combined = [
      ...personalObjs.map(o => ({ id: `p-${o.id}`, name: o.reason, date: new Date(o.end_date), type: 'Personal', remaining: o.remaining_amount })),
      ...groupObjs.map(o => ({ id: `g-${o.id}`, name: o.group_objectives.objective_name, date: new Date(o.group_objectives.end_date), type: 'Grupal', remaining: o.group_objectives.remaining_amount }))
    ];
    return combined.sort((a, b) => a.date - b.date).slice(0, 5); 
  }, [personalObjs, groupObjs]);

  return (
    <Card className="bg-white border-slate-800 text-black h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-black">Próximos Objetivos</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
        {sortedObjectives.map((obj) => (
          <div key={obj.id} className="flex justify-between items-center bg-[#f3f3f3] p-3 rounded-xl">
            <div>
              <p className="text-sm font-medium line-clamp-1">{obj.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${obj.type === 'Grupal' ? 'bg-purple-300 text-white' : 'bg-blue-300 text-white'}`}>
                  {obj.type}
                </span>
                <span className="text-xs text-slate-400">{obj.date.toLocaleDateString()}</span>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-400">{Symbol}{obj.remaining}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ObjectivesSummary;