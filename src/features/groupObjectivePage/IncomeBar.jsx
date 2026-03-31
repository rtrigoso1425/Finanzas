import { groupIncomesService } from '@/features/groupObjectives/groupIncomesService';
import { useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Wallet, Crown } from 'lucide-react';

const IncomeBar = ({ incomes, groupObjective, fetchGroupObjective, isOwner, isOverdue }) => {
    const [verifyingIncomeId, setVerifyingIncomeId] = useState(null);

    const formatCurrency = (value) => {
        const amount = Number(value) || 0;
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleVerifyIncome = async (incomeId) => {
        setVerifyingIncomeId(incomeId);
        try {
            await groupIncomesService.verifyIncome(incomeId, true);
            await fetchGroupObjective();
        } catch (err) {
            console.error('Error verificando aporte:', err);
        } finally {
            setVerifyingIncomeId(null);
        }
    };
    return(
        <div className="lg:col-span-4 h-full">
            <Card className="border-slate-100 shadow-sm h-full flex flex-col bg-white">
                <CardHeader className="border-b border-slate-50 py-4 px-5">
                    <CardTitle className="text-base font-semibold text-slate-800 flex items-center justify-between">
                        Registro de Aportes
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                                {incomes.length} Movimientos
                            </Badge>
                            {isOverdue && (
                                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">
                                    Vencido
                                </Badge>
                            )}
                        </div>
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
                            .map((income) => {
                                const isIncomeOwner = income.member?.member_id === groupObjective?.owner_id;

                                return (
                                    <div 
                                        key={income.id} 
                                        className="group flex flex-col p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm hover:border-emerald-100 transition-all gap-3"
                                    >
                                        {/* Cabecera del Aporte (Usuario y Fecha) */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar 
                                                    className={`w-8 h-8 border shadow-sm ${
                                                        isIncomeOwner ? 'border-amber-400 ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-50' : 'border-white'
                                                    }`}
                                                >
                                                    <AvatarImage src={income.member?.profiles?.avatar_url} />
                                                    <AvatarFallback className="text-xs">
                                                        {income.member?.profiles?.full_name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700 leading-none flex items-center gap-1">
                                                        {income.member?.profiles?.full_name}
                                                        {isIncomeOwner && <Crown className="w-3 h-3 text-amber-500" />}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 mt-1 block">
                                                        {new Date(income.created_at).toLocaleDateString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                                    
                                            {/* Monto */}
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-emerald-600">
                                                    {formatCurrency(income.income)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Mensaje o Estado */}
                                        <div className="flex items-center justify-between mt-1 pl-10">
                                            <div className="flex-1">
                                                {income.message ? (
                                                    <p className="text-xs text-slate-500 italic line-clamp-1">"{income.message}"</p>
                                                ) : (
                                                    <p className="text-xs text-slate-400">Sin mensaje</p>
                                                )}
                                            </div>
                            
                                            <div className="flex items-center ml-2">
                                                {income.verified ? (
                                                    <Badge variant="outline" className="text-[9px] border-emerald-200 text-emerald-600 bg-emerald-50/50 py-0 h-5">
                                                        Verificado
                                                    </Badge>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[9px] border-amber-200 text-amber-600 bg-amber-50/50 py-0 h-5">
                                                            Pendiente
                                                        </Badge>
                                                        {isOwner && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-6 w-6 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-full"
                                                                onClick={() => handleVerifyIncome(income.id)}
                                                                disabled={verifyingIncomeId === income.id}
                                                                title="Verificar aporte"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default IncomeBar;