import { Colors, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface AppCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  bordered?: boolean;
}

const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  backgroundColor = Colors.textInputGrey,
  bordered = true,
}) => {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor },
        bordered && styles.bordered,
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default AppCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateSize(16),
    borderCurve: "continuous",
    overflow: "hidden",
  },
  bordered: {
    borderWidth: 1,
    borderColor: whiteOpacity("0.06"),
  },
});
