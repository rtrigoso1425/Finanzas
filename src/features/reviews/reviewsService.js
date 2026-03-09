import { supabase } from "../supabase/supabaseClient";  

export const reviewsService = {
    async createReview(myid ,userId, ObjectiveId, rating, comment) {
        const { data, error } = await supabase
        .from('reviews')
        .insert([
            { reviewer: myid, reviewed: userId, grupal_objective: ObjectiveId, rating: rating, comment: comment }
        ]);

        if (error) throw error;
        return data;
    },

    async getReviewsForUser(userId) {
        const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewed', userId);

        if (error) throw error;
        return data;
    },

    async getAverageRatingForUser(userId) {
        const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewed', userId);
        
        if (error) throw error;
        if (data.length === 0) return 0;
        else {
            const total = data.reduce((sum, review) => sum + review.rating, 0);
            const average = total / data.length;
            return average.toFixed(2); // Redondear a 2 decimales
        }
    }
}