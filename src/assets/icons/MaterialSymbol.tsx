import styled from "@emotion/styled";
import { Property } from "csstype";

type IconSize = "small" | "medium" | "large";

const fontSetting = (size?: IconSize) => {
  switch(size){
    case "small": return "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24";
    case "large": return "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 60";
    default : return "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48";
  }
}

const Icon = styled.span((props: { iconColor?: Property.Color, size?: IconSize, rotate?: string }) => ({
  fontVariationSettings: fontSetting(props.size),
  display: "inline-block",
  userSelect: "none",
  height: props.size === "small"?`24px`: props.size === "large"? `60px`: `48px`,
  width: props.size === "small"?`24px`: props.size === "large"? `60px`: `48px`,
  fontSize: props.size === "small"?`24px`: props.size === "large"? `60px`: `48px`,
  color: props.iconColor ?? "white",
  transform: props.rotate? "rotate("+props.rotate+"deg)": "rotate(0deg)"
}));

export type MaterialSymbolProps = {
  name: string;
  size?: "small" | "medium" | "large";
  color?: Property.Color;
  rotate?: string,
};

export function MaterialSymbol({ name, size, color, rotate }: MaterialSymbolProps) {
  
  return (
    <Icon iconColor={color} size={size} rotate={rotate} className="material-symbols-outlined">
      {name}
    </Icon>
  );
}
