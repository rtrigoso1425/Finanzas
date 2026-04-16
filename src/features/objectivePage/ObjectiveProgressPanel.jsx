import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CurrencySymbol } from '@/utils/currencySimbol';

const CircularProgress = ({ value, label, sublabel, color = "#10b981", sublabelColor = "text-slate-500" }) => {
    const radius = 60; 
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg className="h-40 w-40 sm:h-48 sm:w-48 transform -rotate-90">
                <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                <circle cx="50%" cy="50%" r={radius} stroke={color} strokeWidth="8" strokeDasharray={circumference} style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }} strokeLinecap="round" fill="transparent" className="drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">{label}</span>
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1 ${sublabelColor}`}>{sublabel}</span>
            </div>
        </div>
    );
};

const ObjectiveProgressPanel = ({ objective }) => {
    const remainingAmount = Number(objective.remaining_amount ?? 0);
    const totalAmount = Number(objective.total_amount ?? 0);
    const Symbol = CurrencySymbol();

    const formatCurrency = (value) => {
        const amount = Number(value) || 0;
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const daysRemaining = useMemo(() => {
        if (!objective?.end_date) return 0;
        const end = new Date(objective.end_date);
        const now = new Date();
        const diffMs = end.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }, [objective]);

    const progress = useMemo(() => {
        const total = Number(objective?.total_amount ?? 0);
        const remaining = Number(objective?.remaining_amount ?? 0);
        if (!total) return 0;
        const percent = Math.round(((total - remaining) / total) * 100);
        return Math.min(100, Math.max(0, percent));
    }, [objective]);

    return (
        <Card className="border-slate-100 shadow-sm overflow-hidden py-4 sm:py-8">
            <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-around gap-12 sm:gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <CircularProgress 
                            value={(daysRemaining / 30) * 100} 
                            label={`${daysRemaining}`} 
                            sublabel="Días Restantes" 
                            color="#10b981"
                        />
                        {objective.end_date && (
                            <Badge variant="outline" className="text-xs text-slate-500 border-slate-200">
                                Cierre: {new Date(objective.end_date).toLocaleDateString()}
                            </Badge>
                        )}
                    </div>
                    <div className="hidden sm:block w-px h-32 bg-slate-100"></div>
                    <div className="flex flex-col items-center gap-4">
                        <CircularProgress 
                            value={progress} 
                            label={progress === 100 ? "100%" : `${Symbol}${remainingAmount.toFixed(2)}`} 
                            sublabel={progress === 100 ? "ALCANZADO" : "FALTANTE"} 
                            color="#10b981"
                        />
                        <Badge variant="secondary" className="text-xs font-medium text-slate-600 bg-slate-100">
                            Meta total: {Symbol}{totalAmount.toFixed(2)}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ObjectiveProgressPanel;