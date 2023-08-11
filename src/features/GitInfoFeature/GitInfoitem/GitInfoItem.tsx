import { HorizontalRule } from "@ct/components";
import { Text } from "native-base";

interface GitInfoItemProps {
  label: string;
  value: string;
}

export const GitInfoItem = ({ label, value }: GitInfoItemProps) => {
  return (
    <>
      <Text mb="12px" fontSize={21} variant="medium-bold">
        {label}
      </Text>
      <Text fontSize={21}>{value}</Text>

      <HorizontalRule />
    </>
  );
};
