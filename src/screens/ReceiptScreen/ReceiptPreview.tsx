import { StyledExpandLessOutlinedIcon, StyledExpandMoreOutlinedIcon } from "@ct/assets/icons";
import { PrintedReceipt } from "@ct/common/state/ReceiptScreen/printedReceipts.slice";
import { StyledButton } from "@ct/components";
import { COLOR_CONSTANTS, stringConstants } from "@ct/constants";
import { compileReceipt } from "@ct/utils/Services/ReceiptService";
import styled from "@emotion/styled";
import { Box, Text } from "native-base";
import {
  ReactEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { StyleSheet } from "react-native";

const buttonStyles = StyleSheet.create({
  base: {
    paddingHorizontal: 0,
    width: 46,
    height: 46,
    minHeight: 46,
  },
  mb: {
    marginBottom: 8,
  },
});

const startStyle = [buttonStyles.base, buttonStyles.mb];

export type ReceiptPreviewProps = {
  selectedReceipt: PrintedReceipt | null;
};

const StyledIframe = styled.iframe<{ webViewHeight: number }>`
  height: 100%;
  border: none;
  padding: 24px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: auto;
  height: ${(props) => props.webViewHeight}px;
`;

const ReceiptScrollingContainer = styled.div`
  overflow-y: scroll;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const TextReceiptPre = styled.pre`
  font-family: "Courier New", Courier, monospace;
  font-size: 12px;
  color: black;
  user-select: none;
  margin: auto;
  width: 42ch;
  padding: 24px 0;
`;

const ReceiptPreview = ({ selectedReceipt }: ReceiptPreviewProps) => {
  const [webViewHeight, setWebViewHeight] = useState(0);
  const [compiledReceipt, setCompiledReceipt] = useState<string | null>(null);
  const [isScrollDownDisabled, setIsScrollDownDisabled] = useState(false);
  const [isScrollUpDisabled, setIsScrollUpDisabled] = useState(false);

  const scrollViewRef = useRef<HTMLDivElement | null>(null);
  const previousReceipt = useRef<ReceiptPreviewProps["selectedReceipt"]>(null);

  useEffect(() => {
    if (previousReceipt.current === selectedReceipt) {
      return;
    }

    if (!selectedReceipt) {
      setCompiledReceipt(null);
      return;
    }

    const aborter = new AbortController();
    (async () => {
      const newReceipt = await compileReceipt(selectedReceipt.templateId, {
        ...selectedReceipt.context,
        isDuplicate: true,
        dateOfIssue: Date.now() / 1000,
      });
      if (!aborter.signal.aborted) {
        setCompiledReceipt(newReceipt);
        scrollViewRef.current?.scrollTo(0, 0);
        previousReceipt.current = selectedReceipt;
      }
    })();
    return () => {
      aborter.abort();
    };
  }, [selectedReceipt]);

  const updateScrollDisabled = useCallback(() => {
    if (!scrollViewRef.current) {
      setIsScrollDownDisabled(true);
      setIsScrollUpDisabled(true);
      return;
    }
    setIsScrollDownDisabled(
      scrollViewRef.current.scrollTop + scrollViewRef.current.offsetHeight >=
        scrollViewRef.current.scrollHeight,
    );
    setIsScrollUpDisabled(scrollViewRef.current.scrollTop <= 0);
  }, []);

  const scrollDown = useCallback(() => {
    scrollViewRef.current?.scrollBy(0, scrollViewRef.current.offsetHeight / 2);
  }, []);

  const scrollUp = useCallback(() => {
    scrollViewRef.current?.scrollBy(0, -scrollViewRef.current.offsetHeight / 2);
  }, []);

  const handleIframeLoad: ReactEventHandler<HTMLIFrameElement> = useCallback((e) => {
    setWebViewHeight(e.currentTarget.contentWindow?.document.body.scrollHeight ?? 300);
  }, []);

  useLayoutEffect(updateScrollDisabled, [compiledReceipt, updateScrollDisabled]);

  return (
    <Box w="696px" bgColor="white" shadow={4} alignItems="stretch" justifyContent="center">
      <ReceiptScrollingContainer ref={scrollViewRef} onScroll={updateScrollDisabled}>
        {compiledReceipt === null ? (
          <Box flex={1} alignItems="center" justifyContent="center">
            <Text variant="medium-bold" color={COLOR_CONSTANTS.text.disabled}>
              Preview not available
            </Text>
          </Box>
        ) : selectedReceipt?.context?.textMode ? (
          <TextReceiptPre>{compiledReceipt}</TextReceiptPre>
        ) : (
          <StyledIframe
            data-testid={stringConstants.ReceiptList.webViewTestID}
            srcDoc={compiledReceipt}
            onLoad={handleIframeLoad}
            webViewHeight={webViewHeight}
          />
        )}
      </ReceiptScrollingContainer>

      {compiledReceipt === null ? null : (
        <Box position="absolute" right="24px" bottom="24px">
          <StyledButton
            testID={stringConstants.ReceiptList.scrollUpTestID}
            type="secondary"
            size="slim"
            styles={startStyle}
            isDisabled={isScrollUpDisabled}
            onPress={scrollUp}
            label="Scroll Up"
          >
            <Box w="26px" h="26px">
              <StyledExpandLessOutlinedIcon />
            </Box>
          </StyledButton>
          <StyledButton
            testID={stringConstants.ReceiptList.scrollDownTestID}
            type="secondary"
            size="slim"
            styles={buttonStyles.base}
            isDisabled={isScrollDownDisabled}
            onPress={scrollDown}
            label="Scroll Down"
          >
            <Box w="26px" h="26px">
              <StyledExpandMoreOutlinedIcon />
            </Box>
          </StyledButton>
        </Box>
      )}
    </Box>
  );
};

export default ReceiptPreview;
