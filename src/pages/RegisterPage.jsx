import { useState } from 'react';
import { authService } from '@/features/auth/authService';
import { Link } from "react-router-dom";
import { BlurFade } from "../components/ui/blur-fade";
import { Text_03 } from "@/components/ui/wave-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, Lock } from "lucide-react";

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setLoading] = useState(false);
    
    // Estados exclusivos para los mensajes que solicitaste
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const data = await authService.register(
                email, 
                password, 
                fullname, 
                username.trim().replace(/\s+/g, '_')
            );

            // ESCENARIO 1: El correo ya estaba en uso (Supabase lo oculta devolviendo identities vacío)
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                setError("El correo electrónico ya está en uso.");
                setLoading(false);
                return;
            }

            // ESCENARIO 2: Registro exitoso. Se debe confirmar el correo.
            if (data.user) {
                setSuccessMessage("¡Registro exitoso! Por favor, revisa tu bandeja de entrada y confirma tu correo electrónico.");
                setEmail('');
                setPassword('');
                setFullname('');
                setUsername('');
                setLoading(false);
                return;
            }

        } catch (error) {

            const msg = error.message?.toLowerCase() || "";
            
            // 1. Demasiadas peticiones
            if (msg.includes('rate limit') || msg.includes('too many requests') || error.status === 429) {
                setError("Demasiados intentos. Por favor, espera unos minutos y vuelve a intentarlo.");
            } 
            // 2. Error en la Base de Datos (ESCENARIO 3: Username duplicado)
            else if (msg.includes('database error saving new user') || msg.includes('duplicate')) {
                setError("El nombre de usuario ya está en uso.");
            } 
            // 3. Correo explícitamente duplicado
            else if (msg.includes('user already registered')) {
                setError("El correo electrónico ya está en uso.");
            } 
            // Si es un error diferente (ej. contraseña débil, error enviando el email, etc)
            // Mostramos el mensaje literal de Supabase para no engañar al usuario
            else {
                setError(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
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
                            Regístrate
                        </CardTitle>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Regístrate para crear una cuenta y empieza a gestionar tus finanzas.
                        </p>
                    </CardHeader>
                    <CardContent style={{ pointerEvents: "auto", position: "relative" }}>
                        
                        {/* Mensajes de Error */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm font-medium text-red-700 dark:text-red-400 text-center">{error}</p>
                            </div>
                        )}

                        {/* Mensaje de Éxito */}
                        {successMessage && (
                            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <p className="text-sm font-medium text-green-700 dark:text-green-400 text-center">
                                    {successMessage}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <Label className="text-gray-700 dark:text-gray-300">Nombre Completo</Label>
                                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600">
                                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Nombre Completo"
                                        value={fullname}
                                        onChange={(e) => setFullname(e.target.value)}
                                        className="w-full border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none text-black dark:text-white dark:bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                        required
                                        disabled={isLoading || successMessage !== ''}
                                    />
                                </div>
                            </div>
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
                                        disabled={isLoading || successMessage !== ''}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-gray-700 dark:text-gray-300">Username</Label>
                                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600">
                                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none text-black dark:text-white dark:bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                        required
                                        disabled={isLoading || successMessage !== ''}
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
                                        disabled={isLoading || successMessage !== ''}
                                    />
                                </div>
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full rounded-xl hover:cursor-pointer text-white dark:text-gray-100 bg-black dark:bg-gray-900 hover:bg-gray-800 dark:hover:bg-gray-950 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                disabled={isLoading || successMessage !== ''}
                            >
                                {isLoading ? "Registrando..." : "Registrarse"}
                            </Button>
                            <div className="flex items-center gap-2 px-3 py-2">
                                <Label>¿Ya tienes Cuenta?</Label>
                                <Link className="text-blue-500 hover:underline" to="/login">Inicia sesión aquí</Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    )
}

export default RegisterPage;