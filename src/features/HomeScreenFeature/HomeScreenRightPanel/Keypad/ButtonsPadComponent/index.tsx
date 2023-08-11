import { View } from "native-base";
import { RefContext } from "postoffice-global-ref-input";
import { BasketButton } from "postoffice-spm-components";
import { RefObject, useCallback, useContext, useMemo } from "react";
import { TextInput } from "react-native";
import styles from "./styles";

export type ButtonPadProps = {
  scannerInputRef?: RefObject<TextInput>;
};

const buttonsArray = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["0", ".", "Enter"],
];

export const ButtonsPad = ({ scannerInputRef }: ButtonPadProps) => {
  const { setPendingChanges } = useContext(RefContext);

  const enterClicked = useCallback(() => {
    try {
      scannerInputRef?.current?.focus();
      setPendingChanges?.({
        value: null,
        action: "enter",
      });
    } catch (e) {
      console.log(e);
    }
  }, [scannerInputRef, setPendingChanges]);

  const keyClicked = useCallback(
    (col: string) => {
      try {
        if (col === "Enter") {
          enterClicked();
        } else {
          setPendingChanges?.((prev) => ({
            value: `${prev?.value || ""}${col}`,
            action: "numkey",
          }));
        }
      } catch (e) {
        console.log(col, "clicked", e);
      }
    },
    [enterClicked, setPendingChanges],
  );

  return (
    <View style={styles.buttonsPadView}>
      {useMemo(
        () =>
          buttonsArray.map((row, i) => (
            <View key={i} style={styles.numberView} marginTop={i > 0 ? "12px" : "0px"}>
              {row.map((col, j) => (
                <View key={j} marginRight="12px">
                  <BasketButton title={col} onPress={() => keyClicked(col)} />
                </View>
              ))}
            </View>
          )),
        [keyClicked],
      )}
    </View>
  );
};
