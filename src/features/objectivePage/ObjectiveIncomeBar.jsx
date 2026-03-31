import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Plus } from 'lucide-react';

const ObjectiveIncomeBar = ({ incomes, remainingAmount, isCompleted, isOverdue, onOpenAddModal }) => {
    const formatCurrency = (value) => {
        const amount = Number(value) || 0;
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="lg:col-span-4 h-full">
            <Card className="border-slate-100 shadow-sm h-full flex flex-col bg-white">
                <CardHeader className="border-b border-slate-50 py-4 px-5">
                    <CardTitle className="text-base font-semibold text-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            Registro de Aportes
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                                {incomes.length}
                            </Badge>
                        </div>
                        {!isCompleted && !isOverdue && (
                            <Button 
                                size="sm" 
                                className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                                onClick={onOpenAddModal}
                            >
                                <Plus className="w-4 h-4 mr-1" /> Aporte
                            </Button>
                        )}
                        {isOverdue && (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">
                                Vencido
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
            
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <div className="h-full max-h-[600px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {incomes.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <Wallet className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-sm text-slate-500">Aún no hay aportes registrados.</p>
                            </div>
                        ) : (
                            incomes
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                .map((income) => (
                                    <div 
                                        key={income.id} 
                                        className="flex flex-col p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm hover:border-emerald-100 transition-all gap-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                                                    <Wallet className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(income.created_at).toLocaleDateString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-emerald-600">
                                                +{formatCurrency(income.income)} 
                                            </span>
                                        </div>
                                        {income.message && (
                                            <p className="text-xs text-slate-500 italic ml-10">"{income.message}"</p>
                                        )}
                                    </div>
                                ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ObjectiveIncomeBar;