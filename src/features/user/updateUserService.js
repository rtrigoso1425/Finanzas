// src/features/user/updateUserService.js
import { supabase } from "../supabase/supabaseClient";

const convertToJpeg = (inputFile) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(inputFile);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = "#FFFFFF"; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("Error en conversión"));
                }, 'image/jpeg', 0.8);
            };
        };
        reader.onerror = reject;
    });
};

export const uploadProfileImageFeature = async (file, user, bucketName = 'profile_photos') => {
    if (!file) throw new Error("No hay archivo");
    if (!user?.id) throw new Error("Usuario no autenticado");
    // 1. LIMPIEZA: Buscar y borrar imágenes viejas
    const { data: oldFiles } = await supabase.storage
        .from(bucketName)
        .list('', { search: `avatar_${user.id}` });

    if (oldFiles && oldFiles.length > 0) {
        const filesToDelete = oldFiles.map(f => f.name);
        await supabase.storage.from(bucketName).remove(filesToDelete);
    }

    // 2. SUBIDA
    const jpegBlob = await convertToJpeg(file);
    const fileName = `avatar_${user.id}_${Date.now()}.jpg`;

    const { error: storageError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, jpegBlob, {
            contentType: 'image/jpeg',
            upsert: true
        });

    if (storageError) throw storageError;

    // 3. OBTENER URL PÚBLICA (ESTA ES LA CLAVE)
    const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

    // 4. ACTUALIZAR DB
    const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

    if (dbError) throw dbError;

    return publicUrl; 
};