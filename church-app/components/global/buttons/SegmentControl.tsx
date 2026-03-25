import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Text } from "@/components/global/typography/Text";
import { Colors, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface SegmentControlProps {
  segments: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export const SegmentControl: React.FC<SegmentControlProps> = ({
  segments,
  activeIndex,
  onChange,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const segmentWidth = 100 / segments.length;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeIndex,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  }, [activeIndex]);

  const handlePress = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(index);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.indicator,
          {
            width: `${segmentWidth}%` as any,
            transform: [
              {
                translateX: translateX.interpolate({
                  inputRange: segments.map((_, i) => i),
                  outputRange: segments.map(
                    (_, i) => (i * moderateSize(340)) / segments.length
                  ),
                }),
              },
            ],
          },
        ]}
      />
      {segments.map((segment, index) => (
        <Pressable
          key={segment}
          onPress={() => handlePress(index)}
          style={styles.segment}
        >
          <Text
            variant="caption"
            color={activeIndex === index ? "primary" : "muted"}
            style={activeIndex === index ? { color: Colors.primary } : undefined}
          >
            {segment}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: whiteOpacity("0.04"),
    borderRadius: 12,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: whiteOpacity("0.06"),
    padding: 3,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: 3,
    bottom: 3,
    left: 3,
    backgroundColor: whiteOpacity("0.08"),
    borderRadius: 10,
    borderCurve: "continuous",
  },
  segment: {
    flex: 1,
    paddingVertical: moderateSize(8),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});
