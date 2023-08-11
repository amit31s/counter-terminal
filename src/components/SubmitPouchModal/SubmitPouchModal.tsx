import { StyledButton, StyledButtonProps } from "@ct/components";
import { colorConstants, stringConstants } from "@ct/constants";
import { Box, IBoxProps, IImageProps, IModalProps, ITextProps, Modal, Text } from "native-base";
import { ReactElement, ReactNode, useMemo } from "react";
import { StyleSheet } from "react-native";

const IMAGE_WIDTH = 230;

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

type SubmitPouchModalContentProps = {
  width: number;
  containerProps: IBoxProps;
  content: string | ReactNode;
  contentProps: ITextProps;
  title: string;
  titleProps: ITextProps;
  icon?: ReactNode;
  buttonGroupProps: IBoxProps;
  primaryButtonProps?: StyledButtonProps | StyledButtonProps[];
  secondaryButtonProps?: StyledButtonProps | StyledButtonProps[];
  otherButtonProps?: StyledButtonProps | StyledButtonProps[];
};

const SubmitPouchModalContent = ({
  width,
  containerProps,
  content,
  contentProps,
  title,
  titleProps,
  icon,
  buttonGroupProps,
  primaryButtonProps,
  secondaryButtonProps,
  otherButtonProps,
}: SubmitPouchModalContentProps): ReactElement => {
  const hasTitle = title.length > 0;
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

  const otherButtonPropsArray = useMemo(() => {
    if (typeof otherButtonProps === "undefined") {
      return [];
    }

    if (!(otherButtonProps instanceof Array)) {
      return [otherButtonProps];
    }

    return otherButtonProps;
  }, [otherButtonProps]);

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
                fontSize="24px"
                lineHeight="40px"
                fontFamily="body"
                fontWeight={400}
                testID={stringConstants.SubmitPouchModal.titleTestId}
                textAlign={icon ? "center" : "left"}
                {...titleProps}
              >
                {title}
              </Text>
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
      {(primaryButtonPropsArray.length > 0 ||
        secondaryButtonPropsArray.length > 0 ||
        otherButtonPropsArray.length > 0) && (
        <Box
          borderTopWidth={0}
          p={0}
          mt={hasContent || hasTitle ? 8 : 0}
          justifyContent={icon ? "center" : "flex-start"}
          flexDir="row-reverse"
          testID={stringConstants.SubmitPouchModal.actionButtonContainerTestId}
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

          {otherButtonPropsArray.map((buttonProps, index) => (
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

export type SubmitPouchModalSize = "small" | "medium" | "large";

const CONTENT_WIDTHS: Record<SubmitPouchModalSize, number> = {
  small: 560,
  medium: 760,
  large: 960,
};

export type SubmitPouchModalProps = {
  containerProps?: IBoxProps;
  content?: string | ReactNode;
  contentProps?: ITextProps;
  contentSize?: SubmitPouchModalSize;
  title?: string;
  titleProps?: ITextProps;
  imageProps?: IImageProps;
  icon?: ReactNode;
  buttonGroupProps?: IBoxProps;
  primaryButtonProps?: StyledButtonProps | StyledButtonProps[];
  secondaryButtonProps?: StyledButtonProps | StyledButtonProps[];
  otherButtonProps?: StyledButtonProps | StyledButtonProps[];
} & IModalProps;

// TODO: add link button styles
const SubmitPouchModal = ({
  containerProps = {},
  content = "",
  contentProps = {},
  contentSize = "medium",
  title = "",
  titleProps = {},
  imageProps,
  icon,
  buttonGroupProps = {},
  primaryButtonProps,
  secondaryButtonProps,
  otherButtonProps,
  isOpen,
  ...otherProps
}: SubmitPouchModalProps): ReactElement => {
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
        <SubmitPouchModalContent
          containerProps={containerProps}
          width={CONTENT_WIDTHS[contentSize]}
          content={content}
          contentProps={contentProps}
          title={title}
          titleProps={titleProps}
          buttonGroupProps={buttonGroupProps}
          primaryButtonProps={primaryButtonProps}
          secondaryButtonProps={secondaryButtonProps}
          otherButtonProps={otherButtonProps}
          icon={icon}
        />
      </Box>
    </Modal>
  );
};

export default SubmitPouchModal;
