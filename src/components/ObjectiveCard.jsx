import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import { CurrencySymbol } from '@/utils/currencySimbol';
import { symbol } from 'framer-motion/client';

const ObjectiveCard = ({ objective }) => {
  const Symbol = CurrencySymbol();
  const createdAt = objective.created_at ? new Date(objective.created_at) : new Date();
  const endDate = new Date(objective.end_date);
  const now = new Date();
  
  const totalTime = endDate.getTime() - createdAt.getTime();
  const elapsedTime = now.getTime() - createdAt.getTime();
  const timeProgress = totalTime > 0 ? Math.max(0, Math.min(100, (elapsedTime / totalTime) * 100)) : 100;
  
  const totalAmount = Number(objective.total_amount) || 0;
  const remainingAmount = Number(objective.remaining_amount) || 0;
  const moneyProgress = totalAmount > 0
    ? Math.max(0, Math.min(100, ((totalAmount - remainingAmount) / totalAmount) * 100))
    : 0;
    
  const isCompleted = remainingAmount <= 0;
  const daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
  const isOverdue = now > endDate && !isCompleted;

  return (
    <Card className={`relative p-6 bg-white border-2 shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-300 rounded-2xl overflow-hidden group ${
      isOverdue ? 'border-red-200 hover:border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.1)] hover:shadow-[0_0_25px_rgba(220,38,38,0.3)]' : 'border-emerald-100 hover:border-emerald-400'
    }`}>
      
      <div className={`absolute top-0 left-0 w-full h-1 ${isOverdue ? 'bg-gradient-to-r from-red-200 via-red-500 to-red-200' : 'bg-gradient-to-r from-emerald-200 via-emerald-500 to-emerald-200'} opacity-70`} />
      <div className={`absolute top-0 right-4 w-12 h-1 ${isOverdue ? 'bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.8)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'}`} />

      <CardHeader className="pb-4 pt-2">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight line-clamp-2">
              {objective.reason}
            </CardTitle>
          </div>
          <div className={`shrink-0 px-3 py-1 border text-xs font-bold uppercase tracking-widest rounded-full ${
            isOverdue ? 'bg-red-50 border-red-200 text-red-600' : isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            {isOverdue ? 'Vencido' : isCompleted ? 'Completado' : 'En Curso'}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-emerald-100 border-2 border-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
            <Target className="h-6 w-6" />
          </div>
          <div className="text-sm text-slate-500 font-medium">Objetivo Personal</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span className={isOverdue ? 'text-red-500' : ''}>
                {isOverdue ? 'Días Excedidos' : 'Días Restantes'}
              </span>
            </div>
            <Progress value={timeProgress} className="h-2 bg-slate-200 [&>div]:bg-emerald-400" />
            <span className={`font-mono block ${isOverdue ? 'text-red-500' : 'text-emerald-600'}`}>
              {isOverdue ? `-${Math.abs(daysLeft)} DÍAS` : `${daysLeft} DÍAS`}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Falta</span>
            </div>
            <Progress value={moneyProgress} className="h-2 bg-slate-200 [&>div]:bg-emerald-500" />
            <span className="font-mono block text-emerald-600">
              {Symbol}{remainingAmount.toFixed(2)}
            </span>
          </div>

        </div>

        {isCompleted && (
          <div className="flex items-center justify-center gap-2 text-center text-emerald-700 font-bold bg-emerald-50/80 border border-emerald-200 p-3 rounded-lg uppercase tracking-wide text-sm">
            <span>Objetivo Cumplido</span>
          </div>
        )}

        <a 
          href={`/objectives/${objective.id}`} 
          className="mt-6 w-full group/btn flex items-center justify-center gap-2 bg-transparent border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white font-bold uppercase tracking-widest py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        >
          Ver Detalles
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/btn:translate-x-1">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </a>

      </CardContent>
    </Card>
  );
};

export default ObjectiveCard;