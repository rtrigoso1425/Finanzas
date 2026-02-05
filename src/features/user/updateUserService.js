import { supabase } from "../supabase/supabaseClient";
/**
 * Convierte un File a un Blob JPEG
 */
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
        
                ctx.fillStyle = "#FFFFFF"; // Fondo para evitar negro en transparencias
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
    if (!user?.id || !user?.email) throw new Error("Usuario no autenticado");
    if (!file.type.startsWith('image/')) {
        throw new Error("El archivo seleccionado no es una imagen válida.");
    }

    const jpegBlob = await convertToJpeg(file);
    const fileName = `${user?.email}.jpg`;

    const { data, storageError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, jpegBlob, {
            contentType: 'image/jpeg',
            upsert: true
        });

    if (storageError) throw storageError;

    const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

    const publicUrlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;

    const { error: dbError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrlWithCacheBuster })
    .eq('id', user.id); // Filtramos por el ID del usuario logueado

    if (dbError) throw dbError;

    return data.path;
};