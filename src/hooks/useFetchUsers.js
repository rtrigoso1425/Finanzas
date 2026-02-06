// src/hooks/useFetchUsers.js
import { useState, useEffect } from 'react';
import { supabase } from '@/features/supabase/supabaseClient';

export const useFetchUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                // Traemos todos los perfiles de la base de datos
                const { data, error } = await supabase
                .from('profiles')
                .select('*');

                if (error) throw error;
                setUsers(data || []);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, isLoading, error };
};