import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { economyService } from '../features/economyService/economyService';
import { groupObjectivesService } from '@/features/groupObjectives/groupObjectivesService';

export const useBalance = () => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [groupExpenses, setGroupExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        let isMounted = true;

        const loadBalance = async () => {
            setIsLoading(true);
            try {
                const incomePromise = economyService.getIncomesData(user.id);
                const expensesPromise = economyService.getExpensesData(user.id);
                const groupExpensesPromise = groupObjectivesService.getGroupObjectives(user.id);
                const [incomeData, expensesData, groupExpensesData] = await Promise.all([
                    incomePromise,
                    expensesPromise,
                    groupExpensesPromise
                ]);
                if (isMounted) {
                    setIncomes(incomeData || []);
                    setExpenses(expensesData || []);
                    setGroupExpenses(groupExpensesData || []);
                    setError(null);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error loading balance data:", error);
                    setError(error.message);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadBalance();

        return () => {
            isMounted = false;
        };
    }, [user?.id]);

    return { incomes, expenses, groupExpenses, isLoading, error };
}