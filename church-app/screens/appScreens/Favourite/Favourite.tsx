import AppBackHeader from "@/components/AppBackHeader";
import EmptyState from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { Colors, Fonts } from "@/constants/theme";
import AudioSermonCard from "@/screens/appScreens/AllAudioScreens/component/AudioSermonCard";
import VideoSermonCard from "@/screens/appScreens/Home/component/VideoSermonCard";
import { useGetFavouriteSermonsQuery } from "@/services/api/sermon";
import AudioSermonSkeletonList from "@/skeleton/AudioSermonSkeletonList";
import VideoSermonCardSkeleton from "@/skeleton/VideoCardSkeleton";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";

const { width } = Dimensions.get("window");
const horizontalPadding = moderateSize(15);
const spacingBetweenCards = moderateSize(10);
const cardWidth = (width - horizontalPadding * 2 - spacingBetweenCards) / 2;

const Favourite = () => {
  const { data, isLoading } = useGetFavouriteSermonsQuery({});

  const { audioData, videoData } = useMemo(() => {
    const sermons = data?.data ?? [];
    const audio: any[] = [];
    const video: any[] = [];
    sermons.forEach((item: any) => {
      const attrs = item?.attributes ?? item;
      if (attrs?.type === "video") video.push(item);
      else audio.push(item);
    });
    return { audioData: audio, videoData: video };
  }, [data]);

  const params: any = {
    search: "",
    sort: "desc",
    category_id: "",
  };

  return (
    <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
      <Screen backgroundColor="transparent" safeAreaEdges={["top", "bottom"]}>
        <AppBackHeader text="Favourite" style={{ marginBottom: 30 }} />
        <Tabs.Container
          renderTabBar={(props) => (
            <MaterialTabBar
              {...props}
              scrollEnabled
              style={{ backgroundColor: Colors.purpleDark }}
              tabStyle={{ width: "auto", paddingHorizontal: 20 }}
              indicatorStyle={{ backgroundColor: "white", height: 3 }}
              labelStyle={{
                fontFamily: Fonts.Bold,
                textTransform: "capitalize",
                fontSize: moderateSize(12),
              }}
              activeColor="white"
              inactiveColor={Colors.muted}
              getLabelText={(name) => String(name)}
            />
          )}
        >
          <Tabs.Tab name="Audio">
            {isLoading ? (
              <AudioSermonSkeletonList count={4} />
            ) : audioData.length === 0 ? (
              <EmptyState
                message="Your favourite audios will appear here!"
                title="No Favourite Audio"
              />
            ) : (
              <Tabs.FlatList
                key={"audio"}
                data={audioData}
                keyExtractor={(item: any) =>
                  String(item._id ?? item.id)
                }
                renderItem={({ item }: any) => (
                  <AudioSermonCard params={params} item={item} />
                )}
                contentContainerStyle={{
                  marginTop: moderateSize(10),
                  marginRight: moderateSize(26),
                }}
              />
            )}
          </Tabs.Tab>

          <Tabs.Tab name="Video">
            {isLoading ? (
              <FlatList
                data={Array(6).fill(null)}
                numColumns={2}
                keyExtractor={(_, i) => i.toString()}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                renderItem={() => (
                  <VideoSermonCardSkeleton cardWidth={cardWidth} />
                )}
              />
            ) : videoData.length === 0 ? (
              <EmptyState
                message="Your favourite videos will appear here!"
                title="No Favourite Video"
              />
            ) : (
              <Tabs.FlatList
                key={"video"}
                data={videoData}
                keyExtractor={(item: any) =>
                  String(item._id ?? item.id)
                }
                numColumns={2}
                columnWrapperStyle={[styles.row]}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }: any) => {
                  const attrs = item?.attributes ?? item;
                  return (
                    <VideoSermonCard
                      page={1}
                      params={params}
                      item={item}
                      onPress={() =>
                        router.push({
                          pathname: "/stack/videoDetailsScreen",
                          params: {
                            id: String(item?._id ?? item?.id),
                            title: attrs?.title,
                            preacher: attrs?.speaker,
                            duration: attrs?.duration,
                            description: attrs?.description,
                            videoUrl:
                              attrs?.youtube_video_url ??
                              attrs?.youtubeVideoUrl,
                            videoId:
                              attrs?.youtube_video_id ??
                              attrs?.youtubeVideoId,
                            series:
                              attrs?.series ??
                              item?.seriesId?.name ??
                              "",
                          },
                        })
                      }
                    />
                  );
                }}
              />
            )}
          </Tabs.Tab>
        </Tabs.Container>
      </Screen>
    </LinearGradient>
  );
};

export default Favourite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  row: {
    justifyContent: "space-between",
  },
  listContent: {
    paddingBottom: moderateSize(30),
    marginTop: 30,
  },

  filterWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateSize(10),
  },
});
