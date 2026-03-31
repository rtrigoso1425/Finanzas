import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CreateObjectiveModal from '@/components/CreateObjectiveModal';
import ObjectiveCard from '@/components/ObjectiveCard';
import { useObjectives } from '@/hooks/useObjectives';

const ObjectivesPage = () => {
  const { objectives, loading, error, refetch } = useObjectives();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tab, setTab] = useState('active');

  const isOverdue = (endDate) => new Date(endDate) < new Date();
  
  const activeObjectives = objectives.filter(obj => obj.remaining_amount > 0 && !isOverdue(obj.end_date));
  const completedObjectives = objectives.filter(obj => obj.remaining_amount <= 0 && !isOverdue(obj.end_date));
  const overdueObjectives = objectives.filter(obj => isOverdue(obj.end_date));

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="text-muted-foreground font-medium">Cargando tus objetivos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg m-4">
        <p>Error al cargar los objetivos: {error}</p>
        <Button onClick={refetch} variant="outline" className="mt-2">Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
      
      <CreateObjectiveModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreated={refetch}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Mis Objetivos</h1>
          <p className="text-gray-500 mt-1">Gestiona y alcanza tus metas financieras personales</p>
        </div>
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-5 w-5" />
          Nuevo Objetivo
        </Button>
      </div>

      {objectives.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-dashed border-gray-200 rounded-3xl mt-8">
          <div className="text-center max-w-md space-y-4">
            <div className="flex justify-center mb-6">
              <div className="bg-emerald-50 p-6 rounded-full shadow-inner">
                <Target className="h-12 w-12 text-emerald-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Sin objetivos aún</h3>
            <p className="text-gray-500">El primer paso para lograr lo que quieres es definirlo. Crea tu primer objetivo.</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700 mt-6" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear mi primer objetivo
            </Button>
          </div>
        </div>
      ) : (
        <Tabs value={tab} onValueChange={setTab} className="w-full mt-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-slate-100/50 p-1">
            <TabsTrigger value="active" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
              En Curso ({activeObjectives.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
              Completados ({completedObjectives.length})
            </TabsTrigger>
            <TabsTrigger value="overdue" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
              Vencidos ({overdueObjectives.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeObjectives.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground border rounded-xl bg-slate-50">
                No tienes objetivos en curso actualmente.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeObjectives.map((objective) => (
                  <ObjectiveCard key={objective.id} objective={objective} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedObjectives.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground border rounded-xl bg-slate-50">
                Aún no has completado ningún objetivo. ¡Tú puedes!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedObjectives.map((objective) => (
                  <ObjectiveCard key={objective.id} objective={objective} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="overdue">
            {overdueObjectives.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground border rounded-xl bg-slate-50">
                No tienes objetivos vencidos.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {overdueObjectives.map((objective) => (
                  <ObjectiveCard key={objective.id} objective={objective} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ObjectivesPage;