import { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { supabase } from './features/supabase/supabaseClient';
import { setUser } from './features/auth/authSlice';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    // 1. Recuperar la sesión actual al cargar/refrescar la página
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Mapeamos los datos de Supabase a nuestro formato de Redux
        dispatch(setUser({
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata.full_name,
          avatar_url: session.user.user_metadata.avatar_url,
        }));
      }
    };

    checkSession();

    // 2. Escuchar cambios de estado (por si el token expira o cierras sesión)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(setUser({
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata.full_name,
          avatar_url: session.user.user_metadata.avatar_url,
        }));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <Routes>
      {/* Rutas Públicas (Sin Sidebar) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App
