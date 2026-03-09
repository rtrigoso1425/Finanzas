import { supabase } from "../supabase/supabaseClient";

export const groupObjectivesService = {
    async getGroupObjectives(userId) {
        const { data, error } = await supabase
            .from("group_members")
            .select(`
                *,
                profiles!member_id(
                    id,
                    full_name,
                    username,
                    avatar_url
                ),
                group_objectives!group_goal_id(
                    id, 
                    owner_id, 
                    objetive_name, 
                    created_at, 
                    end_date, 
                    total_amount, 
                    remaining_amount, 
                    public, 
                    description,
                    otros_miembros:group_members(
                        id,
                        member_id,
                        state,
                        contribution,
                        profiles!member_id(
                            id,
                            full_name,
                            username,
                            avatar_url
                        )
                    )
                )
            `)
            .eq("member_id", userId)
            .eq("state", "active");
            
        if (error) throw error;
        return data;
    },

    async getInvitations(userId) {
        const { data, error } = await supabase
            .from("group_members")
            .select(`*, group_objectives!group_goal_id(id, owner_id, objetive_name, created_at, end_date, total_amount, remaining_amount, public, description)`)
            .eq("member_id", userId)
            .eq("state", "pending");
        if (error) throw error;
        return data;
    }
}