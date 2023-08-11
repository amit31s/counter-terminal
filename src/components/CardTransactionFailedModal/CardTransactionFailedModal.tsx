import { StyledErrorWarningAmberIcon } from "@ct/assets/icons";
import { CustomModal } from "@ct/components/CustomModal";
import { stringConstants } from "@ct/constants";
import { ReactElement, useEffect, useState } from "react";

export type CardTransactionFailedModalProps = {
  description: string | null;
  id: string | null;
  onClose?: () => void;
};

const CardTransactionFailedModal = ({
  description,
  id,
  onClose,
}: CardTransactionFailedModalProps): ReactElement => {
  const [cachedId, setCachedId] = useState<string | null>(null);
  const [cachedDescription, setCachedDesciption] = useState<string | null>(null);

  const isOpen = description !== null || id !== null;

  useEffect(() => {
    if (isOpen) {
      setCachedId(id);
      setCachedDesciption(description);
    }
  }, [description, id, isOpen]);

  const renderedId = isOpen ? id : cachedId;
  const renderedDescription = isOpen ? description : cachedDescription;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Transaction failed${renderedId !== null ? `\nError ${renderedId}` : ""}`}
      content={renderedDescription ?? "An unknown error occured."}
      icon={<StyledErrorWarningAmberIcon />}
      primaryButtonProps={{
        label: stringConstants.Button.Continue,
        onPress: onClose,
      }}
    />
  );
};

export default CardTransactionFailedModal;
