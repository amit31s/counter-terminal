import { useAppSelector } from "./useAppSelector";

export const useGetUser = () => {
  const { device } = useAppSelector((rootState) => rootState.auth);
  return { device };
};
