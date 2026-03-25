import AppBackHeader from "@/components/AppBackHeader";
import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { useShare } from "@/hooks/useShare";
import VideoSeries from "@/screens/appScreens/VideoDetailScreen/component/VideoSeries";
import { useGetSermonByIdQuery } from "@/services/api/sermon";
import { calDuration } from "@/utils/calDuration";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { Clock, Share, User } from "lucide-react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useFocusEffect } from "@react-navigation/native";
import { useAudio } from "@/context/AudioContext";
import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function VideoDetailsScreen() {
  const { share } = useShare();
  const { pause } = useAudio();

  useFocusEffect(
    useCallback(() => {
      pause();
    }, [pause])
  );

  const params = useLocalSearchParams<{
    videoUrl?: string;
    videoId?: string;
    id?: string;
    title?: string;
    preacher?: string;
    duration?: string;
    description?: string;
    series?: string;
  }>();

  const isDeepLink = params.videoId && !params.videoUrl;
  const { data: sermonData, isLoading: isFetchingSermon } =
    useGetSermonByIdQuery(params.videoId!, { skip: !isDeepLink });

  const sermon = sermonData?.data;
  const videoUrl = params.videoUrl || sermon?.attributes?.youtube_video_url;
  const id = params.id || String(sermon?.id);
  const title = params.title || sermon?.attributes?.title;
  const preacher = params.preacher || sermon?.attributes?.speaker;
  const duration =
    params.duration || String(sermon?.attributes?.duration ?? "0");
  const description = params.description || sermon?.attributes?.description;
  const series =
    params.series || sermon?.relationships?.series?.attributes?.name;

  const [playing, setPlaying] = useState(true);

  const getYouTubeId = (url?: string | null | undefined) => {
    if (!url) return sermon?.attributes?.youtube_video_id || "";
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : sermon?.attributes?.youtube_video_id || "";
  };

  const extractedId = getYouTubeId(videoUrl);

  const handleShare = () => {
    const shareUrl = `https://wholeword.app/app/video/${id}`;
    share({
      message: `${title}\n\n${shareUrl}`,
      title: "Share Video",
    });
  };

  if (isFetchingSermon) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.dark,
          alignItems: "center",
          justifyContent: "center",
        }}
        edges={["top"]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <StatusBar backgroundColor={Colors.dark} barStyle={"light-content"} />
      <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
        <AppBackHeader style={styles.header} text="" />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* --- Video Player --- */}
          <View style={styles.videoContainer}>
            <YoutubePlayer
              height={moderateSize(200)}
              width={width}
              play={playing}
              videoId={extractedId}
              forceAndroidAutoplay
              onChangeState={(state) => {
                if (state === "ended") setPlaying(false);
              }}
            />
          </View>

          {/* --- Video Details --- */}
          <View style={styles.detailsContainer}>
            <AppText style={styles.title}>
              {title || "Living in Divine Purpose"}
            </AppText>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <User size={16} color="#aaa" />
                <AppText style={styles.metaText}>
                  {preacher || "Apostle T.D Philips"}
                </AppText>
              </View>
              <View style={styles.metaItem}>
                <Clock size={16} color="#aaa" />
                <AppText style={styles.metaText}>
                  {calDuration(Number(duration)) || "1hr 27mins"}
                </AppText>
              </View>
            </View>

            <AppText style={styles.description}>
              {description ||
                "In this inspiring message, Apostle T.D Philips teaches about walking in divine purpose, understanding your spiritual calling, and living a life of intentional impact."}
            </AppText>

            <TouchableOpacity style={styles.watchButton} onPress={handleShare}>
              <Share size={moderateSize(16)} color={Colors.black} />
              <AppText style={styles.watchButtonText}>{"Share"}</AppText>
            </TouchableOpacity>
          </View>

          <VideoSeries series={series!} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    padding: 15,
  },
  videoContainer: {
    backgroundColor: "#000",
  },
  detailsContainer: {
    paddingHorizontal: moderateSize(10),
    paddingVertical: moderateSize(20),
  },
  title: {
    color: "#fff",
    fontSize: moderateSize(16),
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    gap: moderateSize(15),
    marginVertical: moderateSize(10),
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: "#aaa",
    fontSize: moderateSize(12),
  },
  description: {
    color: "#ccc",
    fontSize: moderateSize(12),
    lineHeight: moderateSize(20),
    marginTop: moderateSize(10),
  },
  watchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 12,
    marginTop: moderateSize(20),
    gap: 8,
  },
  watchButtonText: {
    color: Colors.black,
    fontSize: moderateSize(14),
    fontFamily: Fonts.SemiBold,
  },
  relatedContainer: {
    marginTop: moderateSize(30),
    paddingHorizontal: moderateSize(15),
    marginBottom: moderateSize(40),
  },
  relatedHeader: {
    color: "#fff",
    fontSize: moderateSize(16),
    fontFamily: Fonts.SemiBold,
    marginBottom: moderateSize(10),
  },
  relatedScroll: {
    paddingRight: moderateSize(15),
  },
  relatedCard: {
    width: moderateSize(180),
    marginRight: moderateSize(12),
  },
  relatedThumbnail: {
    height: 100,
    borderRadius: 10,
    backgroundColor: "#222",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  relatedTitle: {
    color: "#fff",
    fontSize: moderateSize(14),
    marginTop: 6,
    fontFamily: Fonts.SemiBold,
  },
  relatedMeta: {
    color: "#999",
    fontSize: moderateSize(12),
  },
});
