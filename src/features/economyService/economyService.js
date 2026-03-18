import { supabase } from "../supabase/supabaseClient";

const economyService = {
    async getIncomesData() {
        const { data, error } = await supabase
            .from("economy_data")
            .select("*")
            .order("date", { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error("Error fetching incomes data:", error);
            throw error;
        }

        return data;
    }
};

export default economyService;