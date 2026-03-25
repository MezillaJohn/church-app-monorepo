import React, { useRef } from "react";
import { Animated, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/global/typography/Text";
import { Colors, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  color: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  subtitle,
  color,
  onPress,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
        <View style={styles.card}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${color}15`,
                borderColor: `${color}25`,
              },
            ]}
          >
            {icon}
          </View>
          <Text variant="caption" style={{ marginTop: 8 }}>
            {title}
          </Text>
          {subtitle && (
            <Text variant="small" color="muted">
              {subtitle}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: whiteOpacity("0.04"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.07"),
    borderRadius: 16,
    borderCurve: "continuous",
    padding: moderateSize(14),
    alignItems: "center",
    justifyContent: "center",
    minHeight: moderateSize(100),
  },
  iconContainer: {
    width: moderateSize(44),
    height: moderateSize(44),
    borderRadius: moderateSize(22),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
