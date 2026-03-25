import React, { useEffect } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const SkeletonPlaceholder = ({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width?: number | `${number}%` | "100%";
  height: number | `${number}%` | "100%";
  borderRadius?: number;
  style?: ViewStyle;
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        style,
        { width, height, borderRadius },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#4b4b4bff",
  },
});

export default SkeletonPlaceholder;
