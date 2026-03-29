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
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SearchPage from './pages/SearchPage';
import FriendsPage from './pages/FriendsPage';
import ObjectivesPage from './pages/ObjectivesPage';
import BalancePage from './pages/Balance';
import GrupalObjectivesPage from './pages/GrupalObjectivesPage';
import SubscriptionPage from './pages/SubscriptionPage';
import NotificationsPage from './pages/NotificationsPage';
import GroupObjectiveRoute from './components/GroupObjectiveRoute';
import GrupalObjectivePage from './pages/GrupalObjectivePage';
import ObjectivePage from './pages/ObjectivePage';
import TransactionsPage from './pages/TransactionsPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRealProfile = async (session) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && !error) {
          dispatch(setUser({
            id: session.user.id,
            email: session.user.email,
            ...profile
          }));
        } else {
          dispatch(setUser({
            id: session.user.id,
            email: session.user.email,
            ...session.user.user_metadata
          }));
        }
      } catch (err) {
        console.error("Error obteniendo perfil:", err);
      }
    };

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchRealProfile(session);
      } else {
        dispatch(setUser(null));
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchRealProfile(session);
      } else {
        dispatch(setUser(null));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    const root = document.documentElement;

    if (lang.startsWith('es')) {
      root.setAttribute('lang', 'es-419');
      root.setAttribute('translate', 'no');
    } else {
      root.setAttribute('lang', 'es-419');
      root.setAttribute('translate', 'no');
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/objectives" element={<ObjectivesPage />} />
          <Route path="/objectives/:id" element={<ObjectivePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/balance" element={<BalancePage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/grupal-objectives" element={<GrupalObjectivesPage />} />
          <Route path="/grupal-objectives/:groupGoalId" element={<GroupObjectiveRoute />}>
            <Route index element={<GrupalObjectivePage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;