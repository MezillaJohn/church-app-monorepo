import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Clock, Heart, Pause, Play } from "lucide-react-native";
import AppImage from "@/components/AppImage";
import { Text } from "@/components/global";
import { useAudio } from "@/context/AudioContext";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { calDuration } from "@/utils/calDuration";
import type { Sermon } from "@/services/api/sermon/type";

interface AudioSermonCardProps {
  title: string;
  speaker: string;
  duration?: number;
  thumbnailUrl?: string;
  audioUrl?: string;
  isFavorited?: boolean;
  /** The full sermon object — needed for AudioContext.playSermon */
  sermon?: Sermon;
  onPress?: () => void;
  onFavourite?: () => void;
  style?: object;
}

/* ─── Waveform Bars ─── */
const WaveformBars: React.FC<{ active: boolean }> = ({ active }) => {
  const bars = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(0.4))
  ).current;

  useEffect(() => {
    if (active) {
      const animations = bars.map((bar, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(bar, {
              toValue: 0.3 + Math.random() * 0.7,
              duration: 300 + i * 80,
              useNativeDriver: true,
            }),
            Animated.timing(bar, {
              toValue: 0.3,
              duration: 300 + i * 80,
              useNativeDriver: true,
            }),
          ])
        )
      );
      animations.forEach((a) => a.start());
      return () => animations.forEach((a) => a.stop());
    } else {
      bars.forEach((bar) => {
        Animated.timing(bar, {
          toValue: 0.4,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [active]);

  return (
    <View style={styles.waveformWrap}>
      {bars.map((bar, i) => (
        <Animated.View
          key={i}
          style={[
            styles.waveBar,
            {
              transform: [{ scaleY: bar }],
              backgroundColor: active ? Colors.primary : Colors.textMuted,
            },
          ]}
        />
      ))}
    </View>
  );
};

/* ─── Audio Sermon Card ─── */
export const AudioSermonCard: React.FC<AudioSermonCardProps> = ({
  title,
  speaker,
  duration,
  thumbnailUrl,
  audioUrl,
  isFavorited,
  sermon,
  onPress,
  onFavourite,
  style,
}) => {
  const { currentSermon, isPlaying, togglePlay, playSermon } = useAudio();

  const sermonId = sermon?._id;
  const isThisPlaying =
    currentSermon && currentSermon._id === sermonId;
  const isActive = isThisPlaying && isPlaying;

  const handlePlayPause = () => {
    if (isThisPlaying) {
      togglePlay();
    } else if (audioUrl && sermon) {
      playSermon(sermon, audioUrl);
    }
  };

  const durationText = duration ? calDuration(duration) : "";

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        isActive && styles.cardActive,
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
      </View>

      {/* Play/Pause Button */}
      <Pressable onPress={handlePlayPause} style={styles.playBtn}>
        {isActive ? (
          <Pause size={14} color={Colors.dark} fill={Colors.dark} />
        ) : (
          <Play size={14} color={Colors.dark} fill={Colors.dark} />
        )}
      </Pressable>

      {/* Center: Title + Meta */}
      <View style={styles.center}>
        <Text variant="bodyMedium" numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          <Text variant="small" color="muted" numberOfLines={1} style={{ flexShrink: 1 }}>
            {speaker}
          </Text>
          {durationText ? (
            <>
              <View style={styles.dot} />
              <Clock size={10} color={Colors.textMuted} />
              <Text variant="small" color="muted">
                {durationText}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      {/* Waveform */}
      <WaveformBars active={!!isActive} />

      {/* Favourite */}
      {onFavourite && (
        <Pressable onPress={onFavourite} hitSlop={8}>
          <Heart
            size={16}
            color={isFavorited ? Colors.primary : Colors.textMuted}
            fill={isFavorited ? Colors.primary : "transparent"}
          />
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderCurve: "continuous",
    padding: moderateSize(10),
    marginBottom: moderateSize(8),
    gap: moderateSize(10),
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardActive: {
    borderColor: "rgba(0,217,166,0.15)",
    backgroundColor: "rgba(0,217,166,0.06)",
  },
  thumbWrap: {
    width: moderateSize(44),
    height: moderateSize(44),
    borderRadius: 10,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  playBtn: {
    width: moderateSize(34),
    height: moderateSize(34),
    borderRadius: moderateSize(17),
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    gap: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
  },
  waveformWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: moderateSize(24),
  },
  waveBar: {
    width: 3,
    height: "100%",
    borderRadius: 1.5,
  },
});
