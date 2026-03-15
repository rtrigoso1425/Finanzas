export const getTimeAgo = (dateString) => {
    if (!dateString) return "Reciente";
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `Hace ${Math.floor(interval)} año${Math.floor(interval) !== 1 ? 's' : ''}`;
    
    interval = seconds / 2592000;
    if (interval > 1) return `Hace ${Math.floor(interval)} mese${Math.floor(interval) !== 1 ? 's' : ''}`;
    
    interval = seconds / 86400;
    if (interval > 1) return `Hace ${Math.floor(interval)} día${Math.floor(interval) !== 1 ? 's' : ''}`;
    
    interval = seconds / 3600;
    if (interval > 1) return `Hace ${Math.floor(interval)} hora${Math.floor(interval) !== 1 ? 's' : ''}`;
    
    interval = seconds / 60;
    if (interval > 1) return `Hace ${Math.floor(interval)} min`;
    
    return "Hace un momento";
};