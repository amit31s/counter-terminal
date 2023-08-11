import styled from "@emotion/styled";
import { Text } from "native-base";
import { PropsWithChildren } from "react";

const SectionContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "rgb(243, 244, 246)",
  border: "1px solid rgb(229, 231, 235)",
  borderRadius: "6px",
  padding: "24px",
  alignItems: "center",
});

export type SectionProps = PropsWithChildren<{ title: string; testID: string }>;
export function Section({ title, testID, children }: SectionProps) {
  return (
    <SectionContainer data-testid={testID}>
      <Text variant="medium-bold" mb="16px" textTransform="capitalize">
        {title}
      </Text>
      {children}
    </SectionContainer>
  );
}
