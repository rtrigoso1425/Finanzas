import { supabase } from "../supabase/supabaseClient";  

export const groupIncomesService = {
    async addContribution( MemberId, amount, message = '') {
        const parsedAmount = Number(amount);
        if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            throw new Error('El monto debe ser un número positivo');
        }

        const { data: income, error: incomeError } = await supabase
            .from('group_objectives_income')
            .insert({
                group_member: MemberId,
                income: parsedAmount,
                message,
                verified: false,
                created_at: new Date(),
            })
            .select('*')
            .single();

        if (incomeError) throw incomeError;

        return income;
    },

    async verifyIncome(incomeId, verified = true) {
        const { data, error } = await supabase
            .from('group_objectives_income')
            .update({ verified, updated_at: new Date() })
            .eq('id', incomeId);
        if (error) throw error;
        return data;
    },
};