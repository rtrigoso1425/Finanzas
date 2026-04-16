import { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CurrencySymbol } from '@/utils/currencySimbol';

const COLORS = ['#a855f7', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#64748b'];

const GroupObjectiveWidget = ({ groupObjs }) => {
  const [selectedId, setSelectedId] = useState(groupObjs[0]?.group_goal_id || '');
  const Symbol = CurrencySymbol();

  const objective = useMemo(() => {
    return groupObjs.find(g => g.group_goal_id === selectedId)?.group_objectives;
  }, [selectedId, groupObjs]);

  const pieData = useMemo(() => {
    if (!objective) return [];
    const membersData = (objective.otros_miembros || []).map(m => ({
      name: m.profiles?.username || 'Usuario',
      value: m.contribution || 0,
      avatar: m.profiles?.avatar_url
    }));
    membersData.push({ name: 'Faltante', value: objective.remaining_amount || 0, isRemaining: true });
    return membersData;
  }, [objective]);

  useEffect(() => {
    if (groupObjs.length > 0 && !groupObjs.some(g => g.group_goal_id === selectedId)) {
      setSelectedId(groupObjs[0].group_goal_id);
    }
  }, [groupObjs, selectedId]);


  return (
    <Card className="bg-white border-slate-800 text-black h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="text-sm font-medium text-black">Análisis Grupal</CardTitle>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-[180px] h-8 bg-gray-50 border-0 text-xs focus:ring-0">
            <SelectValue placeholder="Selecciona objetivo" />
          </SelectTrigger>
          <SelectContent className="bg-gray-50 border-slate-700 text-black">
            {groupObjs.map(g => (
              <SelectItem key={g.group_goal_id} value={g.group_goal_id}>
                {g.group_objectives.objective_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      
      {!objective ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">No hay objetivos grupales</div>
      ) : (
        <CardContent className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="w-full sm:w-1/2 space-y-3">
            {pieData.filter(d => !d.isRemaining).map((member, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[#f3f3f3] p-2 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-black text-xs">{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-black">{member.name}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: COLORS[idx % COLORS.length] }}>
                  {Symbol}{member.value}
                </span>
              </div>
            ))}
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isRemaining ? '#4f5565' : COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#2a2d35', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default GroupObjectiveWidget;