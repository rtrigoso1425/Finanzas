import { useSelector } from 'react-redux';
const HomePage = () => {
    const user = useSelector(state => state.user);
    return (
        <div>
            <h1>HomePage</h1>
            {user ? (
            <>
                <span className="text-sm font-medium">{user.full_name}</span>
                <img 
                    src={user.avatar_url} 
                    alt="Perfil" 
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                        // Imagen por defecto si la URL falla
                        e.target.src = 'https://via.placeholder.com/150';
                    }}
                />
            </>
            ) : (
            <p>No iniciado</p>
            )}
        </div>
    )
}

export default HomePage