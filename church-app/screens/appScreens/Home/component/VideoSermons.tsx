import SectionHeader from "@/components/SectionHeader";
import { useGetFeaturedSermonQuery } from "@/services/api/sermon";
import VideoSermonCardSkeleton from "@/skeleton/VideoCardSkeleton";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import VideoSermonCard from "./VideoSermonCard";

const VideoSermons = () => {
  const router = useRouter();

  const { data: featuredSermon, isLoading } = useGetFeaturedSermonQuery({
    type: "video",
  });

  const sermon = featuredSermon?.data;

  const params: any = {
    search: "",
    sort: "desc",
    category_id: "",
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        text="Video Sermons"
        rightText="View all"
        route="/stack/allVideoSermon"
      />

      {isLoading ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={Array(5).fill(null)}
          keyExtractor={(_, i) => i.toString()}
          renderItem={() => <VideoSermonCardSkeleton />}
        />
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={sermon}
          keyExtractor={(item) => (item._id || item.id).toString()}
          contentContainerStyle={{ paddingRight: moderateSize(10) }}
          renderItem={({ item }) => {
            return (
              <VideoSermonCard
                params={params}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/stack/videoDetailsScreen",
                    params: {
                      id: item?._id || item?.id,
                      title: item?.title,
                      preacher: item?.speaker,
                      duration: item?.duration,
                      description: item?.description,
                      videoUrl: item?.youtubeVideoUrl,
                      videoId: item?.youtubeVideoId,
                      series: item?.seriesId?.name || "",
                    },
                  })
                }
              />
            );
          }}
        />
      )}
    </View>
  );
};

export default VideoSermons;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: moderateSize(20),
  },
});
