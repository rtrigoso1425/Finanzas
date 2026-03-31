import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';


const GroupObjectiveCard = ({ membership }) => {
  const goal = membership.group_objectives;
  const allMembers = goal.otros_miembros || [];
  
  const membersWithState = [
    { profiles: membership.profiles, state: membership.state },
    ...allMembers
      .filter((m) => m.state === 'active' && m.member_id !== membership.member_id)
      .map((m) => ({ profiles: m.profiles, state: m.state })),
  ];

  const uniqueMembers = membersWithState
    .map((m) => m.profiles)
    .filter(Boolean)
    .filter(
      (v, i, arr) => arr.findIndex((p) => p.id === v.id) === i
    );

  const createdAt = new Date(goal.created_at);
  const endDate = new Date(goal.end_date);
  const now = new Date();
  const totalTime = endDate - createdAt;
  const elapsedTime = now - createdAt;
  const timeProgress = Math.max(0, (elapsedTime / totalTime) * 100);
  const moneyProgress =
    goal.total_amount > 0
      ? ((goal.total_amount - goal.remaining_amount) / goal.total_amount) * 100
      : 0;
  const isCompleted = goal.remaining_amount <= 0;
  const daysLeft = Math.max(
    0,
    Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
  );
  const isOverdue = now > endDate;

  return (
    <Card className={`relative p-6 bg-white border-2 shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] transition-all duration-300 rounded-2xl overflow-hidden group ${
      isOverdue ? 'border-red-200 hover:border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.1)] hover:shadow-[0_0_25px_rgba(220,38,38,0.3)]' : 'border-green-100 hover:border-green-400'
    }`}>
      
      {/* Detalle decorativo futurista superior */}
      <div className={`absolute top-0 left-0 w-full h-1 ${isOverdue ? 'bg-gradient-to-r from-red-200 via-red-500 to-red-200' : 'bg-gradient-to-r from-green-200 via-green-500 to-green-200'} opacity-70`} />
      <div className={`absolute top-0 right-4 w-12 h-1 ${isOverdue ? 'bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`} />

      <CardHeader className="pb-4 pt-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">
              {goal.objective_name}
            </CardTitle>
            {goal.description && (
              <CardDescription className="text-sm text-slate-500 mt-1">
                {goal.description}
              </CardDescription>
            )}
          </div>
          {/* Indicador de estado estilo badge */}
          <div className={`px-3 py-1 border text-xs font-bold uppercase tracking-widest rounded-full ${
            isOverdue ? 'bg-red-50 border-red-200 text-red-600' : isCompleted ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            {isOverdue ? 'Vencido' : isCompleted ? 'Completado' : 'En Curso'}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avatares */}
        <div className="flex -space-x-3">
          {uniqueMembers.slice(0, 5).map((member, idx) => (
            <div key={idx} className="relative transition-transform hover:-translate-y-1">
              <Avatar
                className={`h-11 w-11 border-2 ${
                  member.id === goal.owner_id
                    ? 'border-green-500 ring-2 ring-green-100 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                    : 'border-white shadow-sm'
                }`}
              >
                <AvatarImage src={member.avatar_url} alt={member.full_name} />
                <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                  {member.full_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {member.id === goal.owner_id && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  ★
                </div>
              )}
            </div>
          ))}
          {uniqueMembers.length > 5 && (
            <div className="h-11 w-11 rounded-full bg-green-50 flex items-center justify-center text-xs font-bold text-green-700 border-2 border-white shadow-sm z-10">
              +{uniqueMembers.length - 5}
            </div>
          )}
        </div>

        {/* Sección de Progreso (Grid para aspecto de panel) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          
          {/* Time Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span className={isOverdue ? 'text-red-500' : ''}>
                {isOverdue ? 'Dias Excedidos' : 'Dias Restantes'}
              </span>
            </div>
            {/* Nota: className [&>div] inyecta el color verde si tu componente Progress de shadcn usa la variable primaria por defecto */}
            <Progress value={timeProgress} className="h-2 bg-slate-200 [&>div]:bg-green-400" />
            <span className={`font-mono ${isOverdue ? 'text-red-500' : 'text-green-600'}`}>
              {isOverdue ? `-${Math.abs(daysLeft)} DÍAS` : `${daysLeft} DÍAS`}
            </span>
          </div>

          {/* Money Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Dinero faltante</span>
            </div>
            <Progress value={moneyProgress} className="h-2 bg-slate-200 [&>div]:bg-green-500" />
            <span className="font-mono text-green-600">
                Falta: ${goal.remaining_amount} 
            </span>
          </div>

        </div>

        {isCompleted && (
          <div className="flex items-center justify-center gap-2 text-center text-green-700 font-bold bg-green-50/80 border border-green-200 p-3 rounded-lg uppercase tracking-wide text-sm">
            <span>Objetivo Cumplido</span>
          </div>
        )}

        {/* Botón de Redirección */}
        <a 
          href={`/grupal-objectives/${goal.id}`} 
          className="mt-6 w-full group/btn flex items-center justify-center gap-2 bg-transparent border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-bold uppercase tracking-widest py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]"
        >
          Ver Objetivo
          {/* Icono de flecha simple en SVG */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="transition-transform duration-300 group-hover/btn:translate-x-1"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </a>

      </CardContent>
    </Card>
  );
};

export default GroupObjectiveCard;