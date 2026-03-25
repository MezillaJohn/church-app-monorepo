import { AppText } from "@/components/AppText";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { useAudio } from "@/context/AudioContext";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { Link, useRouter } from "expo-router";
import { Calendar, Handshake, Heart, Tv } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, View } from "react-native";

const actions = [
  {
    id: "1",
    title: "Giving",
    icon: Heart,
    color: Colors.primary,
    bgColor: "rgba(0,217,166,0.1)",
    borderColor: "rgba(0,217,166,0.15)",
    route: "/(tabs)/giving",
  },
  {
    id: "2",
    title: "TV",
    icon: Tv,
    color: Colors.info,
    bgColor: "rgba(96,165,250,0.1)",
    borderColor: "rgba(96,165,250,0.15)",
    route: "/(tabs)/tv",
  },
  {
    id: "3",
    title: "Partner",
    icon: Handshake,
    color: Colors.purple,
    bgColor: "rgba(167,139,250,0.1)",
    borderColor: "rgba(167,139,250,0.15)",
    route: "/stack/partnership",
  },
  {
    id: "4",
    title: "Events",
    icon: Calendar,
    color: Colors.success,
    bgColor: "rgba(52,211,153,0.1)",
    borderColor: "rgba(52,211,153,0.15)",
    route: "/stack/events",
  },
];

const BAR_CONFIGS = [
  { minHeight: 3, maxHeight: 14, duration: 400 },
  { minHeight: 4, maxHeight: 18, duration: 500 },
  { minHeight: 3, maxHeight: 10, duration: 350 },
  { minHeight: 5, maxHeight: 16, duration: 450 },
];

const AudioBars = () => {
  const barAnims = useRef(
    BAR_CONFIGS.map((c) => new Animated.Value(c.minHeight))
  ).current;

  useEffect(() => {
    const animations = BAR_CONFIGS.map((config, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(barAnims[i], {
            toValue: config.maxHeight,
            duration: config.duration,
            useNativeDriver: false,
          }),
          Animated.timing(barAnims[i], {
            toValue: config.minHeight,
            duration: config.duration,
            useNativeDriver: false,
          }),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.barsContainer}>
      {barAnims.map((anim, i) => (
        <Animated.View key={i} style={[styles.bar, { height: anim }]} />
      ))}
    </View>
  );
};

const NowPlayingIndicator = () => {
  const { currentSermon } = useAudio();
  const router = useRouter();

  if (!currentSermon) return null;

  const attrs = currentSermon.attributes || currentSermon;

  return (
    <Pressable
      style={styles.nowPlayingRow}
      onPress={() =>
        router.push({
          pathname: "/stack/audioPlay",
          params: {
            id: currentSermon.id || currentSermon._id,
            title: attrs.title,
            preacher: attrs.speaker,
            audioUrl: attrs.audio_file_url || attrs.audioFileUrl,
            thumbnail: attrs.thumbnail_url || attrs.thumbnailUrl,
            series:
              currentSermon.relationships?.series?.attributes?.name ||
              attrs.seriesName ||
              "",
          },
        })
      }
    >
      <View style={styles.nowPlayingIcon}>
        <AudioBars />
      </View>
      <AppText style={styles.nowPlayingText} numberOfLines={1}>
        {attrs.title}
      </AppText>
    </Pressable>
  );
};

const ActionPill = ({ item }: { item: (typeof actions)[0] }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const Icon = item.icon;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Link href={item.route} asChild>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View
          style={[styles.pill, { transform: [{ scale: scaleAnim }] }]}
        >
          <View
            style={[
              styles.pillIcon,
              { backgroundColor: item.bgColor, borderColor: item.borderColor },
            ]}
          >
            <Icon size={moderateSize(16)} color={item.color} strokeWidth={1.8} />
          </View>
          <AppText style={styles.pillLabel}>{item.title}</AppText>
        </Animated.View>
      </Pressable>
    </Link>
  );
};

const CallToAction = () => {
  const { isPlaying, currentSermon } = useAudio();
  const showNowPlaying = isPlaying && !!currentSermon;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {actions.map((item) => (
          <ActionPill key={item.id} item={item} />
        ))}
      </ScrollView>

      {showNowPlaying && (
        <View style={styles.nowPlayingWrapper}>
          <NowPlayingIndicator />
        </View>
      )}
    </View>
  );
};

export default CallToAction;

const styles = StyleSheet.create({
  container: {
    marginTop: moderateSize(2),
  },
  scrollContent: {
    paddingHorizontal: moderateSize(20),
    gap: moderateSize(8),
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: whiteOpacity("0.04"),
    borderRadius: 40,
    borderWidth: 1,
    borderColor: whiteOpacity("0.07"),
    paddingVertical: moderateSize(8),
    paddingHorizontal: moderateSize(14),
    gap: moderateSize(8),
  },
  pillIcon: {
    width: moderateSize(32),
    height: moderateSize(32),
    borderRadius: moderateSize(16),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pillLabel: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateSize(12),
    color: Colors.white,
    letterSpacing: 0.1,
  },
  nowPlayingWrapper: {
    marginHorizontal: moderateSize(20),
  },
  nowPlayingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateSize(10),
    backgroundColor: "rgba(0,217,166,0.06)",
    borderRadius: 14,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "rgba(0,217,166,0.12)",
    paddingVertical: moderateSize(8),
    paddingHorizontal: moderateSize(12),
    gap: moderateSize(10),
  },
  nowPlayingIcon: {
    width: moderateSize(30),
    height: moderateSize(30),
    borderRadius: 15,
    backgroundColor: "rgba(0,217,166,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  nowPlayingText: {
    flex: 1,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
    color: Colors.white,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: 18,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});
