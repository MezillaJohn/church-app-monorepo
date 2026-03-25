import React from "react";
import { Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { Glass } from "@/constants/theme";

interface GlassCardProps {
  children: React.ReactNode;
  elevated?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  elevated = false,
  onPress,
  style,
  contentStyle,
}) => {
  const glassStyle = elevated ? Glass.elevated : Glass.base;
  const Wrapper = onPress ? Pressable : View;

  const content = (
    <View style={[glassStyle, styles.container, style]}>
      {Platform.OS === "ios" && (
        <BlurView
          intensity={20}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && { opacity: 0.85 }]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  content: {
    padding: 16,
    zIndex: 1,
  },
});
