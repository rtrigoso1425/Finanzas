import { useBalance } from "@/hooks/useBalance";
import { TrendingDown, TrendingUp, DollarSign, Receipt } from 'lucide-react';
import { getTimeAgo } from "@/utils/timeAgo";
import { useMemo } from "react";
import { monthString } from "@/utils/monthString";

const Section = ({ title, items }) => {

    const ingresosDelMes = items
        .filter(item => item.type === 'income')
        .reduce((total, item) => total + Number(item.amount), 0);

    const gastosDelMes = items
        .filter(item => item.type === 'expense')
        .reduce((total, item) => total + Number(item.amount), 0);

    const balanceDelMes = ingresosDelMes - gastosDelMes;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
    };

    return (
        <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-slate-700">{title}</h3>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100/50">
                    <p className="text-emerald-600 font-semibold text-xs uppercase tracking-wider mb-1">Ingresos</p>
                    <p className="text-emerald-700 font-bold text-sm md:text-base">{formatCurrency(ingresosDelMes)}</p>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100/50">
                    <p className="text-rose-600 font-semibold text-xs uppercase tracking-wider mb-1">Gastos</p>
                    <p className="text-rose-700 font-bold text-sm md:text-base">{formatCurrency(gastosDelMes)}</p>
                </div>
                <div className={`p-3 rounded-xl border ${balanceDelMes >= 0 ? 'bg-blue-50 border-blue-100/50' : 'bg-orange-50 border-orange-100/50'}`}>
                    <p className={`font-semibold text-xs uppercase tracking-wider mb-1 ${balanceDelMes >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Balance</p>
                    <p className={`font-bold text-sm md:text-base ${balanceDelMes >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                        {formatCurrency(balanceDelMes)}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {items.map((n) => {
                    const Icon = n.type === 'income' ? TrendingUp : TrendingDown;
                    const isIncome = n.type === 'income';
                    const statusBorder = isIncome ? 'border-emerald-300/80 bg-emerald-50/70' : 'border-rose-300/80 bg-rose-50/70';
                    const statusText = isIncome ? 'text-emerald-700' : 'text-rose-700';
                    const sign = isIncome ? '+' : '-';
                    const amountFormatted = n.amount != null ? formatCurrency(n.amount) : '-';

                    return (
                        <div
                            key={n.id}
                            className={`flex items-center gap-3 p-4 rounded-xl border shadow-sm transition hover:shadow-md ${statusBorder}`}>
                            <div 
                                className={`flex items-center justify-center h-11 w-11 rounded-lg ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                <Icon size={18} strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-base font-semibold text-slate-800">{n.extra_info || 'Transacción'}</p>
                                        <p className="truncate text-sm text-muted-foreground">{n.description || 'Sin descripción'}</p>
                                    </div>
                                    <p className={`text-sm font-bold ${statusText}`}>{sign} {amountFormatted}</p>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">{n.date ? getTimeAgo(n.date) : 'Reciente'}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const TransactionsPage = () => {
    const { balance, isLoading } = useBalance();

    let groupedByMonth = useMemo(() => {

        if (!balance || balance.length === 0) return [];

        let finalGroup = [];
        let groupMonth = [];

        balance.forEach((transaction) => {
            if (
                groupMonth[0]? 
                    new Date(transaction.date).getMonth() === new Date(groupMonth[groupMonth.length - 1].date).getMonth() && new Date(transaction.date).getFullYear() === new Date(groupMonth[groupMonth.length - 1].date).getFullYear() 
                    : true) {
                groupMonth.push(transaction);
            } else {
                finalGroup.push(groupMonth);
                groupMonth = [transaction];
            }
        });
        finalGroup.push(groupMonth);
        return finalGroup;
    }, [balance]);
    
    return (
        <div className="max-w-3xl mx-auto p-6 bg-slate-50 rounded-2xl shadow-inner">
            <h1 className="text-3xl font-extrabold mb-5 text-slate-800">Transacciones</h1>
            
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <p className="text-slate-500 font-medium animate-pulse">Cargando transacciones...</p>
                </div>
            ) : balance.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm mt-8">
                    <div className="bg-slate-100 p-5 rounded-full mb-5 shadow-inner">
                        <Receipt className="h-12 w-12 text-slate-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Aún no hay transacciones</h3>
                    <p className="text-slate-500 max-w-sm text-sm">
                        Tus ingresos, gastos y contribuciones aparecerán aquí una vez que comiences a registrarlos.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {groupedByMonth.map((group, index) => (
                        <Section
                            key={index}
                            title={monthString(group[0])}
                            items={group}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default TransactionsPage;