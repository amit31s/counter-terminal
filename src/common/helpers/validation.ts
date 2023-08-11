import { MessagePrompt } from "postoffice-peripheral-management-service";

export const multipleOf = (value: number, of: number): boolean => {
  return Math.round(value / of) / (1 / of) === value;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isMessagePrompt(value: unknown): value is MessagePrompt {
  return (
    isRecord(value) &&
    "id" in value &&
    typeof value.id === "string" &&
    "description" in value &&
    typeof value.description === "string"
  );
}
