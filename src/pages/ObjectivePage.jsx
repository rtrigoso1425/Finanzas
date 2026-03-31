import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { objectivesService } from '@/features/objectives/objectivesService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Target } from 'lucide-react';
import ObjectiveProgressPanel from '@/features/objectivePage/ObjectiveProgressPanel';
import ObjectiveIncomeBar from '@/features/objectivePage/ObjectiveIncomeBar';
import AddObjectiveIncomeModal from '@/components/AddObjectiveIncomeModal';

const ObjectivePage = () => {
  const params = useParams();
  const objectiveId = params.objectiveId || params.id; 
  const [objective, setObjective] = useState(null);
  const [loading, setLoading] = useState(true);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);

  const fetchObjective = useCallback(async () => {
    if (!objectiveId) return;
    setLoading(true);
    try {
      const data = await objectivesService.getObjectiveById(objectiveId);
      setObjective(data);
    } catch (error) {
      console.error('Error fetching objective:', error);
    } finally {
      setLoading(false);
    }
  }, [objectiveId]);

  useEffect(() => {
    fetchObjective();
  }, [fetchObjective]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-sm font-medium text-muted-foreground">Cargando objetivo…</span>
      </div>
    );
  }
  if (!objective) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4">
        <span className="text-lg font-medium text-slate-700">Objetivo no encontrado</span>
        <p className="text-sm text-slate-500">Es posible que no exista o no tengas permisos para verlo.</p>
        <Button onClick={() => window.history.back()} variant="outline">Volver</Button>
      </div>
    );
  }

  const remainingAmount = Number(objective.remaining_amount ?? 0);
  const isCompleted = remainingAmount <= 0;
  const isOverdue = new Date(objective.end_date) < new Date();
  const incomes = objective.objective_incomes || [];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-12 w-12 rounded-full bg-emerald-100 border-2 border-emerald-50 items-center justify-center text-emerald-600 shrink-0 mt-1">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
                {objective.reason}
              </h1>
              {isCompleted && (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
                  <CheckCircle className="w-3 h-3 mr-1" /> Completado
                </Badge>
              )}
            </div>
            {objective.description && (
              <p className="text-sm text-slate-500 max-w-2xl">{objective.description}</p>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 space-y-6">
          <ObjectiveProgressPanel objective={objective} />
        </div>

        <ObjectiveIncomeBar 
          incomes={incomes} 
          remainingAmount={remainingAmount}
          isCompleted={isCompleted}
          isOverdue={isOverdue}
          onOpenAddModal={() => setIncomeModalOpen(true)}
        />
      </div>

      <AddObjectiveIncomeModal
        isOpen={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        maxAmount={remainingAmount}
        disabled={isOverdue}
        onAdd={async ({ amount, message }) => {
          await objectivesService.addIncome(objective.id, amount, message);
          await fetchObjective();
        }}
      />
    </div>
  );
};

export default ObjectivePage;