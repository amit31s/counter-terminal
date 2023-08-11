import { useEffect, useState } from "react";

export const useFeatureFlag = (featureFlag: boolean) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (featureFlag) {
      setIsActive(true);
    }
  }, [featureFlag]);

  return [isActive];
};
