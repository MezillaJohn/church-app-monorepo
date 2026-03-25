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
    const attrs = item;

    router.push({
      pathname: "/stack/audioPlay",
      params: {
        id: (item as any)?._id || item?.id,
        title: attrs?.title,
        preacher: attrs?.speaker,
        audioUrl: attrs?.audio_file_url || (attrs as any)?.audioFileUrl,
        thumbnail: attrs?.thumbnail_url || (attrs as any)?.thumbnailUrl,
        series:
          item?.relationships?.series?.attributes?.name ||
          (attrs as any)?.seriesName ||
          "",
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
            const attrs = item
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
            const attrs = item?.attributes || item;
            const sermonId = (item as any)?._id || item?.id;
            return (
              <AudioSermonCard
                key={sermonId?.toString()}
                title={attrs?.title || ""}
                speaker={attrs?.speaker || ""}
                duration={attrs?.duration}
                thumbnailUrl={attrs?.thumbnail_url || (attrs as any)?.thumbnailUrl || ""}
                audioUrl={attrs?.audio_file_url || (attrs as any)?.audioFileUrl || ""}
                isFavorited={attrs?.is_favorited || (attrs as any)?.isFavorited}
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
