import { useState } from 'react';
import { authService } from '@/features/auth/authService';
import { supabase } from '@/features/supabase/supabaseClient'; // Importar supabase
import { useDispatch } from 'react-redux'; // Importar dispatch
import { setUser } from '@/features/auth/authSlice'; // Importar acción
import { Link, useNavigate } from "react-router-dom";
import { BlurFade } from "../components/ui/blur-fade";
import { Text_03 } from "@/components/ui/wave-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Hook de Redux

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Login básico (Auth)
            const { user } = await authService.login(email, password);
            
            // 2. OBTENER PERFIL COMPLETO (Foto, suscripción, etc.)
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            // 3. Guardar en Redux inmediatamente
            dispatch(setUser({
                id: user.id,
                email: user.email,
                ...profile 
            }));

            navigate('/dashboard'); 
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
            window.location.reload(); // Recarga la página para asegurar que el estado se actualice en todos los componentes
        }
    };

    return (
        // ... (El resto de tu JSX se mantiene IDÉNTICO, solo cambia la lógica de arriba)
        <div
            className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative"
            style={{ margin: 0, padding: "20px" }}
        >
            <BlurFade inView delay={0.5}>
                <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <CardHeader>
                        <div>
                            <Link to="/" style={{ textDecoration: "none", color: "Black", fontSize: "1.5rem" }}>
                                <Text_03 text="SmartGoal"/>
                            </Link>
                        </div>
                        <CardTitle className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
                            Inicio de Sesion
                        </CardTitle>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Inicia sesión para acceder a tu cuenta y empieza a gestionar tus finanzas.
                        </p>
                    </CardHeader>
                    <CardContent style={{ pointerEvents: "auto", position: "relative" }}>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <Label className="text-gray-700 dark:text-gray-300">Correo</Label>
                                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600">
                                    <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="correo@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none text-black dark:text-white dark:bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-gray-700 dark:text-gray-300">Contraseña</Label>
                                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600">
                                    <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <Input
                                        type="password"
                                        placeholder="contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none text-black dark:text-white dark:bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full rounded-xl hover:cursor-pointer text-white dark:text-gray-100 bg-black dark:bg-gray-900 hover:bg-gray-800 dark:hover:bg-gray-950 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </Button>
                            <div className="flex items-center gap-2 px-3 py-2">
                                <Label>¿ No Tienes cuenta ?</Label>
                                <Link className="text-blue-500 hover:underline" to="/register">Regístrate aquí</Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    );
};

export default LoginPage;