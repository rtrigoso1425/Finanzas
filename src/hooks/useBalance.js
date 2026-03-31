import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { economyService } from '../features/economyService/economyService';
import { groupObjectivesService } from '@/features/groupObjectives/groupObjectivesService';
import { objectivesService } from '@/features/objectives/objectivesService';

export const useBalance = () => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [groupExpenses, setGroupExpenses] = useState([]);
    const [objectivesExpenses, setObjectivesExpenses] = useState([]);
    const [balance, setBalance] = useState([]);
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
                const objectivesExpensesPromise = objectivesService.getObjectives(user.id);
                const [incomesData, expensesData, groupExpensesData, objectivesExpensesData] = await Promise.all([
                    incomePromise,
                    expensesPromise,
                    groupExpensesPromise,
                    objectivesExpensesPromise
                ]);

                let groupExpensesContributions = [];

                groupExpensesData.forEach(group => {
                    group.group_objectives_income.forEach(income => {
                        groupExpensesContributions.push({
                            id: income.id,
                            income: income.income,
                            verified: income.verified,
                            message: income.message,
                            created_at: income.created_at,
                            updated_at: income.updated_at,
                            objective_name: group.group_objectives.objective_name
                        })
                    });
                });

                let objectivesExpensesList = [];

                objectivesExpensesData.forEach(objective => {
                    objective.objective_incomes.forEach(income => {
                        objectivesExpensesList.push({
                            id: income.id,
                            income: income.income,
                            message: "Contribución a objetivo: " + objective.reason,
                            created_at: income.created_at,
                            updated_at: income.created_at,
                            objective_name: objective.reason
                        });
                    });
                });

                let balanceData = [];

                incomesData.forEach(income => {
                    balanceData.push({
                        id: `income${income.id}`,
                        description: income.type,
                        extra_info: income.extra_info,
                        amount: income.income,
                        type: 'income',
                        date: income.created_at
                    });
                });

                expensesData.forEach(expense => {
                    balanceData.push({
                        id: `expense${expense.id}`,
                        description: expense.type,
                        extra_info: expense.extra_info,
                        amount: expense.expense,
                        type: 'expense',
                        date: expense.created_at
                    });
                });

                groupExpensesContributions.forEach(contribution => {
                    balanceData.push({
                        id: `group-contribution${contribution.id}`,
                        description: contribution.objective_name,
                        extra_info: contribution.message,
                        amount: contribution.income,
                        type: 'expense',
                        date: contribution.created_at
                    });
                });

                objectivesExpensesList.forEach(contribution => {
                    balanceData.push({
                        id: `objective-contribution${contribution.id}`,
                        description: contribution.objective_name,
                        extra_info: contribution.message,
                        amount: contribution.income,
                        type: 'expense',
                        date: contribution.created_at
                    });
                });


                balanceData.sort((a, b) => new Date(b.date) - new Date(a.date));

                if (isMounted) {
                    setIncomes(incomesData || []);
                    setExpenses(expensesData || []);
                    setGroupExpenses(groupExpensesContributions || []);
                    setObjectivesExpenses(objectivesExpensesList || []);
                    setBalance(balanceData || []);
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

    return { incomes, expenses, groupExpenses, objectivesExpenses, balance, isLoading, error };
}