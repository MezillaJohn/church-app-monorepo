import React from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AppImage from "@/components/AppImage";
import { Text } from "@/components/global/typography/Text";
import { Badge } from "@/components/global/media/Badge";
import { Colors, Gradients } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface MediaCardProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: "primary" | "success" | "live";
  width?: number;
  height?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  imageUrl,
  title,
  subtitle,
  badge,
  badgeVariant = "primary",
  width = moderateSize(220),
  height = moderateSize(140),
  onPress,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { width },
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      <View style={[styles.imageWrapper, { height }]}>
        <AppImage
          source={{ uri: imageUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <LinearGradient
          colors={Gradients.overlay as unknown as string[]}
          style={StyleSheet.absoluteFill}
        />
        {badge && (
          <View style={styles.badgePosition}>
            <Badge label={badge} variant={badgeVariant} />
          </View>
        )}
      </View>
      <View style={styles.textContainer}>
        <Text variant="heading3" numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" color="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: Colors.surface,
  },
  imageWrapper: {
    position: "relative",
    overflow: "hidden",
  },
  badgePosition: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  textContainer: {
    padding: 12,
    gap: 2,
  },
});
