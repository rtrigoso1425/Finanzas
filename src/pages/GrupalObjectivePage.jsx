import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { groupIncomesService } from '@/features/groupObjectives/groupIncomesService';
import { groupObjectivesService } from '@/features/groupObjectives/groupObjectivesService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AddContributionModal from '@/components/AddContributionModal';
import InviteFriendsModal from '@/components/InviteFriendsModal';
import { CheckCircle, Wallet, Crown } from 'lucide-react';
import AdminPanel from '@/features/groupObjectivePage/AdminPanel';
import ProgressPanel from '@/features/groupObjectivePage/ProgressPanel';

const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
};

const GrupalObjectivePage = () => {
  const { user } = useSelector((state) => state.auth);
  const { groupGoalId } = useParams();
  const [groupObjective, setGroupObjective] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [contributionModalOpen, setContributionModalOpen] = useState(false);
  const [verifyingIncomeId, setVerifyingIncomeId] = useState(null);

  const fetchGroupObjective = useCallback(async () => {
    if (!groupGoalId) return;
    setLoading(true);
    try {
      const data = await groupObjectivesService.getGroupObjectiveById(groupGoalId);
      setGroupObjective(data);
    } catch (error) {
      console.error('Error fetching group objective:', error);
    } finally {
      setLoading(false);
    }
  }, [groupGoalId]);

  useEffect(() => {
    fetchGroupObjective();
  }, [fetchGroupObjective]);

  const members = useMemo(() => groupObjective?.group_members ?? [], [groupObjective]);
  const activeMembers = useMemo(() => members.filter((m) => m.state === 'active'), [members]);
  const isOwner = useMemo(() => user?.id && groupObjective?.owner_id === user.id, [user?.id, groupObjective]);
  const myMembership = useMemo(() => members.find((m) => m.member_id === user?.id), [members, user?.id]);

  const incomes = useMemo(() => {
    if (!members?.length) return [];
    return members.flatMap((member) => {
      const incomesForMember = member.group_objectives_income || [];
      return incomesForMember.map((income) => ({ ...income, member }));
    });
  }, [members]);

  const handleVerifyIncome = async (incomeId) => {
    setVerifyingIncomeId(incomeId);
    try {
      await groupObjectivesService.verifyIncome(incomeId, true);
      await fetchGroupObjective();
    } catch (err) {
      console.error('Error verificando aporte:', err);
    } finally {
      setVerifyingIncomeId(null);
    }
  };

  if (loading || !groupObjective) {
    return (
      <div className="flex h-full items-center justify-center py-14">
        <span className="text-sm font-medium text-muted-foreground">Cargando objetivo…</span>
      </div>
    );
  }

  const remainingAmount = Number(groupObjective.remaining_amount ?? 0);
  const isCompleted = remainingAmount <= 0;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen">
      
      {/* HEADER DE LA PÁGINA */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
              {groupObjective.objective_name}
            </h1>
            {isCompleted && (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
                <CheckCircle className="w-3 h-3 mr-1" /> Completado
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">{groupObjective.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-3 mr-2">
            {activeMembers.slice(0, 4).map((member) => {
              const isMemberOwner = member.member_id === groupObjective.owner_id;
              return (
                <div key={member.id} className="relative">
                  {isMemberOwner && (
                    <Crown className="absolute -top-3 -right-1 z-20 w-4 h-4 text-amber-500 drop-shadow-sm rotate-12" />
                  )}
                  <Avatar 
                    className={`w-10 h-10 border-2 border-white relative z-10 ${
                      isMemberOwner ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-white' : ''
                    }`}
                  >
                    <AvatarImage src={member.profiles?.avatar_url} />
                    <AvatarFallback className="bg-slate-100 text-xs text-slate-600 font-medium">
                      {member.profiles?.full_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              );
            })}
            {activeMembers.length > 4 && (
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600 z-10">
                +{activeMembers.length - 4}
              </div>
            )}
          </div>
          {myMembership && !isCompleted && (
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200"
              onClick={() => setContributionModalOpen(true)}
            >
              <Wallet className="w-4 h-4 mr-2" />
              Nuevo Aporte
            </Button>
          )}
        </div>
      </header>

      {/* GRID PRINCIPAL: 2/3 Izquierda, 1/3 Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA (Principal - Progress & Owner Actions) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tarjeta de Progreso Financiero */}
          <ProgressPanel groupObjective={groupObjective} />

          {/* PANEL DE CONTROL DEL OWNER */}
          {isOwner && (
            <AdminPanel 
              members={members} 
              setInviteModalOpen={setInviteModalOpen}
              fetchGroupObjective={fetchGroupObjective} 
            />
          )}
        </div>

        {/* COLUMNA DERECHA (Barra lateral de Aportes) */}
        <div className="lg:col-span-4 h-full">
          <Card className="border-slate-100 shadow-sm h-full flex flex-col bg-white">
            <CardHeader className="border-b border-slate-50 py-4 px-5">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center justify-between">
                Registro de Aportes
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                  {incomes.length} Movimientos
                </Badge>
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
      </div>

      {/* Modales */}
      <InviteFriendsModal
        isOpen={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        groupGoalId={groupGoalId}
        onInvited={fetchGroupObjective}
      />

      <AddContributionModal
        isOpen={contributionModalOpen}
        onOpenChange={setContributionModalOpen}
        maxAmount={remainingAmount}
        onAdd={async ({ amount, message }) => {
          if (!myMembership) return;
          await groupIncomesService.addContribution(groupGoalId, myMembership.id, amount, message);
          await fetchGroupObjective();
        }}
      />
    </div>
  );
};

export default GrupalObjectivePage;