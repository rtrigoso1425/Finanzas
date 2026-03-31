import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { groupIncomesService } from '@/features/groupObjectives/groupIncomesService';
import { groupObjectivesService } from '@/features/groupObjectives/groupObjectivesService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AddContributionModal from '@/components/AddContributionModal';
import InviteFriendsModal from '@/components/InviteFriendsModal';
import { CheckCircle, Wallet, Crown } from 'lucide-react';
import AdminPanel from '@/features/groupObjectivePage/AdminPanel';
import ProgressPanel from '@/features/groupObjectivePage/ProgressPanel';
import IncomeBar from '@/features/groupObjectivePage/IncomeBar';

const GrupalObjectivePage = () => {
  const { user } = useSelector((state) => state.auth);
  const { groupGoalId } = useParams();
  const [groupObjective, setGroupObjective] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [contributionModalOpen, setContributionModalOpen] = useState(false);

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

  if (loading || !groupObjective) {
    return (
      <div className="flex h-full items-center justify-center py-14">
        <span className="text-sm font-medium text-muted-foreground">Cargando objetivo…</span>
      </div>
    );
  }

  const remainingAmount = Number(groupObjective.remaining_amount ?? 0);
  const isCompleted = remainingAmount <= 0;
  const isOverdue = new Date(groupObjective.end_date) < new Date();

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
          {myMembership && !isCompleted && !isOverdue && (
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200"
              onClick={() => setContributionModalOpen(true)}
            >
              <Wallet className="w-4 h-4 mr-2" />
              Nuevo Aporte
            </Button>
          )}
          {isOverdue && (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">
              Vencido
            </Badge>
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
        <IncomeBar 
          incomes={incomes} 
          groupObjective={groupObjective}
          fetchGroupObjective={fetchGroupObjective}
          isOwner={isOwner}
          isOverdue={isOverdue}
        />
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
        disabled={isOverdue}
        onAdd={async ({ amount, message }) => {
          if (!myMembership) return;
          await groupIncomesService.addContribution(myMembership.id, amount, message);
          await fetchGroupObjective();
        }}
      />
    </div>
  );
};

export default GrupalObjectivePage;