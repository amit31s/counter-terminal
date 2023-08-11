import { StyledButton, StyledButtonProps } from "@ct/components";
import { colorConstants, stringConstants } from "@ct/constants";
import {
  Box,
  IBoxProps,
  IImageProps,
  Image,
  IModalProps,
  ITextProps,
  Modal,
  Pressable,
  Text,
} from "native-base";
import { ReactElement, ReactNode, useMemo } from "react";
import { StyleSheet } from "react-native";
import { StyledCustomModalCloseIcon } from "@ct/assets/icons";
const IMAGE_WIDTH = 230;

const CustomModalImage = (props: IImageProps): ReactElement => {
  return (
    <Box w={`${IMAGE_WIDTH}px`} alignItems="stretch" p={2}>
      <Image flex={1} resizeMode="cover" {...props} />
    </Box>
  );
};

const buttonStyles = StyleSheet.create({
  primaryButton: {
    marginRight: 32,
  },
  secondaryButton: {
    borderWidth: 3,
    borderColor: colorConstants.blue,
  },
});

const secondaryWithMargin = [buttonStyles.secondaryButton, buttonStyles.primaryButton];

type CustomModalContentProps = {
  width: number;
  containerProps: IBoxProps;
  content: string | ReactNode;
  contentProps: ITextProps;
  title: string;
  titleProps: ITextProps;
  icon?: ReactNode;
  showCloseButton: boolean;
  onClose?: () => void;
  buttonGroupProps: IBoxProps;
  primaryButtonProps?: StyledButtonProps | StyledButtonProps[];
  secondaryButtonProps?: StyledButtonProps | StyledButtonProps[];
};

const CustomModalContent = ({
  width,
  containerProps,
  content,
  contentProps,
  title,
  titleProps,
  icon,
  showCloseButton,
  onClose,
  buttonGroupProps,
  primaryButtonProps,
  secondaryButtonProps,
}: CustomModalContentProps): ReactElement => {
  const hasTitle = title.length > 0 || showCloseButton;
  const hasContent = typeof content !== "string" || content.length > 0;

  const primaryButtonPropsArray = useMemo(() => {
    if (typeof primaryButtonProps === "undefined") {
      return [];
    }

    if (!(primaryButtonProps instanceof Array)) {
      return [primaryButtonProps];
    }

    return primaryButtonProps;
  }, [primaryButtonProps]);

  const secondaryButtonPropsArray = useMemo(() => {
    if (typeof secondaryButtonProps === "undefined") {
      return [];
    }

    if (!(secondaryButtonProps instanceof Array)) {
      return [secondaryButtonProps];
    }

    return secondaryButtonProps;
  }, [secondaryButtonProps]);

  return (
    <Box alignItems="stretch" w={`${width}px`} py={8} px={12} {...containerProps}>
      {icon && (
        <Box w="80px" h="80px" mb={8} alignSelf="center">
          {icon}
        </Box>
      )}
      {(hasTitle || hasContent) && (
        <Box>
          {hasTitle && (
            <Box borderBottomWidth={0} p={0} mb={hasContent ? 4 : 0} flexDir="row">
              <Text
                flex={1}
                fontSize="30px"
                lineHeight="40px"
                fontFamily="body"
                fontWeight="700"
                testID={stringConstants.CustomModal.titleTestId}
                textAlign={icon ? "center" : "left"}
                {...titleProps}
              >
                {title}
              </Text>
              {showCloseButton && (
                <Pressable
                  onPress={onClose}
                  w="40px"
                  h="40px"
                  alignItems="center"
                  justifyContent="center"
                  testID={stringConstants.CustomModal.closeButtonTestId}
                >
                  <StyledCustomModalCloseIcon />
                </Pressable>
              )}
            </Box>
          )}
          {hasContent && (
            <Box p={0}>
              {typeof content === "string" ? (
                <Text
                  fontSize="24px"
                  lineHeight="34px"
                  fontFamily="body"
                  fontWeight={400}
                  textAlign={icon ? "center" : "left"}
                  {...contentProps}
                >
                  {content}
                </Text>
              ) : (
                content
              )}
            </Box>
          )}
        </Box>
      )}
      {(primaryButtonPropsArray.length > 0 || secondaryButtonPropsArray.length > 0) && (
        <Box
          borderTopWidth={0}
          p={0}
          mt={hasContent || hasTitle ? 8 : 0}
          justifyContent={icon ? "center" : "flex-start"}
          flexDir="row-reverse"
          testID={stringConstants.CustomModal.actionButtonContainerTestId}
          {...buttonGroupProps}
        >
          {primaryButtonPropsArray.map((buttonProps, index) => (
            <StyledButton
              key={`${index}-${buttonProps.label}`}
              type="tertiary"
              styles={index > 0 ? buttonStyles.primaryButton : undefined}
              {...buttonProps}
            />
          ))}
          {secondaryButtonPropsArray.map((buttonProps, index) => (
            <StyledButton
              key={`${index}-${buttonProps.label}`}
              type="secondary"
              styles={
                primaryButtonPropsArray.length > 0 || index > 0
                  ? secondaryWithMargin
                  : buttonStyles.secondaryButton
              }
              {...buttonProps}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export type CustomModalSize = "small" | "medium" | "large";

const CONTENT_WIDTHS: Record<CustomModalSize, number> = {
  small: 560,
  medium: 760,
  large: 960,
};

export type CustomModalProps = {
  containerProps?: IBoxProps;
  content?: string | ReactNode;
  contentProps?: ITextProps;
  contentSize?: CustomModalSize;
  title?: string;
  titleProps?: ITextProps;
  showCloseButton?: boolean;
  imageProps?: IImageProps;
  icon?: ReactNode;
  buttonGroupProps?: IBoxProps;
  primaryButtonProps?: StyledButtonProps | StyledButtonProps[];
  secondaryButtonProps?: StyledButtonProps | StyledButtonProps[];
} & IModalProps;

// TODO: add link button styles
const CustomModal = ({
  containerProps = {},
  content = "",
  contentProps = {},
  contentSize = "small",
  title = "",
  titleProps = {},
  showCloseButton = false,
  imageProps,
  icon,
  buttonGroupProps = {},
  primaryButtonProps,
  secondaryButtonProps,
  onClose,
  isOpen,
  ...otherProps
}: CustomModalProps): ReactElement => {
  const width = useMemo(
    () => (imageProps === undefined ? 0 : IMAGE_WIDTH) + CONTENT_WIDTHS[contentSize],
    [contentSize, imageProps],
  );

  if (!isOpen) {
    return <></>;
  }

  return (
    <Modal isOpen={isOpen} {...otherProps} useRNModal>
      <Box flexDir="row" w={`${width}px`} bgColor="white">
        {imageProps !== undefined && <CustomModalImage {...imageProps} />}
        <CustomModalContent
          containerProps={containerProps}
          onClose={onClose}
          width={CONTENT_WIDTHS[contentSize]}
          content={content}
          contentProps={contentProps}
          title={title}
          titleProps={titleProps}
          showCloseButton={showCloseButton}
          buttonGroupProps={buttonGroupProps}
          primaryButtonProps={primaryButtonProps}
          secondaryButtonProps={secondaryButtonProps}
          icon={icon}
        />
      </Box>
    </Modal>
  );
};

export default CustomModal;
