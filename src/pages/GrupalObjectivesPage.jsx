import { useState } from 'react';
import { useGroupObjectives } from '@/hooks/useGroupObjectives';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BlurFade } from '@/components/ui/blur-fade';
import { SkeletonGrid, SkeletonCard } from '@/components/ui/skeleton';
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
      <div className="space-y-6 p-4 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="h-8 w-48 bg-neutral-200/50 rounded-md animate-pulse"></div>
          <div className="h-10 w-40 bg-neutral-200/50 rounded-md animate-pulse"></div>
        </div>
        <SkeletonGrid count={6} columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 text-red-600 bg-red-50 rounded-lg m-4">
        <p>Error al cargar los objetivos grupales: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* header con título y botón de apertura del modal */}
      <BlurFade delay={0.1} inView>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold">Objetivos grupales</h1>
          <Button 
            disabled={!canCreate}
            className="w-full sm:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            {canCreate ? 'Crear objetivo grupal' : 'Límite alcanzado'}
          </Button>
        </div>
      </BlurFade>

      {/* pestañas */}
      <BlurFade delay={0.2} inView>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="mine" className="text-xs sm:text-sm">Mis objetivos ({activeObjectives.length})</TabsTrigger>
            <TabsTrigger value="overdue" className="text-xs sm:text-sm">Vencidos ({overdueObjectives.length})</TabsTrigger>
            <TabsTrigger value="invites" className="text-xs sm:text-sm">Invitaciones ({invitations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="mine">
            {activeObjectives.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                Aún no tienes objetivos grupales. Usa el botón de arriba para crear uno.
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {activeObjectives.map((obj, index) => (
                  <BlurFade key={obj.group_objectives.id} delay={0.1 + index * 0.05} inView>
                    <GroupObjectiveCard membership={obj} />
                  </BlurFade>
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
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {overdueObjectives.map((obj, index) => (
                  <BlurFade key={obj.group_objectives.id} delay={0.1 + index * 0.05} inView>
                    <GroupObjectiveCard membership={obj} />
                  </BlurFade>
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
                {invitations.map((inv, index) => (
                  <BlurFade key={inv.id} delay={0.1 + index * 0.05} inView>
                    <Card>
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
                      <CardFooter className="gap-2 flex-wrap">
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
                  </BlurFade>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </BlurFade>

      {/* Renderizamos el Modal aquí */}
      <CreateGroupObjectiveModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </div>
  );
};

export default GrupalObjectivesPage;