import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import SectionHeader from "@/components/SectionHeader";
import { SkeletonBox } from "@/components/global";
import { AudioSermonCard } from "@/components/features/sermon/AudioSermonCard";
import { useGetFeaturedSermonQuery, useMarkAsFavouriteMutation } from "@/services/api/sermon";
import { moderateSize } from "@/utils/useResponsiveStyle";
import VideoSermonCard from "@/screens/appScreens/Home/component/VideoSermonCard";
import { SermonListParams } from "@/services/api/sermon/type";

interface FeaturedSermonsProps {
  type: "video" | "audio";
}

export const FeaturedSermons: React.FC<FeaturedSermonsProps> = ({ type }) => {
  const router = useRouter();
  const { data, isLoading } = useGetFeaturedSermonQuery({ type });
  const [markFavourite] = useMarkAsFavouriteMutation();
  const sermons = data?.data;

  const title = type === "video" ? "Video Sermons" : "Audio Sermons";
  const route =
    type === "video" ? "/stack/allVideoSermon" : "/stack/allAudioSermons";

  const params: SermonListParams = {
    search: '',
    sort: 'desc',
    category_id: ''
  };

  const handlePress = (item: any) => {
    router.push({
      pathname: "/stack/audioPlay",
      params: {
        id: item?._id || item?.id,
        title: item?.title,
        preacher: item?.speaker,
        audioUrl: item?.audioFileUrl,
        thumbnail: item?.thumbnailUrl,
        series: item?.seriesId?.name || "",
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SectionHeader text={title} rightText="View all" route={route} />
        {type === "video" ? (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={Array(3).fill(null)}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={() => (
              <SkeletonBox
                width={moderateSize(220)}
                height={moderateSize(200)}
                borderRadius={16}
                style={{ marginRight: moderateSize(12) }}
              />
            )}
          />
        ) : (
          <View>
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <SkeletonBox
                  key={i}
                  width="100%"
                  height={moderateSize(64)}
                  borderRadius={14}
                  style={{ marginBottom: moderateSize(8) }}
                />
              ))}
          </View>
        )}
      </View>
    );
  }

  if (!sermons?.length) return null;

  return (
    <View style={styles.container}>
      <SectionHeader text={title} rightText="View all" route={route} />
      {type === "video" ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={sermons}
          keyExtractor={(item: any) =>
            ((item as any)._id || item.id).toString()
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            return (
              <VideoSermonCard
                page={1}
                params={params}
                item={item}
                cardWidth={moderateSize(220)}
                onPress={() =>
                  router.push({
                    pathname: "/stack/videoDetailsScreen",
                    params: {
                      videoUrl: item?.youtubeVideoUrl,
                      videoId: item?.youtubeVideoId,

                      title: item?.title,
                      preacher: item?.speaker,
                      duration: String(item?.duration ?? ""),
                      description: item?.description,
                    },
                  })
                }
              />
            );
          }}
        />
      ) : (
        <View>
          {sermons.slice(0, 4).map((item: any) => {
            const sermonId = item?._id || item?.id;
            return (
              <AudioSermonCard
                key={sermonId?.toString()}
                title={item?.title || ""}
                speaker={item?.speaker || ""}
                duration={item?.duration}
                thumbnailUrl={item?.thumbnailUrl || ""}
                audioUrl={item?.audioFileUrl || ""}
                isFavorited={item?.isFavorited}
                sermon={item}
                onPress={() => handlePress(item)}
                onFavourite={() =>
                  markFavourite({
                    id: String(sermonId),
                    type: "audio",
                    search: "",
                    sort: "desc",
                    category_id: "",
                  })
                }
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: moderateSize(20),
    marginVertical: moderateSize(6)
  },
  listContent: {
    paddingRight: moderateSize(10),
  },
});
