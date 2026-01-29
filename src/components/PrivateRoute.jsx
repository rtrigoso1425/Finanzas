import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return <div>Cargando sesión...</div>;
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;