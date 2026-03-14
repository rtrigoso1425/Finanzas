import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { groupObjectivesService } from '@/features/groupObjectives/groupObjectivesService';

export const useGroupObjectives = () => {
  const [myObjectives, setMyObjectives] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Usaremos este número para forzar la recarga de datos sin depender de funciones
  const [refetchTrigger, setRefetchTrigger] = useState(0); 
  
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Si no hay usuario, no hacemos nada (evita errores y llamadas vacías)
    if (!user?.id) return;

    let isMounted = true; // Previene actualizaciones de estado si el componente se desmonta

    const loadData = async () => {
      setLoading(true);
      try {
        // Ejecutamos ambas consultas en paralelo
        const [objectivesData, invitationsData] = await Promise.all([
          groupObjectivesService.getGroupObjectives(user.id),
          groupObjectivesService.getInvitations(user.id)
        ]);

        if (isMounted) {
          setMyObjectives(objectivesData || []);
          setInvitations(invitationsData || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Error al cargar datos");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => { isMounted = false; };
  }, [user?.id, refetchTrigger]); // <-- LA CLAVE: Solo se ejecuta si cambia el ID o sumamos 1 al trigger

  // Función auxiliar para forzar la recarga
  const refetch = () => setRefetchTrigger(prev => prev + 1);

  const acceptInvitation = async (groupId) => {
    try {
      setLoading(true);
      groupObjectivesService.acceptInvitation(user,groupId);
      refetch(); // Volvemos a disparar el useEffect
    } catch (err) {
      console.error('Error aceptando:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const rejectInvitation = async (groupId) => {
    try {
      setLoading(true);
      groupObjectivesService.declineInvitation(user, groupId);
      refetch(); // Volvemos a disparar el useEffect
    } catch (err) {
      console.error('Error rechazando:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const createGroupObjective = async ( total_amount, objectiveName, end_date, description) => {
    try {
      setLoading(true);
      const newObjective = await groupObjectivesService.createGroupObjective(user.id, total_amount, objectiveName, end_date, description);
      refetch(); // Forzamos la recarga de datos
      return newObjective;
    } catch (err) {
      console.error('Error creando objetivo grupal:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    myObjectives,
    invitations,
    loading,
    error,
    acceptInvitation,
    rejectInvitation,
    createGroupObjective,
    refetch // Exponemos refetch por si lo necesitas en algún botón
  };
};