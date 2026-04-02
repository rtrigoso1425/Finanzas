export const monthString = (transaction) => {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const actualYear = new Date().getFullYear();

    const mes = new Date(transaction.date).getMonth();

    if (new Date(transaction.date).getFullYear() === actualYear) {
        return `${months[mes]}`;
    } else {
        return `${months[mes]} ${new Date(transaction.date).getFullYear()}`;
    }
};