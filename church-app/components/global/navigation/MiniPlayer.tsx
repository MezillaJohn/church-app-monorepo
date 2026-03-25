import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Pause, Play } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useAudio } from "@/context/AudioContext";
import { Text } from "@/components/global/typography/Text";
import { Thumbnail } from "@/components/global/media/Thumbnail";
import { Colors, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

export const MiniPlayer: React.FC = () => {
  const { currentSermon, isPlaying, togglePlay, position, duration } =
    useAudio();
  const router = useRouter();

  if (!currentSermon) return null;

  const attrs: any = currentSermon.attributes || currentSermon;
  const thumbnailUrl = attrs.thumbnail_url || attrs.thumbnailUrl;
  const progress = duration > 0 ? position / duration : 0;

  const handlePress = () => {
    router.push({
      pathname: "/stack/audioPlay",
      params: {
        id: (currentSermon as any).id || (currentSermon as any)._id,
        title: attrs.title,
        preacher: attrs.speaker,
        audioUrl: attrs.audio_file_url || attrs.audioFileUrl,
        thumbnail: thumbnailUrl,
        series:
          (currentSermon as any).relationships?.series?.attributes?.name ||
          attrs.seriesName ||
          "",
      },
    });
  };

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    togglePlay();
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.content}>
        {thumbnailUrl && (
          <Thumbnail
            uri={thumbnailUrl}
            width={moderateSize(40)}
            height={moderateSize(40)}
            borderRadius={8}
          />
        )}
        <View style={styles.textContainer}>
          <Text variant="caption" numberOfLines={1}>
            {attrs.title}
          </Text>
          <Text variant="small" color="muted" numberOfLines={1}>
            {attrs.speaker}
          </Text>
        </View>
        <Pressable onPress={handleToggle} hitSlop={12} style={styles.playButton}>
          {isPlaying ? (
            <Pause
              size={moderateSize(18)}
              color={Colors.primary}
              fill={Colors.primary}
            />
          ) : (
            <Play
              size={moderateSize(18)}
              color={Colors.primary}
              fill={Colors.primary}
            />
          )}
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: whiteOpacity("0.06"),
    overflow: "hidden",
  },
  progressTrack: {
    height: 2,
    backgroundColor: whiteOpacity("0.06"),
  },
  progressFill: {
    height: 2,
    backgroundColor: Colors.primary,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateSize(12),
    paddingVertical: moderateSize(8),
    gap: moderateSize(10),
  },
  textContainer: {
    flex: 1,
    gap: 1,
  },
  playButton: {
    width: moderateSize(36),
    height: moderateSize(36),
    borderRadius: moderateSize(18),
    backgroundColor: "rgba(0,217,166,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
});
