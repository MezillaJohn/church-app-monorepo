import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "@/components/global/typography/Text";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  action,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text variant="heading3" style={styles.title}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="body" color="muted" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateSize(48),
    paddingHorizontal: moderateSize(32),
  },
  iconContainer: {
    marginBottom: moderateSize(16),
    opacity: 0.6,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 4,
  },
  action: {
    marginTop: moderateSize(20),
  },
});
