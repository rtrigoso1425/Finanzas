import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TagsSelector } from '@/components/ui/tags-selector';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { friendshipService } from '@/features/friendship/friendshipService';
import { groupObjectivesService } from '@/features/groupObjectives/groupObjectivesService';

const InviteFriendsModal = ({ isOpen, onOpenChange, groupGoalId, onInvited }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingMemberIds, setExistingMemberIds] = useState(new Set());

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!currentUser?.id) return;
        const response = await friendshipService.getFriends(currentUser.id);
        setFriends(response || []);
      } catch (error) {
        console.error('Error carregando amigos:', error);
      }
    };

    const fetchGroupMembers = async () => {
      try {
        if (!groupGoalId) return;
        const group = await groupObjectivesService.getGroupObjectiveById(groupGoalId);
        const memberIds = new Set((group?.group_members || []).map((m) => m.member_id));
        setExistingMemberIds(memberIds);
      } catch (error) {
        console.error('Error cargando miembros del grupo:', error);
      }
    };

    if (isOpen) {
      fetchFriends();
      fetchGroupMembers();
    }
  }, [currentUser?.id, groupGoalId, isOpen]);

  const handleFriendSelection = (selected) => {
    const filtered = selected.filter((id) => !existingMemberIds.has(id));
    setSelectedFriends(filtered);
  };

  // Si el grupo cambia mientras el modal está abierto, garantizamos que no queden IDs ya miembros seleccionados.
  useEffect(() => {
    if (!existingMemberIds.size) return;
    setSelectedFriends((current) => current.filter((id) => !existingMemberIds.has(id)));
  }, [existingMemberIds]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!groupGoalId) return;

    setLoading(true);
    try {
      await groupObjectivesService.inviteFriendsToObjective(groupGoalId, selectedFriends);
      onInvited?.();
      onOpenChange(false);
      setSelectedFriends([]);
    } catch (err) {
      console.error('Error invitando amigos:', err);
      alert('No se pudo enviar la invitación.');
    } finally {
      setLoading(false);
    }
  };

  const friendsTags = friends
    .map((friend) => {
      const id = friend.friend_requested === currentUser.id ? friend.requester.id : friend.requested.id;
      const label = friend.friend_requested === currentUser.id ? friend.requester.username : friend.requested.username;
      return { id, label };
    })
    .filter((friend) => !existingMemberIds.has(friend.id));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md shadow-xl rounded-3xl border-0 bg-card p-6">
        <DialogHeader className="space-y-2 pb-2">
          <DialogTitle className="text-2xl font-semibold text-center text-foreground">
            Invitar personas
          </DialogTitle>
          <p className="text-sm text-center text-muted-foreground mt-1">
            Selecciona a tus amigos para enviarles una invitación a este objetivo.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Invitar Amigos</Label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-card focus-within:ring-2">
              <Users className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <TagsSelector
                tags={friendsTags}
                value={selectedFriends}
                onChange={handleFriendSelection}
                placeholder="Selecciona los amigos que quieres invitar"
                className="w-full border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none text-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full md:w-auto rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || selectedFriends.length === 0}
              className="w-full rounded-lg font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar invitación'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFriendsModal;
