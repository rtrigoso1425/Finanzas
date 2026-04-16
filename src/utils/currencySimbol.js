import { useSelector } from "react-redux";

export const CurrencySymbol = () => {
  const { user } = useSelector((state) => state.auth);

  const currency = user?.currency

  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "PEN":
      return "S/";
    default:
      if (currency) {
        console.warn(`Moneda "${currency}" no reconocida, usando $`);
      }
      return "$";
  }
};