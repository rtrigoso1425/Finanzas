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
            setStatus('loading');
            const path = await uploadProfileImageFeature(file, user);
            dispatch(updateAvatar(path));
            console.log("Subido con éxito a:", path);
            setStatus('success');
            setFile(null); // Limpiar input
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4 bg-slate-900 border border-slate-700 rounded-xl">
            <label className="text-white text-sm font-medium">Subir Comprobante</label>
        
            <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />

            <button 
                onClick={handleUpload}
                disabled={!file || status === 'loading'}
                className={`py-2 px-4 rounded-lg font-bold transition-all ${
                    status === 'loading' ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
            >
                {status === 'loading' ? 'Procesando...' : 'Guardar en Finanzas'}
            </button>
            {status === 'success' && <p className="text-green-400 text-xs text-center">¡Subido correctamente!</p>}
            {status === 'error' && <p className="text-red-400 text-xs text-center">Ocurrió un error al subir.</p>}
        </div>
    );
};