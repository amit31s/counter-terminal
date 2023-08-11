import { InformativeModal } from "postoffice-spm-components";
import { ComponentProps, Dispatch, SetStateAction, useCallback, useMemo } from "react";

export type HomeButtonModalProps = {
  homeModalOpen: boolean;
  setHomeModalOpen: Dispatch<SetStateAction<boolean>>;
  journeyReset: () => void;
};
export function HomeButtonModal({
  homeModalOpen,
  setHomeModalOpen,
  journeyReset,
}: HomeButtonModalProps) {
  const closeHomeModal = useCallback(() => {
    setHomeModalOpen(false);
  }, [setHomeModalOpen]);

  const homeModalActions = useMemo<NonNullable<ComponentProps<typeof InformativeModal>["actions"]>>(
    () => [
      {
        title: "Cancel",
        onPress: closeHomeModal,
        variant: "secondary",
      },
      {
        title: "Proceed",
        onPress() {
          closeHomeModal();
          journeyReset();
        },
      },
    ],
    [closeHomeModal, journeyReset],
  );

  return (
    <InformativeModal
      title="Return to home"
      description="Do you want to end the flow for the current transaction?"
      isVisible={homeModalOpen}
      close={closeHomeModal}
      actions={homeModalActions}
    />
  );
}
