import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "@/components/global/typography/Text";
import { whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = "#00D9A6",
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: `${color}15`, borderColor: `${color}25` },
          ]}
        >
          {icon}
        </View>
      )}
      <Text variant="heading2" style={{ color }}>
        {value}
      </Text>
      <Text variant="small" color="muted">
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteOpacity("0.04"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.06"),
    borderRadius: 16,
    borderCurve: "continuous",
    padding: moderateSize(12),
    alignItems: "center",
    gap: 4,
  },
  iconWrap: {
    width: moderateSize(32),
    height: moderateSize(32),
    borderRadius: moderateSize(16),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
});
