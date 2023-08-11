import { PromptProps } from "postoffice-commit-and-fulfill";
import { useAppDispatch } from "@ct/common";
import { setLoadingActive, setLoadingInactive } from "@ct/common/state/loadingStatus.slice";

export const useCommitFulfilPrompts = () => {
  const dispatch = useAppDispatch();
  const onShowModel = (id: string, modalProps: PromptProps) => {
    dispatch(
      setLoadingActive({
        id,
        modalProps,
      }),
    );
  };
  const onHideModel = (id: string) => {
    dispatch(setLoadingInactive(id));
  };

  return {
    onShowModel,
    onHideModel,
  };
};
