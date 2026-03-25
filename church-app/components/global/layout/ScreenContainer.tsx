import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen, ScreenProps } from "@/components/Screen";
import { Gradients } from "@/constants/theme";
import { spacing } from "@/constants/spacing";

interface ScreenContainerProps extends Omit<ScreenProps, "backgroundColor"> {
  gradient?: readonly string[];
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  gradient = Gradients.screen,
  padded = true,
  style,
  ...screenProps
}) => {
  return (
    <LinearGradient colors={gradient as string[]} style={{ flex: 1 }}>
      <Screen
        backgroundColor="transparent"
        safeAreaEdges={["top"]}
        {...screenProps}
        contentContainerStyle={[
          padded && { paddingHorizontal: spacing.lg },
          screenProps.contentContainerStyle,
          style,
        ]}
      >
        {children}
      </Screen>
    </LinearGradient>
  );
};
