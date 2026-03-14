import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/features/supabase/supabaseClient';
import { useGroupObjectives } from '@/hooks/useGroupObjectives';
import { Target, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CreateGroupObjectiveModal = ({ isOpen, onOpenChange }) => {
  const [objectiveName, setObjectiveName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { createGroupObjective } = useGroupObjectives();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const newObjective = await createGroupObjective(0, objectiveName, new Date(2026, 11, 20), description);

      // agregamos al propio creador como miembro aceptado
      const { error: memberErr } = await supabase
        .from('group_members')
        .insert({
          member_id: user.id,
          group_goal_id: newObjective.id,
          state: 'active',
          created_at: new Date(),
        });
        
      if (memberErr) throw memberErr;

      // Limpiamos el formulario y cerramos el modal
      setObjectiveName('');
      setDescription('');
      onOpenChange(false);
      window.location.reload();
    } catch (err) {
      console.error('Error creando objetivo grupal:', err);
      alert('No se pudo crear el objetivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Aplicamos las clases de sombra y bordes redondeados al estilo del AdminDashboard */}
      <DialogContent className="sm:max-w-md shadow-xl rounded-3xl border-0 bg-card p-6">
        <DialogHeader className="space-y-2 pb-2">
          <DialogTitle className="text-2xl font-semibold text-center text-foreground">
            Crear Nuevo Objetivo
          </DialogTitle>
          <p className="text-sm text-center text-muted-foreground mt-1">
            Configura los detalles para empezar a ahorrar en equipo
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          
          {/* Campo: Nombre del Objetivo */}
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

          {/* Campo: Descripción */}
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
          </div>
          
          {/* Botones de acción */}
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
              disabled={loading}
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