import { IUpdateBasketState } from "../HomeScreen/updateBasket.slice";

export const defaultBasketData = (): IUpdateBasketState => ({
  items: [],
  customerToPay: 0,
  postOfficeToPay: 0,
  basketValue: 0,
  fulfilledAmountToNbit: 0,
  postOfficeTenderingAmount: 0,
  basketId: "",
});
