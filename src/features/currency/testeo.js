import { supabase } from '@/features/supabase/supabaseClient'; // Ajusta tu ruta

// Función para probar la conversión
export const testCurrencyConversion = async () => {
  try {
    
    const { data, error } = await supabase.functions.invoke('currency-converter', {
      body: { 
        from: 'EUR',   // De Euros
        to: 'USD',     // A Dólares
        amount: 100    // Monto a convertir
      }
    });

    if (error) throw error;


    // data.convertedAmount tendrá el valor en dólares
    
  } catch (err) {
    console.error("Error llamando a la Edge Function:", err);
  }
};