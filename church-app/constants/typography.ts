import { TextStyle } from "react-native";
import { Fonts } from "./theme";

export const Typography = {
  display: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: Fonts.Bold,
    letterSpacing: -0.5,
  } satisfies TextStyle,

  heading1: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: Fonts.Bold,
    letterSpacing: -0.3,
  } satisfies TextStyle,

  heading2: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: Fonts.SemiBold,
    letterSpacing: -0.2,
  } satisfies TextStyle,

  heading3: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: Fonts.SemiBold,
    letterSpacing: -0.1,
  } satisfies TextStyle,

  body: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Fonts.Regular,
  } satisfies TextStyle,

  bodyMedium: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Fonts.Medium,
  } satisfies TextStyle,

  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: Fonts.Medium,
  } satisfies TextStyle,

  small: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: Fonts.Medium,
  } satisfies TextStyle,

  overline: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: Fonts.SemiBold,
    letterSpacing: 1,
    textTransform: "uppercase",
  } satisfies TextStyle,
} as const;

export type TypographyVariant = keyof typeof Typography;
