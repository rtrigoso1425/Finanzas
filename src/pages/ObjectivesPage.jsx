import { useState } from 'react';
import { Plus, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

const ObjectivesPage = () => {
  const [objectives] = useState([]);

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Mis Objetivos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Crea y sigue tus objetivos personales de manera estructurada
          </p>
        </div>
        <Button 
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Nuevo Objetivo
        </Button>
      </div>

      {objectives.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-md space-y-4">
            <div className="flex justify-center">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-6 rounded-full">
                <Target className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Sin objetivos aún
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Comienza a crear tus objetivos para mejorar tu situación financiera
            </p>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear mi primer objetivo
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((objective) => (
            <Card key={objective.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{objective.title}</CardTitle>
                    <CardDescription>{objective.description}</CardDescription>
                  </div>
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Progreso
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${objective.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver detalles
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ObjectivesPage;