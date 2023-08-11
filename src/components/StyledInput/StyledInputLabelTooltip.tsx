import { Popover, Pressable, Text } from "native-base";
import { ReactElement, useCallback } from "react";
import { ColorValue } from "react-native";
import SVG, { Path } from "react-native-svg";

type StyledInputLabelTooltipProps = {
  tooltip: string;
  testId?: string;
  color: ColorValue;
};

const useStyledInputLabelTooltipTrigger = (
  fill: ColorValue,
): ((_props: Record<string, unknown>) => JSX.Element) => {
  const StyledInputLabelTooltipTrigger = useCallback(
    (props: Record<string, unknown>): JSX.Element => {
      return (
        <Pressable {...props} testID="TooltipTriggerTestId">
          <SVG width="40" height="40" viewBox="0 0 40 40" fill="none">
            <Path
              d="M18.334 11.6667H21.6673V15H18.334V11.6667ZM18.334 18.3333H21.6673V28.3333H18.334V18.3333ZM20.0007 3.33334C10.8007 3.33334 3.33398 10.8 3.33398 20C3.33398 29.2 10.8007 36.6667 20.0007 36.6667C29.2007 36.6667 36.6673 29.2 36.6673 20C36.6673 10.8 29.2007 3.33334 20.0007 3.33334ZM20.0007 33.3333C12.6507 33.3333 6.66732 27.35 6.66732 20C6.66732 12.65 12.6507 6.66668 20.0007 6.66668C27.3507 6.66668 33.334 12.65 33.334 20C33.334 27.35 27.3507 33.3333 20.0007 33.3333Z"
              fill={fill}
            />
          </SVG>
        </Pressable>
      );
    },
    [fill],
  );

  return StyledInputLabelTooltipTrigger;
};

export const StyledInputLabelTooltip = ({
  tooltip,
  color,
}: StyledInputLabelTooltipProps): ReactElement => {
  const StyledInputLabelTooltipTrigger = useStyledInputLabelTooltipTrigger(color);

  return (
    <Popover trigger={StyledInputLabelTooltipTrigger} placement="top right">
      <Popover.Content w="360px">
        <Popover.Arrow />
        <Popover.Body>
          <Text fontFamily="body" fontWeight="400" fontSize="20px">
            {tooltip}
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
};
