import { supabase } from "../supabase/supabaseClient";

export const groupObjectivesService = {
    async getGroupObjectives(userId) {
        const { data, error } = await supabase
            .from("group_members")
            .select(`
                *,
                group_objectives_income!id (
                id,
                income,
                verified,
                message,
                created_at
                ),
                profiles!member_id(
                    id,
                    full_name,
                    username,
                    avatar_url
                ),
                group_objectives!group_goal_id(
                    id, 
                    owner_id, 
                    objective_name, 
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
            .select(`*, group_objectives!group_goal_id(id, owner_id, objective_name, created_at, end_date, total_amount, remaining_amount, public, description, profiles!owner_id(id, full_name, username, avatar_url))`)
            .eq("member_id", userId)
            .eq("state", "pending");
        if (error) throw error;
        return data;
    },

    async acceptInvitation(currentUser, groupGoalId) {
        const { data, error } = await supabase
            .from("group_members")
            .update({ state: 'active', updated_at: new Date() })
            .eq("group_goal_id", groupGoalId)
            .eq("member_id", currentUser.id);
        if (error) throw error;
        return data;
    },

    async declineInvitation(currentUser, groupGoalId) {
        const { error } = await supabase
            .from("group_members")
            .delete()
            .eq("group_goal_id", groupGoalId)
            .eq("member_id", currentUser.id);
        if (error) throw error;
    },

    async createGroupObjective(ownerId, total_amount, objectiveName, end_date, description ) {
        const { data, error } = await supabase
            .from("group_objectives")
            .insert({
                owner_id: ownerId,
                total_amount: total_amount,
                created_at: new Date(),
                end_date : end_date,
                remaining_amount: total_amount,
                public: false,
                objective_name: objectiveName,
                description: description,
            })
            .select("*")
            .single();
        if (error) throw error;
        const { error: memberErr } = await supabase
            .from('group_members')
            .insert({
                member_id: ownerId,
                group_goal_id: data.id,
                state: 'active',
                created_at: new Date(),
            });
        
        if (memberErr) throw memberErr;
        return data;
    },
    
    async inviteFriendsToObjective(groupGoalId, friendIds) {
        const { error } = await supabase
            .from('group_members')
            .insert(
                friendIds.map(friendId => ({
                    member_id: friendId,
                    group_goal_id: groupGoalId,
                    state: 'pending',
                    created_at: new Date(),
                }))
            );
        if (error) throw error;
    },

    async isInGroupObjective(userId, groupGoalId) {
        const { data, error } = await supabase
            .from('group_members')
            .select('*')
            .eq('member_id', userId)
            .eq('group_goal_id', groupGoalId)
            .maybeSingle();
        if (error) throw error;
        return !!data;
    },

    async getGroupObjectiveById(groupGoalId) {
        const { data, error } = await supabase
            .from('group_objectives')
            .select(`*,
                profiles!owner_id(
                    id,
                    full_name,
                    username,
                    avatar_url
                ),
                group_members (
                    id,
                    member_id,
                    state,
                    contribution,
                    created_at,
                    profiles!member_id (
                        id,
                        full_name,
                        username,
                        avatar_url
                    ),
                    group_objectives_income (
                        id,
                        income,
                        verified,
                        message,
                        created_at
                    )
                )
            `)
            .eq('id', groupGoalId)
            .single();
        if (error) throw error;
        return data;
    },

    async cancelInvitation(groupGoalId, memberId) {
        const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_goal_id', groupGoalId)
            .eq('member_id', memberId);
        if (error) throw error;
    }
};