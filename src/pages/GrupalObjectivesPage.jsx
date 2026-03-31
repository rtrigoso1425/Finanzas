import { useState } from 'react';
import { useGroupObjectives } from '@/hooks/useGroupObjectives';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import GroupObjectiveCard from '@/components/GroupObjectiveCard';
import CreateGroupObjectiveModal from '../components/CreateGroupObjectiveModal';

const GrupalObjectivesPage = () => {
  const { myObjectives, invitations, loading, error, acceptInvitation, rejectInvitation } = useGroupObjectives();
  const [tab, setTab] = useState('mine');
  
  // Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // only count objectives whose end date is in the future
  const now = new Date();
  const activeObjectives = myObjectives.filter(
    (obj) => new Date(obj.group_objectives.end_date) > now
  );
  const overdueObjectives = myObjectives.filter(
    (obj) => new Date(obj.group_objectives.end_date) <= now
  );
  const canCreate = activeObjectives.length < 5;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span>Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error al cargar los objetivos grupales: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* header con título y botón de apertura del modal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Objetivos grupales</h1>
        <Button 
          disabled={!canCreate} 
          onClick={() => setIsModalOpen(true)}
        >
          {canCreate ? 'Crear objetivo grupal' : 'Límite alcanzado'}
        </Button>
      </div>

      {/* pestañas */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="mine">Mis objetivos ({activeObjectives.length})</TabsTrigger>
          <TabsTrigger value="overdue">Vencidos ({overdueObjectives.length})</TabsTrigger>
          <TabsTrigger value="invites">Invitaciones ({invitations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="mine">
          {activeObjectives.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Aún no tienes objetivos grupales. Usa el botón de arriba para crear uno.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeObjectives.map((obj) => (
                <GroupObjectiveCard
                  key={obj.group_objectives.id}
                  membership={obj}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="overdue">
          {overdueObjectives.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No tienes objetivos grupales vencidos.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {overdueObjectives.map((obj) => (
                <GroupObjectiveCard
                  key={obj.group_objectives.id}
                  membership={obj}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="invites">
          {invitations.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No tienes invitaciones a objetivos grupales.
            </div>
          ) : (
            <div className="grid gap-4">
              {invitations.map((inv) => (
                <Card key={inv.id}>
                  <CardHeader>
                    <CardTitle>
                      {inv.group_objectives?.objective_name || 'Objetivo grupal'}
                    </CardTitle>
                    {inv.state && (
                      <CardDescription className="uppercase text-xs">
                        {inv.state}
                      </CardDescription>
                    )}
                    {inv.group_objectives?.description && (
                      <CardDescription>
                        {inv.group_objectives.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardFooter className="space-x-2">
                    <Button
                      size="sm"
                      onClick={() => acceptInvitation(inv.group_goal_id)}
                    >
                      Aceptar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => rejectInvitation(inv.group_goal_id)}
                    >
                      Rechazar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Renderizamos el Modal aquí */}
      <CreateGroupObjectiveModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </div>
  );
};

export default GrupalObjectivesPage;