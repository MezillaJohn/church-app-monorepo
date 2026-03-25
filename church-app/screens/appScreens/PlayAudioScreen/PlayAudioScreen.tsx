import { setAudioModeAsync } from "expo-audio";
import { useLocalSearchParams } from "expo-router";
import {
  Check,
  Download,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Share2,
} from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import AppBackHeader from "@/components/AppBackHeader";
import AppImage from "@/components/AppImage";
import { AppText } from "@/components/AppText";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { useDownload } from "@/hooks/useDownload";
import { useShare } from "@/hooks/useShare";
import AudioSeries from "@/screens/appScreens/PlayAudioScreen/component/AudioSeries";
import { useGetSermonByIdQuery } from "@/services/api/sermon";
import type { Sermon } from "@/services/api/sermon/type";
import { moderateSize, Size } from "@/utils/useResponsiveStyle";
import { useAudio } from "@/context/AudioContext";
import { LinearGradient } from "expo-linear-gradient";

interface AudioPlayParams {
  id?: string;
  title?: string;
  preacher?: string;
  audioUrl?: string;
  thumbnail?: string;
  series?: string;
}

const PlayAudioScreen = () => {
  const params = useLocalSearchParams<AudioPlayParams>();

  const [activeParams, setActiveParams] = useState<AudioPlayParams>(params);

  useEffect(() => {
    setActiveParams(params);
  }, [params.id]);

  const handleSelectSermon = (newParams: AudioPlayParams) => {
    setActiveParams(newParams);
  };

  const isDeepLink = activeParams.id && !activeParams.audioUrl;
  const { data: sermonData, isLoading: isFetchingSermon } =
    useGetSermonByIdQuery(activeParams.id!, { skip: !isDeepLink });

  const rawSermon = sermonData?.data;

  // Build a Sermon object from either the API response or route params
  const sermon = useMemo((): Sermon | null => {
    if (rawSermon && rawSermon._id === activeParams.id) {
      return rawSermon;
    }
    if (!activeParams.id) return null;
    // Fallback: build from route params
    return {
      _id: activeParams.id,
      title: activeParams.title || "",
      speaker: activeParams.preacher || "",
      audioFileUrl: activeParams.audioUrl || undefined,
      thumbnailUrl: activeParams.thumbnail || undefined,
      duration: 0,
      description: "",
      type: "audio",
      date: "",
      views: 0,
      favoritesCount: 0,
      isFeatured: false,
      isPublished: true,
      createdAt: "",
      updatedAt: "",
    } satisfies Sermon;
  }, [rawSermon, activeParams]);

  const {
    isDownloaded,
    isDownloading,
    progress: downloadProgress,
    startDownload,
    downloadedInfo,
  } = useDownload(sermon!);

  const { share } = useShare();

  const handleShare = () => {
    const audioShareUrl = `https://wholeword.app/app/audio/${activeParams.id || sermonId}`;
    share({
      message: `${title}\n\n${audioShareUrl}`,
      title: "Share Audio",
    });
  };

  const {
    playSermon,
    togglePlay,
    seekTo,
    isPlaying,
    duration,
    position,
    player,
    currentSermon,
  } = useAudio();

  const title = activeParams.title || sermon?.title;
  const preacher = activeParams.preacher || sermon?.speaker;
  const remoteAudioUrl = activeParams.audioUrl || sermon?.audioFileUrl;
  const sermonId = sermon?._id ?? activeParams.id;
  const isDownloadForCurrentSermon =
    isDownloaded && downloadedInfo?.sermon_id === sermonId;
  const audioUrl =
    isDownloadForCurrentSermon && downloadedInfo?.local_audio_uri
      ? downloadedInfo.local_audio_uri
      : remoteAudioUrl;
  const thumbnail = activeParams.thumbnail || sermon?.thumbnailUrl;
  const seriesName =
    activeParams.series ||
    (typeof sermon?.seriesId === "object" ? sermon.seriesId?.name : "") ||
    "";

  const lastPlayedIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    const isSameSermon = currentSermon?._id === activeParams.id;
    if (
      remoteAudioUrl &&
      sermon &&
      !isSameSermon &&
      lastPlayedIdRef.current !== activeParams.id
    ) {
      lastPlayedIdRef.current = activeParams.id!;
      const urlToPlay =
        isDownloadForCurrentSermon && downloadedInfo?.local_audio_uri
          ? downloadedInfo.local_audio_uri
          : remoteAudioUrl;
      playSermon(sermon, urlToPlay);
    }
  }, [remoteAudioUrl, sermon, activeParams.id, isDownloadForCurrentSermon]);

  const [progress, setProgress] = useState(0);
  const [formattedCurrentTime, setFormattedCurrentTime] = useState("0:00");
  const [formattedDuration, setFormattedDuration] = useState("0:00");

  const progressRef = useRef<View>(null);
  const [barWidth, setBarWidth] = useState(0);

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const configureAudioMode = async () => {
      try {
        await setAudioModeAsync({
          shouldPlayInBackground: true,
          playsInSilentMode: true,
          interruptionMode: "doNotMix",
        });
      } catch (error) {
        console.error("Failed to set audio mode:", error);
      }
    };
    configureAudioMode();
  }, []);

  useEffect(() => {
    if (duration > 0) {
      setProgress(position / duration);
      setFormattedCurrentTime(formatTime(position));
      setFormattedDuration(formatTime(duration));
    }
  }, [position, duration]);

  const handlePlayPause = () => togglePlay();

  const handleSeek = (e: { nativeEvent: { locationX: number } }) => {
    if (barWidth > 0) {
      const touchX = e.nativeEvent.locationX;
      if (touchX >= 0 && touchX <= barWidth) {
        const newProgress = touchX / barWidth;
        const newPosition = newProgress * duration;
        seekTo(newPosition);
      }
    }
  };

  const seekForward10 = () => seekTo(Math.min(position + 10, duration));
  const seekBackward10 = () => seekTo(Math.max(position - 10, 0));

  /* ── Animated play button scale ── */
  const playScale = useRef(new Animated.Value(1)).current;
  const onPlayPressIn = () => {
    Animated.spring(playScale, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 30,
    }).start();
  };
  const onPlayPressOut = () => {
    Animated.spring(playScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  if (isFetchingSermon) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Full-bleed Artwork ── */}
        <View style={styles.artworkContainer}>
          <AppImage
            source={
              thumbnail
                ? { uri: thumbnail }
                : require("@/assets/images/IMG_7715.jpg")
            }
            style={styles.artwork}
            contentFit="cover"
          />
          {/* Gradient fade at bottom */}
          <LinearGradient
            colors={["transparent", Colors.dark]}
            style={styles.artworkGradient}
          />
          {/* Back button overlay */}
          <View style={styles.backOverlay}>
            <AppBackHeader style={{ marginBottom: 0 }} text="" />
          </View>
        </View>

        {/* ── Title + Speaker ── */}
        <View style={styles.infoContainer}>
          <AppText style={styles.title}>{title || "Untitled Sermon"}</AppText>
          <AppText style={styles.speaker}>
            {preacher || "Unknown Speaker"}
          </AppText>
        </View>

        {/* ── Progress bar ── */}
        <View style={styles.progressSection}>
          <View
            style={styles.progressTrack}
            ref={progressRef}
            onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
            onTouchStart={handleSeek}
            onTouchMove={handleSeek}
          >
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
            {/* Knob */}
            <View
              style={[
                styles.progressKnob,
                { left: `${progress * 100}%` },
              ]}
            />
          </View>
          <View style={styles.timeRow}>
            <AppText style={styles.timeText}>{formattedCurrentTime}</AppText>
            <AppText style={styles.timeText}>{formattedDuration}</AppText>
          </View>
        </View>

        {/* ── Controls ── */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.seekButton} onPress={seekBackward10}>
            <RotateCcw size={24} color={Colors.white} />
            <AppText style={styles.seekText}>10s</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePlayPause}
            onPressIn={onPlayPressIn}
            onPressOut={onPlayPressOut}
            activeOpacity={1}
          >
            <Animated.View
              style={[
                styles.playButton,
                { transform: [{ scale: playScale }] },
              ]}
            >
              {isPlaying ? (
                <Pause size={28} color={Colors.dark} fill={Colors.dark} />
              ) : (
                <Play size={28} color={Colors.dark} fill={Colors.dark} />
              )}
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.seekButton} onPress={seekForward10}>
            <RotateCw size={24} color={Colors.white} />
            <AppText style={styles.seekText}>10s</AppText>
          </TouchableOpacity>
        </View>

        {/* ── Action Row ── */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              !isDownloaded && !isDownloading && startDownload()
            }
            disabled={isDownloaded}
          >
            {isDownloaded ? (
              <View style={styles.actionIcon}>
                <Check size={20} color={Colors.success} />
              </View>
            ) : isDownloading ? (
              <View style={styles.actionIcon}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : (
              <View style={styles.actionIcon}>
                <Download size={20} color={Colors.white} />
              </View>
            )}
            <AppText style={styles.actionLabel}>
              {isDownloaded
                ? "Saved"
                : isDownloading
                  ? `${Math.round(downloadProgress * 100)}%`
                  : "Download"}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <View style={styles.actionIcon}>
              <Share2 size={20} color={Colors.white} />
            </View>
            <AppText style={styles.actionLabel}>Share</AppText>
          </TouchableOpacity>
        </View>

        {/* ── Up Next ── */}
        <View style={styles.upNextSection}>
          <AudioSeries series={seriesName} onSelect={handleSelectSermon} />
        </View>
      </ScrollView>
    </View>
  );
};

export default PlayAudioScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  scrollContent: {
    paddingBottom: moderateSize(40),
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── Full-bleed Artwork ── */
  artworkContainer: {
    width: "100%",
    height: moderateSize(340),
    position: "relative",
  },
  artwork: {
    width: "100%",
    height: "100%",
  },
  artworkGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  backOverlay: {
    position: "absolute",
    top: moderateSize(40),
    left: moderateSize(16),
    zIndex: 10,
  },

  /* ── Info ── */
  infoContainer: {
    paddingHorizontal: moderateSize(20),
    marginTop: moderateSize(-20),
    marginBottom: moderateSize(20),
  },
  title: {
    fontSize: moderateSize(18),
    fontFamily: Fonts.Bold,
    color: Colors.white,
    textTransform: "capitalize",
    marginBottom: 4,
  },
  speaker: {
    color: Colors.muted,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(13),
  },

  /* ── Progress ── */
  progressSection: {
    paddingHorizontal: moderateSize(20),
    marginBottom: moderateSize(16),
  },
  progressTrack: {
    height: moderateSize(6),
    backgroundColor: whiteOpacity("0.15"),
    borderRadius: 4,
    overflow: "visible",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressKnob: {
    position: "absolute",
    top: -4,
    marginLeft: -7,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeText: {
    color: Colors.muted,
    fontSize: moderateSize(11),
    fontFamily: Fonts.Medium,
    fontVariant: ["tabular-nums"],
  },

  /* ── Controls ── */
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateSize(30),
    marginBottom: moderateSize(24),
  },
  playButton: {
    width: moderateSize(64),
    height: moderateSize(64),
    borderRadius: moderateSize(32),
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  seekButton: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  seekText: {
    color: Colors.muted,
    fontSize: moderateSize(10),
    fontFamily: Fonts.Medium,
  },

  /* ── Actions ── */
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: moderateSize(32),
    marginBottom: moderateSize(20),
  },
  actionButton: {
    alignItems: "center",
    gap: moderateSize(6),
  },
  actionIcon: {
    width: moderateSize(44),
    height: moderateSize(44),
    borderRadius: moderateSize(22),
    backgroundColor: whiteOpacity("0.08"),
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    color: Colors.muted,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(11),
  },

  /* ── Up Next ── */
  upNextSection: {
    paddingHorizontal: moderateSize(20),
  },
});
