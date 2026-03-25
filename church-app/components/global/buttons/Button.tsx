import React, { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Text } from "@/components/global/typography/Text";
import { Colors, Gradients, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

type ButtonVariant = "gradient" | "outline" | "ghost" | "icon";

interface ButtonProps {
  title?: string;
  variant?: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  gradientColors?: readonly string[];
  style?: StyleProp<ViewStyle>;
  haptic?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "gradient",
  onPress,
  disabled = false,
  loading = false,
  icon,
  gradientColors = Gradients.primary,
  style,
  haptic = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  if (variant === "icon") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.iconButton,
          pressed && { opacity: 0.7 },
          isDisabled && { opacity: 0.5 },
          style,
        ]}
      >
        {icon}
      </Pressable>
    );
  }

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }], opacity: isDisabled ? 0.5 : 1 },
        variant === "gradient" && styles.gradientShadow,
        style,
      ]}
    >
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        {variant === "gradient" ? (
          <LinearGradient
            colors={gradientColors as string[]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientInner}
          >
            {loading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <View style={styles.row}>
                {icon}
                {title && (
                  <Text
                    variant="bodyMedium"
                    style={{ color: Colors.background, fontWeight: "600" }}
                  >
                    {title}
                  </Text>
                )}
              </View>
            )}
          </LinearGradient>
        ) : variant === "outline" ? (
          <View style={styles.outlineInner}>
            {loading ? (
              <ActivityIndicator color={Colors.text} />
            ) : (
              <View style={styles.row}>
                {icon}
                {title && <Text variant="bodyMedium">{title}</Text>}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.ghostInner}>
            {loading ? (
              <ActivityIndicator color={Colors.textMuted} />
            ) : (
              <View style={styles.row}>
                {icon}
                {title && (
                  <Text variant="bodyMedium" color="muted">
                    {title}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    height: moderateSize(48),
    borderRadius: 14,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  gradientInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderCurve: "continuous",
  },
  outlineInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 14,
    borderCurve: "continuous",
  },
  ghostInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: whiteOpacity("0.04"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.08"),
    borderRadius: 14,
    borderCurve: "continuous",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: moderateSize(40),
    height: moderateSize(40),
    borderRadius: moderateSize(20),
    backgroundColor: whiteOpacity("0.06"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.08"),
    alignItems: "center",
    justifyContent: "center",
  },
  gradientShadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    borderRadius: 14,
  },
});
