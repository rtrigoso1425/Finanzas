import { useState } from 'react';
import { uploadProfileImageFeature } from '../features/user/updateUserService';
import { useSelector, useDispatch } from "react-redux"
import { updateAvatar } from '../features/auth/authSlice';

export const ImageUploader = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleUpload = async () => {
    try {
        if (!file) return;
        setStatus('loading');
        
        // 1. Subir la imagen y obtener la nueva URL (tu feature ya hace esto)
        const newUrl = await uploadProfileImageFeature(file, user);
        
        // 2. MAGIA AQUÍ: Actualizamos Redux manualmente con la nueva URL
        // Esto hará que todos los componentes (Sidebar, Header, Dashboard) 
        // detecten el cambio y pinten la nueva foto al instante.
        dispatch(updateAvatar(newUrl));
        
        setStatus('success');
        setFile(null); // Limpiamos el input
        
        // Opcional: Mostrar una alerta o toast de éxito
        alert("¡Foto de perfil actualizada!");
        
    } catch (err) {
        console.error("Error al subir:", err);
        setStatus('error');
        alert("Error: " + err.message);
    }
};

return (
    <div className="flex flex-col gap-4 p-4 bg-slate-900 border border-slate-700 rounded-xl mt-4">
        <h3 className="text-white font-bold text-sm">Cambiar Foto de Perfil</h3>

        <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
        />

        <button 
            onClick={handleUpload}
            disabled={!file || status === 'loading'}
            className={`py-2 px-4 rounded-lg font-bold transition-all ${
                status === 'loading' 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-500 text-white shadow-lg'
            }`}
        >
            {status === 'loading' ? 'Subiendo...' : 'Actualizar Foto'}
        </button>

        {status === 'success' && (
            <p className="text-green-400 text-xs text-center font-medium">
                ¡Listo! Tu perfil se ha actualizado.
            </p>
        )}
        {status === 'error' && (
            <p className="text-red-400 text-xs text-center">
                Ocurrió un error. Inténtalo de nuevo.
            </p>
        )}
    </div>
    );
};

export default ImageUploader;