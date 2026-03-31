import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const AddContributionModal = ({ isOpen, onOpenChange, onAdd, maxAmount, disabled = false }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const numeric = Number(amount);
    if (!numeric || numeric <= 0) {
      alert('Ingresa un monto válido.');
      return;
    }

    if (typeof maxAmount === 'number' && numeric > maxAmount) {
      alert(`No puedes agregar más de ${maxAmount.toLocaleString()} (monto faltante).`);
      return;
    }

    setLoading(true);
    try {
      await onAdd({ amount: numeric, message: note });
      setAmount('');
      setNote('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error agregando aporte:', error);
      alert('No se pudo registrar el aporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md shadow-xl rounded-3xl border-0 bg-card p-6">
        <DialogHeader className="space-y-2 pb-2">
          <DialogTitle className="text-2xl font-semibold text-center text-foreground">
            Registrar aporte
          </DialogTitle>
          <p className="text-sm text-center text-muted-foreground mt-1">
            {disabled ? (
              <span className="text-red-600">Este objetivo ha excedido su fecha de vencimiento y no puedes agregar aportes.</span>
            ) : (
              <span>Ingresa el monto y, si quieres, un comentario opcional.</span>
            )}
          </p>
          <DialogDescription className="sr-only">
            Formulario para registrar un nuevo aporte financiero.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Monto</Label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="Ej. 100000"
              required
              disabled={disabled}
              className="bg-card"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Comentario (opcional)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="¿Para qué se usa este aporte?"
              rows={3}
              disabled={disabled}
              className="bg-card"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading || disabled}
              className="w-full md:w-auto rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !amount || disabled}
              className="w-full rounded-lg font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Agregar aporte'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContributionModal;
