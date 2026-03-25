import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Play } from "lucide-react-native";
import { Text, Thumbnail, Badge } from "@/components/global";
import { Colors, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface SermonCardProps {
  title: string;
  speaker: string;
  thumbnailUrl?: string;
  duration?: string;
  type: "audio" | "video";
  isFeatured?: boolean;
  onPress?: () => void;
}

export const SermonCard: React.FC<SermonCardProps> = ({
  title,
  speaker,
  thumbnailUrl,
  duration,
  type,
  isFeatured,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Thumbnail
        uri={thumbnailUrl || ""}
        width={moderateSize(70)}
        height={moderateSize(70)}
        borderRadius={12}
        overlay
      >
        <View style={styles.playOverlay}>
          <Play size={18} color={Colors.text} fill={Colors.text} />
        </View>
      </Thumbnail>
      <View style={styles.info}>
        <Text variant="heading3" numberOfLines={2}>
          {title}
        </Text>
        <Text variant="caption" color="muted" numberOfLines={1}>
          {speaker}
        </Text>
        <View style={styles.metaRow}>
          {duration && (
            <Text variant="small" color="muted">
              {duration}
            </Text>
          )}
          {isFeatured && <Badge label="Featured" variant="primary" />}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: moderateSize(12),
    paddingVertical: moderateSize(10),
    paddingHorizontal: moderateSize(4),
    borderBottomWidth: 1,
    borderBottomColor: whiteOpacity("0.04"),
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 2,
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
});
