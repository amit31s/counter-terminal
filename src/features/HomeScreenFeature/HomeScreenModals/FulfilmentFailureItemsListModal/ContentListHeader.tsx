import { Box, Flex, Text } from "native-base";

export const ContentListHeader = () => {
  const headerFontSize = 20;

  return (
    <Flex height={60} direction="row" bg="#E9EAEB" alignItems={"center"}>
      <Box flexBasis={"200%"} flexShrink={1} flexGrow={1}>
        <Text px={5} fontWeight={"semibold"} fontSize={headerFontSize}>
          Product
        </Text>
      </Box>

      <Box flexBasis={"100%"} flexShrink={1} flexGrow={1}>
        <Text px={5} fontWeight={"semibold"} fontSize={headerFontSize}>
          Status
        </Text>
      </Box>
      <Box flexBasis={"100%"} flexShrink={1} flexGrow={1} alignItems={"end"}>
        <Text fontWeight={"semibold"} fontSize={headerFontSize} mr={5}>
          Value
        </Text>
      </Box>
    </Flex>
  );
};
