import "react-native";
declare module "react-native" {
  interface TextInputProps {
    virtualKeyboardPolicy?: "manual" | "auto";
  }
}
