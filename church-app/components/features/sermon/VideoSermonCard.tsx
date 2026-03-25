import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Play, User } from "lucide-react-native";
import AppImage from "@/components/AppImage";
import { Text } from "@/components/global";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { calDuration } from "@/utils/calDuration";

interface VideoSermonCardProps {
  title: string;
  description?: string;
  speaker: string;
  duration?: number;
  thumbnailUrl?: string;
  onPress?: () => void;
  style?: object;
}

export const VideoSermonCard: React.FC<VideoSermonCardProps> = ({
  title,
  description,
  speaker,
  duration,
  thumbnailUrl,
  onPress,
  style,
}) => {
  const durationText = duration ? calDuration(duration) : "";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {/* Thumbnail */}
      <View style={styles.thumbWrap}>
        <AppImage
          source={{ uri: thumbnailUrl }}
          style={styles.thumb}
          contentFit="cover"
        />
        {/* Play circle overlay */}
        <View style={styles.playOverlay}>
          <View style={styles.playCircle}>
            <Play size={14} color={Colors.white} fill={Colors.white} />
          </View>
        </View>
        {/* Duration pill */}
        {durationText ? (
          <View style={styles.durationPill}>
            <Text variant="small" color="white">
              {durationText}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text variant="heading3" numberOfLines={1}>
          {title}
        </Text>
        {description ? (
          <Text variant="caption" color="muted" numberOfLines={2}>
            {description}
          </Text>
        ) : null}
        <View style={styles.speakerRow}>
          <User size={11} color={Colors.textMuted} />
          <Text variant="small" color="muted">
            {speaker}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: moderateSize(220),
    borderRadius: 16,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: Colors.surface,
  },
  thumbWrap: {
    width: "100%",
    height: moderateSize(120),
    position: "relative",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  playCircle: {
    width: moderateSize(36),
    height: moderateSize(36),
    borderRadius: moderateSize(18),
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  durationPill: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  info: {
    padding: moderateSize(10),
    gap: 3,
  },
  speakerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
});
