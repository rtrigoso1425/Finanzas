import { supabase } from "../supabase/supabaseClient";

export const objectivesService = {
    async createObjectives(userId, objectiveData) {
        const { data, error } = await supabase
            .from('objectives')
            .insert([
                {
                    user_id: userId,
                    total_amount: objectiveData.totalAmount,
                    remaining_amount: objectiveData.totalAmount,
                    reason: objectiveData.reason,
                    end_date: objectiveData.endDate
                }
            ])
            .select();
        if (error) {        
            console.error('Error creating objective:', error);
            throw error;
        }
        return data;
    },

    async getObjectives(userId) {
        const { data, error } = await supabase
            .from('objectives')
            .select(`
                *,
                objective_incomes (
                    id,
                    income,
                    created_at
                )
            `)
            .eq('user_id', userId);
        if (error) {        
            console.error('Error fetching objectives:', error);
            throw error;
        }
        return data;
    },

    async addIncome(objectiveId, amount){
        const { data, error } = await supabase
            .from('objective_incomes')
            .insert([
                {
                    objective_id: objectiveId,
                    income: amount
                }
            ])
            .select();
        if (error) {
            console.error('Error adding income:', error);
            throw error;
        }
        return data;
    },

    async getObjectiveById(objectiveId) {
        const { data, error } = await supabase
            .from('objectives')
            .select(`
                *,
                objective_incomes (
                    id,
                    income,
                    created_at
                )
            `)
            .eq('id', objectiveId)
            .single();
        if (error) {        
            console.error('Error fetching objective by ID:', error);
            throw error;
        }
        return data;
    },
};

export default objectivesService;