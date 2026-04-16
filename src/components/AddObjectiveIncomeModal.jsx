import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet } from 'lucide-react';
import { CurrencySymbol } from '@/utils/currencySimbol';

const AddObjectiveIncomeModal = ({ isOpen, onOpenChange, maxAmount, onAdd, disabled = false }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    
    if (numAmount <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }
    if (numAmount > maxAmount) {
      alert(`El monto no puede superar el restante ($${maxAmount})`);
      return;
    }

    setLoading(true);
    try {
      await onAdd({ amount: numAmount });
      setAmount('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error al agregar aporte:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md shadow-xl rounded-3xl border-0 bg-card p-6">
        <DialogHeader className="space-y-2 pb-2">
          <DialogTitle className="text-2xl font-semibold text-center text-foreground flex items-center justify-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-500" />
            Nuevo Aporte
          </DialogTitle>
          <DialogDescription className="text-center">
            {disabled ? (
              <span className="text-red-600">Este objetivo ha excedido su fecha de vencimiento y no puedes agregar aportes.</span>
            ) : (
              <span>Agrega dinero a tu objetivo. Faltan ${maxAmount} para la meta.</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2" disabled={disabled}>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Monto</Label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
              <span className="text-slate-500 font-medium">{CurrencySymbol()}</span>
              <Input
                type="number"
                min="1"
                max={maxAmount}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Ej. ${CurrencySymbol()}50000`}
                required
                disabled={disabled}
                className="w-full border-0 bg-transparent focus-visible:ring-0 shadow-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading || disabled}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !amount || disabled} className="bg-emerald-500 hover:bg-emerald-600">
              {loading ? 'Guardando...' : 'Agregar Aporte'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddObjectiveIncomeModal;