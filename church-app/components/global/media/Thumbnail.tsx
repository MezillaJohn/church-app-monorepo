import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AppImage from "@/components/AppImage";
import { Colors, Gradients } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface ThumbnailProps {
  uri: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  overlay?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  uri,
  width = moderateSize(120),
  height = moderateSize(80),
  borderRadius = 12,
  overlay = false,
  children,
  style,
}) => {
  return (
    <View style={[{ width, height, borderRadius, overflow: "hidden" }, style]}>
      <AppImage
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      {overlay && (
        <LinearGradient
          colors={Gradients.overlay as unknown as string[]}
          style={StyleSheet.absoluteFill}
        />
      )}
      {children}
    </View>
  );
};
