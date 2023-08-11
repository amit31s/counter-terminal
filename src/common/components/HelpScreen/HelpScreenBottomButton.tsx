import { MaterialSymbol } from "@ct/assets/icons";
import useWindowSize from "@ct/common/hooks/useWindowSize";
import { CustomModal } from "@ct/components";
import { colorConstants, stringConstants, Styles, TEXT } from "@ct/constants";
import { View } from "native-base";
import { BasketButton } from "postoffice-spm-components";
import { Dispatch, SetStateAction, useState } from "react";

type HelpScreenBottomButtonProps = {
  helpScreenWidth: number;
  setHelpScreenWidth: Dispatch<SetStateAction<number>>;
};
export function HelpScreenBottomButton({
  helpScreenWidth,
  setHelpScreenWidth,
}: HelpScreenBottomButtonProps) {
  const [arrowButtonDisabled, _setArrowButtonDisabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const windowDimensions = useWindowSize();
  return (
    <>
      <View flex={1} flexDirection="row" justifyContent={"flex-start"}>
        <View marginRight={"12px"}>
          <BasketButton
            title=""
            size="sm_small"
            variant="secondary"
            disabled={arrowButtonDisabled}
            icon={
              <MaterialSymbol
                name={"arrow_left_alt"}
                color={
                  arrowButtonDisabled
                    ? colorConstants.buttonColors.disabled.blue
                    : colorConstants.blue
                }
              />
            }
          />
        </View>
        <View marginRight={"12px"}>
          <BasketButton
            title=""
            size="sm_small"
            variant="secondary"
            icon={
              <MaterialSymbol
                name={"arrow_right_alt"}
                color={
                  arrowButtonDisabled
                    ? colorConstants.buttonColors.disabled.blue
                    : colorConstants.blue
                }
              />
            }
            disabled={arrowButtonDisabled}
          />
        </View>
      </View>
      <View flex={1} flexDirection="row" justifyContent={"flex-end"}>
        <View marginRight={"12px"}>
          <BasketButton
            testID="max_min_button_test"
            title=""
            size="sm_small"
            variant="secondary"
            icon={
              helpScreenWidth !== Styles.minimizeHelpScreenWidth ? (
                <MaterialSymbol name={"unfold_less"} color={colorConstants.blue} rotate="45" />
              ) : (
                <MaterialSymbol name={"expand_content"} color={colorConstants.blue} />
              )
            }
            onPress={() => {
              helpScreenWidth !== Styles.minimizeHelpScreenWidth
                ? setHelpScreenWidth(Styles.minimizeHelpScreenWidth)
                : setHelpScreenWidth(windowDimensions.width);
            }}
          />
        </View>
        <View>
          <BasketButton
            testID="help_hub_test"
            variant={"secondary"}
            title={"Help hub"}
            size="sm_medium"
            icon={<MaterialSymbol name={"help"} color={colorConstants.blue} />}
            onPress={() => {
              setIsOpen(true);
            }}
          />
        </View>
      </View>
      <CustomModal
        testID={stringConstants.printReceiptConfirmation}
        title={TEXT.CTTXT00079}
        primaryButtonProps={{
          label: stringConstants.Button.Ok,
          testID: stringConstants.Button.Ok,
          onPress: () => {
            setIsOpen(false);
          },
        }}
        isOpen={isOpen}
      />
    </>
  );
}
