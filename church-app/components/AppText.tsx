import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React from "react";
import { StyleSheet, Text, TextStyle, type TextProps } from "react-native";

export type AppTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  size?: keyof typeof $sizeStyles;
};

const $sizeStyles = {
  xxxl: { fontSize: 32, lineHeight: 38 } satisfies TextStyle,
  xxl: { fontSize: 28, lineHeight: 38 } satisfies TextStyle,
  xl: { fontSize: 24, lineHeight: 34 } satisfies TextStyle,
  lg: { fontSize: 20, lineHeight: 32 } satisfies TextStyle,
  md: { fontSize: 18, lineHeight: 26 } satisfies TextStyle,
  sm: { fontSize: 16, lineHeight: 24 } satisfies TextStyle,
  xm: { fontSize: 15, lineHeight: 21 } satisfies TextStyle,
  xs: { fontSize: 14, lineHeight: 21 } satisfies TextStyle,
  xxs: { fontSize: 12, lineHeight: 18 } satisfies TextStyle,
  xss: { fontSize: 13.33, lineHeight: 20 } satisfies TextStyle, // Added for 13.33 font size
};

export function AppText({
  style,
  lightColor,
  darkColor,
  type = "default",
  size = "sm",
  ...rest
}: AppTextProps) {
  return (
    <Text
      allowFontScaling={false}
      style={[
        {
          color: Colors.white,
          lineHeight: moderateSize(22),
        },
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.Regular,
  },
  defaultSemiBold: {
    fontFamily: Fonts.Medium,
  },
  title: {
    fontFamily: Fonts.Bold,
  },
  subtitle: {
    fontFamily: Fonts.Regular,
    color: Colors.deemedWhite,
  },
  link: {
    color: Colors.info,
    fontFamily: Fonts.Medium,
    textDecorationLine: "underline",
  },
});
