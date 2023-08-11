import { getJourneyStatus, useAppSelector } from "@ct/common";

import { JourneyRenderer } from "@ct/components/JourneyRenderer";
import { View } from "native-base";
import { RefObject, useCallback, useState } from "react";
import { TextInput } from "react-native";
import { InputBar } from "./InputBar";
import { useJourneyCheck } from "./hooks/useJourneyCheck";
import { useRequestCommitOnItemAdded } from "./hooks/useRequestCommit";

export type JourneyProps = {
  scannerInputRef?: RefObject<TextInput>;
};

export const Journey = ({ scannerInputRef }: JourneyProps) => {
  const [barcodeNotRecognized, setBarcodeNotRecognized] = useState<boolean>(false);
  const journeyCheck = useJourneyCheck();
  const { open } = useAppSelector(getJourneyStatus);

  const handleBarcodeNotRecognized = useCallback(() => {
    setBarcodeNotRecognized(true);
  }, []);

  useRequestCommitOnItemAdded();

  return (
    <View flex={1}>
      {!open && (
        <InputBar
          scannerInputRef={scannerInputRef}
          barcodeNotRecognized={barcodeNotRecognized}
          setBarcodeNotRecognized={setBarcodeNotRecognized}
        />
      )}
      <JourneyRenderer
        barcodeNotRecognizedCb={handleBarcodeNotRecognized}
        journeyOnComplete={journeyCheck}
      />
    </View>
  );
};
