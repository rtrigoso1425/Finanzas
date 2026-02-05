import { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { supabase } from './features/supabase/supabaseClient';
import { setUser } from './features/auth/authSlice';
import DashboardLayout from "./components/layout/DashboardLayout";
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute'; 
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
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile && !error) {
          // 2. SOLO despachamos una vez tengamos los datos frescos de la DB
          dispatch(setUser({
            id: session.user.id,
            email: session.user.email,
            ...profile
          }));
        }
        else {
        // Si no hay sesión, apagamos el loading directamente
          dispatch(setUser(null)); 
        }
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
          subscription: session.user.user_metadata.subscription,
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
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App
