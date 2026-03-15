import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { groupObjectivesService } from '@/features/groupObjectives/groupObjectivesService';
import { Plus, Users } from 'lucide-react';

const AdminPanel = ({ members, setInviteModalOpen, fetchGroupObjective }) => {
    const { groupGoalId } = useParams();
    const pendingInvites = useMemo(() => members.filter((m) => m.state === 'pending'), [members]);
    const handleCancelInvitation = async (memberId) => {
        try {
            await groupObjectivesService.cancelInvitation(groupGoalId, memberId);
            await fetchGroupObjective();
        } catch (err) {
            console.error('Error cancelando invitación:', err);
        }
    };
    return (
        <Card className="border-emerald-100 shadow-sm bg-white">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                            <Users className="w-5 h-5" />
                        </div>
                    <div>
                        <CardTitle className="text-lg text-slate-800">Panel de Administración</CardTitle>
                        <CardDescription>Gestiona el equipo y las invitaciones del objetivo</CardDescription>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    size="sm"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => setInviteModalOpen(true)}
                >
                    <Plus className="w-4 h-4 mr-1" /> Invitar
                </Button>
            </div>
        </CardHeader>

        {pendingInvites.length > 0 && (
            <CardContent>
                <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Invitaciones Pendientes ({pendingInvites.length})
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {pendingInvites.map((invite) => (
                            <div key={invite.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={invite.profiles?.avatar_url} />
                                        <AvatarFallback className="text-xs bg-slate-100">
                                            {invite.profiles?.full_name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                <span className="text-sm font-medium text-slate-700 truncate max-w-[100px]">
                                    {invite.profiles?.full_name || invite.profiles?.username}
                                </span>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleCancelInvitation(invite.member_id)}
                            >
                                Cancelar
                            </Button>
                        </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        )}
    </Card>
    );
};
export default AdminPanel;