import { StyledCloseIcon } from "@ct/assets/icons";
import { COLOR_CONSTANTS, TEXT } from "@ct/constants";
import { Box, Pressable, Text } from "native-base";
import { ReactChild } from "react";
import styles from "./styles";

export enum NotificationStatus {
  WARNING = "warning",
  FAILURE = "failure",
  SUCCESS = "success",
}

type NotificationType = {
  icon?: ReactChild;
  onClosePress: () => void;
  title: string;
  message: string;
  id: string;
  type: NotificationStatus;
};

export type BackgroundAndBorderColor = { backgroundColor: string; borderColor: string };
export const backgroundAndBorderColor = (type: NotificationStatus): BackgroundAndBorderColor => {
  const { notificationBackground, notificationBorder } = COLOR_CONSTANTS;
  if (type === NotificationStatus.WARNING) {
    return {
      backgroundColor: notificationBackground,
      borderColor: notificationBorder,
    };
  }
  return {
    backgroundColor: notificationBackground,
    borderColor: notificationBorder,
  };
};

export const Notification = ({
  icon,
  onClosePress,
  title,
  message,
  id,
  type,
}: NotificationType) => {
  const { backgroundColor, borderColor } = backgroundAndBorderColor(type);
  return (
    <Box
      background={backgroundColor}
      borderColor={borderColor}
      style={styles.notificationHolder}
      testID={id}
    >
      {icon && (
        <Box style={styles.warningIconHolder}>
          <Box style={styles.warningIcon}>{icon}</Box>
        </Box>
      )}
      <Box style={styles.textHolder} margin={"3"}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.bodyText}>{message}</Text>
      </Box>
      <Box style={styles.closeIconHolder}>
        <Pressable testID={TEXT.CTTXT00011} onPress={onClosePress}>
          <StyledCloseIcon />
        </Pressable>
      </Box>
    </Box>
  );
};
