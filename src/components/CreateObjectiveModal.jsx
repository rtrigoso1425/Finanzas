import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySymbol } from '@/utils/currencySimbol';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DatePicker from '@/components/ui/date-picker';
import { objectivesService } from '@/features/objectives/objectivesService';
import { Target, Calendar, DollarSign } from 'lucide-react';

const CreateObjectiveModal = ({ isOpen, onOpenChange, onCreated }) => {
  const { user } = useSelector((state) => state.auth);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);
    
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    return compareDate < maxDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    
    if (!endDate) {
      alert("Debes seleccionar una fecha límite.");
      return;
    }

    setLoading(true);
    try {
      await objectivesService.createObjectives(user.id, {
        totalAmount: Number(amount),
        reason: title,
        endDate: endDate ? endDate.toISOString().split('T')[0] : null,
      });

      setTitle('');
      setAmount('');
      setEndDate(null);
      onOpenChange(false);
      
      onCreated?.();
    } catch (error) {
      console.error('Error creando objetivo:', error);
      alert('No se pudo crear el objetivo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onOpenChange(false); }}>
      <DialogContent className="sm:max-w-md shadow-xl rounded-3xl border-0 bg-card p-6">
        <DialogHeader className="space-y-2 pb-2">
          <DialogTitle className="text-2xl font-semibold text-center text-foreground">
            Crear Nuevo Objetivo
          </DialogTitle>
          <p className="text-sm text-center text-muted-foreground mt-1">
            Configura los detalles para alcanzar tu meta personal
          </p>
          <DialogDescription className="sr-only">
            Formulario para crear un nuevo objetivo financiero personal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          
          {/* Nombre del Objetivo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Nombre del Objetivo
            </Label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-card focus-within:ring-2">
              <Target className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Viaje a Japón"
                required
                className="w-full border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none text-foreground bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Monto total
            </Label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-card focus-within:ring-2">
              <DollarSign className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <Input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Ej. ${CurrencySymbol()}1000`}
                required
                className="w-full border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none text-foreground bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Fecha límite
            </Label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-card focus-within:ring-2">
              <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <DatePicker 
                date={endDate} 
                onDateChange={setEndDate} 
                disabledDate={isDateDisabled}
                className="w-full border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none text-foreground bg-card" 
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
              disabled={loading || !title || !amount || !endDate} 
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

export default CreateObjectiveModal;