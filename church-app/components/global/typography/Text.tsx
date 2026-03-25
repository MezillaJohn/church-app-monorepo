import React from "react";
import { Text as RNText, TextProps as RNTextProps, TextStyle } from "react-native";
import { Typography, TypographyVariant } from "@/constants/typography";
import { Colors } from "@/constants/theme";

type TextColor = "primary" | "secondary" | "muted" | "disabled" | "error" | "success" | "accent";

const colorMap: Record<TextColor, string> = {
  primary: Colors.text,
  secondary: Colors.textSecondary,
  muted: Colors.textMuted,
  disabled: Colors.textDisabled,
  error: Colors.error,
  success: Colors.success,
  accent: Colors.primary,
};

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: TextColor;
}

export const Text: React.FC<TextProps> = ({
  variant = "body",
  color = "primary",
  style,
  ...rest
}) => {
  const variantStyle = Typography[variant];
  const resolvedColor = colorMap[color];

  return (
    <RNText
      allowFontScaling={false}
      style={[variantStyle as TextStyle, { color: resolvedColor }, style]}
      {...rest}
    />
  );
};
