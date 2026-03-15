import { useEffect, useState } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { groupObjectivesService } from '@/features/groupObjectives/groupObjectivesService';

const GroupObjectiveRoute = () => {
    const { user, isLoading } = useSelector((state) => state.auth);
    const { groupGoalId } = useParams();
    const [isInGroupObjective, setIsInGroupObjective] = useState(null);

    useEffect(() => {
        const checkInGroupObjective = async () => {
            const isInGroup = await groupObjectivesService.isInGroupObjective(user.id, groupGoalId);
            setIsInGroupObjective(isInGroup);
        };

        if (user && groupGoalId) {
            checkInGroupObjective();
        }
    }, [user, groupGoalId]);

    if (isLoading || isInGroupObjective === null) {
        return <div>Cargando sesión...</div>;
    }
    return isInGroupObjective ? <Outlet /> : <Navigate to="/grupal-objectives" replace />;
};

export default GroupObjectiveRoute;