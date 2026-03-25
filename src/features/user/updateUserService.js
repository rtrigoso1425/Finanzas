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
    if (!user?.email) throw new Error("Usuario sin email");

    // 1. CONVERTIR A JPEG
    const jpegBlob = await convertToJpeg(file);
    
    // 2. NOMBRE FIJO (Sin timestamp aquí)
    // Al usar siempre el mismo nombre, Supabase sobreescribirá el archivo anterior.
    // Así mantienes tu Storage limpio con solo 1 foto por usuario.
    const fileName = `${user.username}.jpg`;

    // 3. SUBIDA (Con upsert: true para forzar la sobreescritura)
    const { error: storageError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, jpegBlob, {
            contentType: 'image/jpeg',
            upsert: true 
        });

    if (storageError) throw storageError;

    // 4. OBTENER URL PÚBLICA
    const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

    const publicUrlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;

    const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrlWithCacheBuster })
        .eq('id', user.id);

    if (dbError) throw dbError;

    return publicUrlWithCacheBuster; 
};