import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useGroupObjectives } from '@/hooks/useGroupObjectives';
import { Target, FileText, Calendar, DollarSign } from 'lucide-react';
import { friendshipService } from '@/features/friendship/friendshipService';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { CurrencySymbol } from '@/utils/currencySimbol';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import DatePicker from './ui/date-picker';
import { MemberSelector } from '@/components/member-selector';

const CreateGroupObjectiveModal = ({ isOpen, onOpenChange }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [objectiveName, setObjectiveName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  
  const { createGroupObjective } = useGroupObjectives();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (currentUser?.id) {
          const response = await friendshipService.getFriends(currentUser.id);
        
          setFriends(response);
        }
      } catch (error) {
        console.error("Error cargando amigos:", error);
      }
    };
    fetchFriends();
  }, [currentUser?.id]);

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);
    
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    return compareDate < maxDate;
  };
  
  const mappedFriends = friends.map((friend) => {
    const user = friend.friend_requested === currentUser.id ? friend.requester : friend.requested;
    return {
      id: user.id,
      name: user.username,
      username: user.username,
      avatar: user.avatar || null,
      avatar_url: user.avatar_url || null,
    };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetDate) {
      alert("Debes seleccionar una fecha límite.");
      return;
    }
    
    setLoading(true);
    try {
      await createGroupObjective(targetAmount, objectiveName, targetDate, description, selectedFriends);

      setObjectiveName('');
      setDescription('');
      setTargetDate('');
      onOpenChange(false);
    } catch (err) {
      console.error('Error creando objetivo grupal:', err);
      alert('No se pudo crear el objetivo');
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md shadow-xl rounded-3xl border-0 bg-card p-6">
        <DialogHeader className="space-y-2 pb-2">
          <DialogTitle className="text-2xl font-semibold text-center text-foreground">
            Crear Nuevo Objetivo
          </DialogTitle>
          <p className="text-sm text-center text-muted-foreground mt-1">
            Configura los detalles para empezar a ahorrar en equipo
          </p>
          <DialogDescription className="sr-only">
            Formulario para crear un nuevo objetivo financiero grupal.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Nombre del Objetivo
            </Label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-card focus-within:ring-2">
              <Target className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <Input
                value={objectiveName}
                onChange={(e) => setObjectiveName(e.target.value)}
                placeholder="Ej. Viaje a Japón"
                required
                className="w-full border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none text-foreground bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Cantidad a Reunir
            </Label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-card focus-within:ring-2">
              <DollarSign className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <Input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder={`Ej. ${CurrencySymbol()}1000`}
                min ="1"
                required
                className="w-full border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none text-foreground bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Descripción
            </Label>
            <div className="flex items-start gap-2 border rounded-lg px-3 py-2.5 bg-card focus-within:ring-2">
              <FileText className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="¿Para qué es este objetivo?"
                className="w-full border-0 bg-transparent focus:outline-none focus-visible:ring-0 shadow-none resize-none text-foreground"
                rows={3}
              />
            </div>
            
            <Label className="text-sm font-medium text-foreground">
              Fecha límite
            </Label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-card focus-within:ring-2">
              <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <DatePicker
                date={targetDate ? new Date(targetDate) : null}
                onDateChange={(date) => setTargetDate(date ? date.toISOString() : "")}
                disabledDate={isDateDisabled}
                className="w-full border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none text-foreground bg-card"
              />
            </div>

            <Label className="text-sm font-medium text-foreground">
              Invitar Amigos
            </Label>
            <MemberSelector 
              members={mappedFriends}
              selected={selectedFriends}
              onChange={setSelectedFriends}
              label="Invitar Amigos"
            />
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
              disabled={loading || !targetDate}
              className="w-full rounded-lg font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear objetivo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupObjectiveModal;