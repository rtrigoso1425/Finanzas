import { useState, useRef } from "react";

export const useImageUpload = (initialImage = null) => {
    const [previewUrl, setPreviewUrl] = useState(initialImage);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleThumbnailClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Crear URL temporal para previsualización inmediata
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return {
        previewUrl,
        file,
        fileInputRef,
        handleThumbnailClick,
        handleFileChange,
        handleRemove,
        setPreviewUrl // Exportamos esto por si necesitamos resetear externamente
    };
};