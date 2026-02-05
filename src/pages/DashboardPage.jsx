import { useSelector } from 'react-redux';
import { supabase } from '@/features/supabase/supabaseClient';
import { ImageUploader } from '../components/ImageUploader';
const DashboardPage = () => {
    const { user, isLoading } = useSelector((state) => state.auth);
    if (isLoading) {
        return <div>Cargando perfil...</div>;
    }
    return (
        <div>
            <h1>Dashboard</h1>
            {user ? (
            <>
                <span className="text-sm font-medium">{user.full_name}</span>
                <img 
                    key={user.avatar_url}
                    src={user.avatar_url} 
                    alt="Perfil" 
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                        // Imagen por defecto si la URL falla
                        e.target.src = 'https://i.ibb.co/k6WjwY6N/default.jpg';
                    }}
                />
                <ImageUploader />
            </>
            ) : (
            <p>No iniciado</p>
            )}
        </div>
    );
};

export default DashboardPage;