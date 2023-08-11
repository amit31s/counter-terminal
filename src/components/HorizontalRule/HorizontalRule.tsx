import { colorConstants } from "@ct/constants";
import { View } from "native-base";
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";

export const HorizontalRule = (props: IViewProps) => {
  return <View height="1px" my="24px" backgroundColor={colorConstants.seperatorColor} {...props} />;
};
