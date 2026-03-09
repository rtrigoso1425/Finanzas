import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGroupObjectives } from '@/hooks/useGroupObjectives';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const GrupalObjectivesPage = () => {
  const { myObjectives, invitations, loading, error, acceptInvitation, rejectInvitation } = useGroupObjectives();
  const [tab, setTab] = useState('mine');
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
      {/* header con título y botón de creación */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Objetivos grupales</h1>
        <Button asChild>
          <Link to="/grupal-objetives/create">Crear objetivo grupal</Link>
        </Button>
      </div>

      {/* pestañas */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="mine">Mis objetivos</TabsTrigger>
          <TabsTrigger value="invites">Invitaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="mine">
          {myObjectives.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Aún no tienes objetivos grupales. Usa el botón de arriba para crear
              uno.
            </div>
          ) : (
            <div className="grid gap-4">
              {myObjectives.map((obj) => (
                <Card key={obj.group_objectives.id}>
                  <CardHeader>
                    <CardTitle>{obj.group_objectives?.objetive_name || 'Objetivo sin título'}</CardTitle>
                    {obj.group_objectives?.description && (
                      <CardDescription>{obj.group_objectives.description}</CardDescription>
                    )}
                  </CardHeader>
                  {obj.group_objectives?.description && (
                    <CardContent>
                      <p>{obj.group_objectives.description}</p>
                    </CardContent>
                  )}
                </Card>
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
                      {inv.group_objectives?.objetive_name || 'Objetivo grupal'}
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
                      onClick={() => acceptInvitation(inv.id)}
                    >
                      Aceptar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => rejectInvitation(inv.id)}
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
    </div>
  );
};

export default GrupalObjectivesPage;