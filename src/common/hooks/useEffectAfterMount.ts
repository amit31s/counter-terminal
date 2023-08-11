import { DependencyList, useEffect, useRef } from "react";

export const useEffectAfterMount = (cb: () => void | (() => void), deps: DependencyList) => {
  const componentJustMounted = useRef(true);

  useEffect(() => {
    if (componentJustMounted.current) {
      componentJustMounted.current = false;
      return;
    }

    if (cb) {
      return cb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);
};
