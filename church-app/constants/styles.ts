import { spacing } from "@/constants/spacing";
import { whiteOpacity } from "@/constants/theme";
import { ViewStyle } from "react-native";

/* Use this file to define styles that are used in multiple places in your app. */
export const $styles = {
  row: { flexDirection: "row" } as ViewStyle,
  flex1: { flex: 1 } as ViewStyle,
  flexWrap: { flexWrap: "wrap" } as ViewStyle,

  containerStyle: {
    paddingHorizontal: 20,
    paddingTop: 30,
    flex: 1,
  } as ViewStyle,

  borderBottom: {
    borderBottomColor: whiteOpacity("0.1"),
    borderBottomWidth: 1,
    paddingBottom: 15,
  } as ViewStyle,

  flexCenterBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } as ViewStyle,

  flexCenter: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,

  container: {
    paddingTop: spacing.lg + spacing.xl,
    paddingHorizontal: spacing.lg,
  } as ViewStyle,

  toggleInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  } as ViewStyle,
};
