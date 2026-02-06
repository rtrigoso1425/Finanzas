import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Check, ImagePlus, X, Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/features/supabase/supabaseClient";
import { setUser } from "@/features/auth/authSlice";
import { AvatarUploader } from "@/components/avatar-uploader";

const SettingsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [error, setError] = useState("");

    // Estado local para el formulario
    const [formData, setFormData] = useState({
        username: "",
    });

    // Cargar datos de Redux al formulario cuando el usuario está disponible
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMsg("");
        setError("");

        try {

            const updates = {
                id: user.id,
                username: formData.username,
                updated_at: new Date().toISOString(),
            };

            const { error: dbError } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (dbError) throw dbError;

            // Actualizar Redux con los nuevos datos
            dispatch(setUser({ ...user, ...updates }));
            setSuccessMsg("Perfil actualizado correctamente");

        } catch (error) {
            console.error("Error updating profile:", error);
            
            // Manejo específico de errores
            let errorMessage = "Error al guardar los cambios";
            
            if (error.message.includes('duplicate') || error.message.includes('Duplicate')) {
                errorMessage = "El nombre de usuario ya está en uso. Por favor, elige otro.";
            } else if (error.code === '23505') {
                errorMessage = "El nombre de usuario ya está registrado. Por favor, elige otro.";
            } else {
                errorMessage = error.message || "Error desconocido al actualizar perfil";
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return <div>Cargando...</div>;

    return (
        <div className="overflow-y-auto pb-10">
            {/* Pasamos user.avatar_url para el fondo también */}
            <ProfileBg defaultImage={user.avatar_url} />
            <Avatar user={user} dispatch={dispatch} />
            
            <div className="px-6 pb-6 pt-4">
                <form onSubmit={handleSaveChanges} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="peer pe-9"
                                placeholder="username"
                                type="text"
                                required
                            />
                            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                <Check size={16} strokeWidth={2} className="text-emerald-500" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {successMsg && <p className="text-sm text-green-600 font-medium">{successMsg}</p>}
                        <Button type="submit" disabled={isLoading} className="ml-auto">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Componente para el fondo (decorativo por ahora)
function ProfileBg({ defaultImage }) {
    // Si tienes una columna 'cover_url' en la BD, úsala aquí. 
    // Por ahora uso el avatar con blur como efecto visual.
    const currentImage = defaultImage; 

    return (
        <div className="h-32 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
            {currentImage ? (
                <img
                    className="h-full w-full object-cover opacity-50 blur-sm"
                    src={currentImage}
                    alt="Background"
                />
            ) : (
                <div className="h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
            )}
        </div>
    );
}

// Componente Avatar funcional con AvatarUploader
function Avatar({ user, dispatch }) {
    return (
        <div className="-mt-10 px-6">
            <AvatarUploader user={user} aspect={1}>
                <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm shadow-black/10 cursor-pointer hover:opacity-80 transition-opacity">
                    <img
                        src={user?.avatar_url || "https://i.ibb.co/k6WjwY6N/default.jpg"}
                        className="h-full w-full object-cover"
                        width={80}
                        height={80}
                        alt="Profile"
                        onError={(e) => { e.target.src = 'https://i.ibb.co/k6WjwY6N/default.jpg'; }}
                    />
                    
                    <button
                        type="button"
                        className="absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-offset-2 transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
                        aria-label="Change profile picture"
                    >
                        <ImagePlus size={16} strokeWidth={2} aria-hidden="true" />
                    </button>
                </div>
            </AvatarUploader>
        </div>
    );
}

export default SettingsPage;