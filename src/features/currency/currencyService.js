import { supabase } from "../supabase/supabaseClient";

export const currencyService = {
    async getCurrencies(amount, fromCurrency, toCurrency) {
        const { data, error } = await supabase.functions
        .invoke('currency-converter',{
            body: { 
                from: fromCurrency,
                to: toCurrency,
                amount: amount
            }
        });
        if (error) throw error;
        return data;
    }
}