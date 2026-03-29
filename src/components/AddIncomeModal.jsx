import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { DollarSign, ClipboardType } from 'lucide-react';
import { economyService } from '@/features/economyService/economyService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
const AddIncomeModal = ({ isOpen, onOpenChange }) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const numeric = parseFloat(amount);
            await economyService.createIncome(currentUser.id, numeric, 'general', note);
            setAmount('');
            setNote('');
            onOpenChange(false);

        }catch (error) {
            console.error('Error creating income:', error);
            alert('No se pudo registrar el ingreso.');
        } finally {
            setLoading(false);
            window.location.reload();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md shadow-xl rounded-3xl border-0 bg-card p-6">
                <DialogHeader className="space-y-2 pb-2">
                    <DialogTitle className="text-2xl font-semibold text-center text-foreground">
                        Registrar Ingreso
                    </DialogTitle>
                    <p className="text-sm text-center text-muted-foreground mt-1">
                        Ingresa el monto del ingreso.
                    </p>
                    <DialogDescription className="sr-only">
                        Formulario para registrar un nuevo ingreso financiero.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Monto</Label>
                        <div className="flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-card focus-within:ring-2">
                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                            <Input
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Ej. 10"
                                required
                                className="bg-card"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Comentario (opcional)</Label>
                        <div className="flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-card focus-within:ring-2">
                            <ClipboardType className="h-5 w-5 text-muted-foreground" />
                            <Textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="¿Para qué se usa este aporte?"
                                rows={3}
                                className="bg-card"
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
                            disabled={loading || !amount}
                            className="w-full rounded-lg font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : 'Agregar aporte'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default AddIncomeModal;