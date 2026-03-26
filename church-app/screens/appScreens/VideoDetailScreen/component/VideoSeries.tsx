import AppImage from "@/components/AppImage";
import { AppText } from "@/components/AppText";
import { Fonts } from "@/constants/theme";
import { useSermonsQuery } from "@/services/api/sermon";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { PlayCircle } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface VideoSeriesProps {
  series: string;
}

const VideoSeries = ({ series }: VideoSeriesProps) => {
  const router = useRouter();

  const { data } = useSermonsQuery({
    type: "video",
    series: series,
  });

  const videos = data?.data || [];

  if (videos.length === 0) return null;

  return (
    <View style={styles.container}>
      <AppText style={styles.header}>Related Sermons</AppText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {videos.map((item: any) => {
          const itemId = item._id || item.id;

          return (
            <TouchableOpacity
              key={itemId?.toString()}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/stack/videoDetailsScreen",
                  params: {
                    videoUrl: item?.youtubeVideoUrl || "",
                    videoId: item?.youtubeVideoId || "",
                    series: item?.seriesId?.name || "",
                    title: item?.title || "",
                    preacher: item?.speaker || "",
                    duration: String(item?.duration ?? ""),
                    description: item?.description || "",
                  },
                })
              }
            >
              <View style={styles.thumbnail}>
                <AppImage
                  source={{ uri: item?.thumbnailUrl }}
                  style={{ width: moderateSize(170) }}
                />

                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.6)"]}
                  style={styles.gradient}
                />

                <PlayCircle
                  style={{ position: "absolute" }}
                  size={moderateSize(28)}
                  color="#fff"
                />
              </View>

              <AppText numberOfLines={1} style={styles.title}>
                {item?.title}
              </AppText>

              <AppText style={styles.meta}>{item?.speaker}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default VideoSeries;

const styles = StyleSheet.create({
  container: {
    marginTop: moderateSize(30),
    paddingHorizontal: moderateSize(15),
    marginBottom: moderateSize(40),
  },
  header: {
    color: "#fff",
    fontSize: moderateSize(14),
    fontFamily: Fonts.SemiBold,
    marginBottom: moderateSize(10),
  },
  scroll: {
    paddingRight: moderateSize(15),
  },
  card: {
    width: moderateSize(180),
    marginRight: moderateSize(12),
  },
  thumbnail: {
    width: moderateSize(170),
    height: moderateSize(100),
    borderRadius: 10,
    backgroundColor: "#222",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    color: "#fff",
    fontSize: moderateSize(14),
    marginTop: 6,
    fontFamily: Fonts.SemiBold,
  },
  meta: {
    color: "#999",
    fontSize: moderateSize(12),
  },
});
