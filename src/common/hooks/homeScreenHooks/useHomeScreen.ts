import { useFulfilmentActions } from "../useFulfilmentActions";
import { useLoadNbitBasket } from "./useLoadNbitBasket";

export const useHomeScreen = () => {
  useFulfilmentActions();
  useLoadNbitBasket();
};
