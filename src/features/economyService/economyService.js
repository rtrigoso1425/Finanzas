import { supabase } from "../supabase/supabaseClient";

export const economyService = {
    async getIncomesData(userId) {
        const { data, error } = await supabase
            .from("income")
            .select("*")
            .eq("user_id", userId)

        if (error) {
            console.error("Error fetching incomes data:", error);
            throw error;
        }

        return data;
    },
    async getExpensesData(userId) {
        const { data, error } = await supabase
            .from("expense")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching expenses data:", error);
            throw error;
        }

        return data;
    },

    async createIncome (userId, amount, type, extraInfo) {
        const { data, error } = await supabase
            .from("income")
            .insert({ user_id: userId, income: amount, type, extra_info: extraInfo })
            .select()
            .single();
        
        if (error) {
            console.error("Error creating income:", error);
            throw error;
        }

        return data;
    },

    async createExpense (userId, amount, type, extraInfo) {
        const { data, error } = await supabase
            .from("expense")
            .insert({ user_id: userId, expense: amount, type, extra_info: extraInfo })
            .select()
            .single();
        
        if (error) {
            console.error("Error creating expense:", error);
            throw error;
        }

        return data;
    }
};

export default economyService;