import { HStack, VStack } from "native-base";
import { ReactNode } from "react";
import styles from "./styles";

interface LayoutProps {
  children?: ReactNode;
  testID?: string;
}

export const ScreenLayout = ({ children, testID }: LayoutProps) => {
  return (
    <VStack flex={1} testID={testID}>
      <HStack flex={1}>{children}</HStack>
    </VStack>
  );
};

const LeftPanel = ({ children }: LayoutProps) => {
  return <VStack style={styles.leftPanelContainer}>{children}</VStack>;
};

const RightPanel = ({ children }: LayoutProps) => {
  return <VStack style={styles.rightPanelContainer}>{children}</VStack>;
};

ScreenLayout.LeftPanel = LeftPanel;
ScreenLayout.RightPanel = RightPanel;
