import { deviceConfig, userConfig } from "@ct/configs/awsConfig";
import { useMemo } from "react";
import { AuthConfigType } from "../state/auth.slice";
import { useAppSelector } from "./useAppSelector";

export const useAWSConfig = () => {
  const { configStatus } = useAppSelector((rootState) => rootState.auth);

  const authConfig = useMemo(
    () => (configStatus === AuthConfigType.DEVICE_CONFIG ? deviceConfig : userConfig),
    [configStatus],
  );

  return { authConfig };
};
