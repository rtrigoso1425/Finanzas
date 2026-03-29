import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { objectivesService } from '@/features/objectives/objectivesService';

export const useObjectives = () => {
    const [objectives, setObjectives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user?.id) return;

        let isMounted = true;

        const loadData = async () => {
            setLoading(true);
            try {
                const data = await objectivesService.getObjectives(user.id);
                if (isMounted) {
                    setObjectives(data || []);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) setError(err.message || 'Error al cargar objetivos');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadData();

        return () => { isMounted = false; };
    }, [user?.id, refetchTrigger]);

    const refetch = () => setRefetchTrigger((prev) => prev + 1);

    return {
        objectives,
        loading,
        error,
        refetch,
    };
};