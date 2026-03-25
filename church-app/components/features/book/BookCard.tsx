import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppImage from "@/components/AppImage";
import { Text, Badge } from "@/components/global";
import { Colors, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { Image } from "expo-image";

interface BookCardProps {
  title: string;
  author: string;
  coverImage?: string;
  price?: string;
  rating?: string;
  onPress?: () => void;
  style?: object;
}

export const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  coverImage,
  price,
  rating,
  onPress,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      <View style={styles.coverWrapper}>
        <Image
          source={{ uri: coverImage }}
          style={styles.cover}
          contentFit="cover"
        />
      </View>
      <View style={styles.info}>
        <Text variant="caption" numberOfLines={2}>
          {title}
        </Text>
        <Text variant="small" color="muted" numberOfLines={1}>
          {author}
        </Text>
        {price && (
          <Badge
            label={price === "0" || price === "0.00" ? "Free" : `₦${price}`}
            variant="success"
            style={{ alignSelf: "flex-start", marginTop: 4 }}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: moderateSize(130),
  },
  coverWrapper: {
    width: "100%",
    height: moderateSize(170),
    borderRadius: 12,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: Colors.surface,
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  info: {
    paddingTop: 8,
    gap: 2,
  },
});
