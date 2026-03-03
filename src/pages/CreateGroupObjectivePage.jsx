import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/features/supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';

const CreateGroupObjectivePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const {
        data: inserted,
        error: insertErr,
      } = await supabase
        .from('group_objectives')
        .insert({
          title,
          description,
          owner_id: user.id,
          created_at: new Date(),
        })
        .select('*')
        .single();
      if (insertErr) throw insertErr;

      // agregamos al propio creador como miembro aceptado
      const { error: memberErr } = await supabase
        .from('group_members')
        .insert({
          member_id: user.id,
          group_goal_id: inserted.id,
          state: 'accepted',
          created_at: new Date(),
        });
      if (memberErr) throw memberErr;

      navigate('/grupal-objectives');
    } catch (err) {
      console.error('Error creando objetivo grupal:', err);
      alert('No se pudo crear el objetivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Crear objetivo grupal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear'}
        </Button>
      </form>
    </div>
  );
};

export default CreateGroupObjectivePage;