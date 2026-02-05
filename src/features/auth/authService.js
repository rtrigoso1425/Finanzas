import { supabase } from "../supabase/supabaseClient";

export const authService = {
    async register(email, password, fullName, username) {
        const { data: { publicUrl } } = supabase
            .storage
            .from('profile_photos')
            .getPublicUrl('default.jpg');
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    avatar_url: publicUrl,
                    username: username,
                    subscription: 'Basico',
                }
            }
        });

        if (error) {
            throw new Error(error.message);
        }
        return data;
    },
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        })
        if (error) {
            throw new Error(error.message);
        }
        return data
    },
    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
    }
}