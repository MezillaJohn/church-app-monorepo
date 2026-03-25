import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import AppImage from "@/components/AppImage";
import { Text } from "@/components/global/typography/Text";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: number;
  showRing?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = "User",
  imageUrl,
  size = moderateSize(80),
  showRing = true,
  style,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const ringSize = size + 8;
  const uri =
    imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D0D12&color=ffffff&size=${size * 2}`;

  return (
    <View
      style={[
        showRing && {
          width: ringSize,
          height: ringSize,
          borderRadius: ringSize / 2,
          borderWidth: 3,
          borderColor: Colors.primary,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.background,
        },
        style,
      ]}
    >
      <AppImage
        source={{ uri }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    </View>
  );
};
