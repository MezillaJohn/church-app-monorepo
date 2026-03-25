import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { spacing } from "@/constants/spacing";

interface SectionContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gap?: number;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  style,
  gap = spacing.md,
}) => {
  return (
    <View style={[{ marginBottom: spacing.lg, gap }, style]}>{children}</View>
  );
};
