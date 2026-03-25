import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "@/components/global/typography/Text";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

type BadgeVariant = "primary" | "success" | "live" | "accent" | "warning" | "error";

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  primary: {
    bg: "rgba(0,217,166,0.12)",
    text: Colors.primary,
    border: "rgba(0,217,166,0.20)",
  },
  success: {
    bg: "rgba(52,211,153,0.12)",
    text: Colors.success,
    border: "rgba(52,211,153,0.20)",
  },
  live: {
    bg: "rgba(248,113,113,0.15)",
    text: Colors.error,
    border: "rgba(248,113,113,0.25)",
  },
  accent: {
    bg: "rgba(167,139,250,0.12)",
    text: Colors.accent2,
    border: "rgba(167,139,250,0.20)",
  },
  warning: {
    bg: "rgba(251,191,36,0.12)",
    text: Colors.warning,
    border: "rgba(251,191,36,0.20)",
  },
  error: {
    bg: "rgba(248,113,113,0.12)",
    text: Colors.error,
    border: "rgba(248,113,113,0.20)",
  },
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  style,
}) => {
  const vs = variantStyles[variant];
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (variant === "live") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [variant]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: vs.bg,
          borderColor: vs.border,
        },
        style,
      ]}
    >
      {variant === "live" && (
        <Animated.View
          style={[styles.dot, { backgroundColor: vs.text, opacity: pulseAnim }]}
        />
      )}
      <Text variant="overline" style={{ color: vs.text, fontSize: moderateSize(9) }}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateSize(3),
    paddingHorizontal: moderateSize(8),
    borderRadius: 20,
    borderCurve: "continuous",
    borderWidth: 1,
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
