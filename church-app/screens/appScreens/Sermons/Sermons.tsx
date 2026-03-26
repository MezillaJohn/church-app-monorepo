import React, { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { BookOpen } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { ScreenHeader, SegmentControl, SearchBar, SkeletonBox, EmptyState, Text } from "@/components/global";
import { VideoSermonCard } from "@/components/features/sermon/VideoSermonCard";
import { AudioSermonCard } from "@/components/features/sermon/AudioSermonCard";
import { Gradients, Colors, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useSermonsQuery, useMarkAsFavouriteMutation } from "@/services/api/sermon";
import { useBooksQuery } from "@/services/api/library";
import { useGetCategoryQuery } from "@/services/api/public";
import { useDownloadedSermons } from "@/hooks/useDownloadedSermons";
import useDebounce from "@/hooks/debounceSearch";
import { BookCard } from "@/components/features/book/BookCard";

const SEGMENTS = ["Video", "Audio", "Books"];

const Sermons = () => {
  const router = useRouter();
  const [activeSegment, setActiveSegment] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const debouncedSearch = useDebounce(searchText, 400);
  const [markFavourite] = useMarkAsFavouriteMutation();

  const { data: categories } = useGetCategoryQuery(null);

  // Video sermons
  const { data: videoData, isLoading: videoLoading } = useSermonsQuery({
    type: "video",
    search: debouncedSearch,
    sort: "desc",
    category_id: selectedCategory,
    page: 1,
  });

  // Audio sermons
  const { data: audioData, isLoading: audioLoading } = useSermonsQuery({
    type: "audio",
    search: debouncedSearch,
    sort: "desc",
    category_id: selectedCategory,
    page: 1,
  });

  // Books
  const { data: booksData, isLoading: booksLoading } = useBooksQuery({ page: 1 });

  const { downloadedMap, isLoaded: downloadsLoaded } = useDownloadedSermons();

  const audioSermons = useMemo(() => {
    return audioData?.data?.map((s: any) => {
      const id = s._id || s.id;
      const download = downloadedMap[id];
      if (download?.local_audio_uri) {
        if (s.attributes) {
          return { ...s, attributes: { ...s.attributes, audio_file_url: download.local_audio_uri } };
        }
        return { ...s, audio_file_url: download.local_audio_uri, audioFileUrl: download.local_audio_uri };
      }
      return s;
    });
  }, [audioData, downloadedMap]);

  const handleVideoPress = useCallback((item: any) => {
    const attrs = item?.attributes || item;
    router.push({
      pathname: "/stack/videoDetailsScreen",
      params: {
        id: item?._id || item?.id,
        title: attrs?.title,
        preacher: attrs?.speaker,
        duration: attrs?.duration,
        description: attrs?.description,
        videoUrl: attrs?.youtube_video_url || attrs?.youtubeVideoUrl,
        videoId: attrs?.youtube_video_id || attrs?.youtubeVideoId,
        series: item?.relationships?.series?.attributes?.name || attrs?.seriesName || "",
      },
    });
  }, [router]);

  const handleAudioPress = useCallback((item: any) => {
    const attrs = item?.attributes || item;
    router.push({
      pathname: "/stack/audioPlay",
      params: {
        id: (item as any)?._id || item?.id,
        title: attrs?.title,
        preacher: attrs?.speaker,
        audioUrl: attrs?.audio_file_url || (attrs as any)?.audioFileUrl,
        thumbnail: attrs?.thumbnail_url || (attrs as any)?.thumbnailUrl,
        series: item?.relationships?.series?.attributes?.name || (attrs as any)?.seriesName || "",
      },
    });
  }, [router]);

  const handleBookPress = useCallback((item: any) => {
    router.push({
      pathname: "/stack/bookDetails",
      params: { id: (item._id || item.id).toString() },
    });
  }, [router]);

  const categoryList = categories?.data ?? [];

  const renderCategoryPills = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pillsContent}
      style={styles.pillsScroll}
    >
      <Pressable
        onPress={() => setSelectedCategory("")}
        style={[styles.categoryPill, !selectedCategory && styles.categoryPillActive]}
      >
        <Text variant="caption" style={{ color: !selectedCategory ? Colors.primary : Colors.textMuted }}>
          All
        </Text>
      </Pressable>
      {categoryList.map((cat: any) => {
        const isActive = selectedCategory === (cat.id || cat._id)?.toString();
        return (
          <Pressable
            key={(cat.id || cat._id).toString()}
            onPress={() => setSelectedCategory((cat.id || cat._id).toString())}
            style={[styles.categoryPill, isActive && styles.categoryPillActive]}
          >
            <Text variant="caption" style={{ color: isActive ? Colors.primary : Colors.textMuted }}>
              {cat.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );

  const renderVideoGrid = () => {
    if (videoLoading) {
      return (
        <View style={styles.gridContainer}>
          {Array(6).fill(null).map((_, i) => (
            <View key={i} style={styles.gridItem}>
              <SkeletonBox width="100%" height={moderateSize(200)} borderRadius={16} />
            </View>
          ))}
        </View>
      );
    }
    const items = videoData?.data ?? [];
    if (!items.length) {
      return <EmptyState title="No video sermons" subtitle="Check back later for new content" />;
    }
    return (
      <View style={styles.gridContainer}>
        {items.map((item: any) => {
          const attrs = item?.attributes || item;
          return (
            <View key={(item._id || item.id).toString()} style={styles.gridItem}>
              <VideoSermonCard
                title={attrs?.title || ""}
                description={attrs?.description || ""}
                speaker={attrs?.speaker || ""}
                duration={attrs?.duration}
                thumbnailUrl={attrs?.thumbnail_url || attrs?.thumbnailUrl || ""}
                onPress={() => handleVideoPress(item)}
                style={{ width: "100%" }}
              />
            </View>
          );
        })}
      </View>
    );
  };

  const renderAudioList = () => {
    if (audioLoading || !downloadsLoaded) {
      return (
        <View style={styles.listContainer}>
          {Array(5).fill(null).map((_, i) => (
            <SkeletonBox key={i} width="100%" height={moderateSize(64)} borderRadius={14} style={{ marginBottom: 8 }} />
          ))}
        </View>
      );
    }
    const items = audioSermons ?? [];
    if (!items.length) {
      return <EmptyState title="No audio sermons" subtitle="Check back later for new content" />;
    }
    return (
      <View style={styles.listContainer}>
        {items.map((item: any) => {
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
              onPress={() => handleAudioPress(item)}
              onFavourite={() =>
                markFavourite({
                  id: String(sermonId),
                  type: "audio",
                  search: debouncedSearch,
                  sort: "desc",
                  category_id: selectedCategory,
                })
              }
            />
          );
        })}
      </View>
    );
  };

  const renderBooks = () => {
    if (booksLoading) {
      return (
        <View style={styles.gridContainer}>
          {Array(4).fill(null).map((_, i) => (
            <View key={i} style={styles.gridItem}>
              <SkeletonBox width="100%" height={moderateSize(220)} borderRadius={16} />
            </View>
          ))}
        </View>
      );
    }
    const items = booksData?.data ?? [];
    if (!items.length) {
      return <EmptyState title="No books available" subtitle="Check back later" icon={<BookOpen size={48} color={Colors.textMuted} />} />;
    }
    return (
      <View style={styles.gridContainer}>
        {items.map((item: any) => {
          const attrs = item?.attributes || item;
          return (
            <View key={(item._id || item.id).toString()} style={styles.gridItem}>
              <BookCard
                title={attrs?.title || ""}
                author={attrs?.author || ""}
                coverImage={attrs?.cover_image || attrs?.coverImage || ""}
                price={attrs?.price?.toString()}
                onPress={() => handleBookPress(item)}
                style={{ width: "100%" }}
              />
            </View>
          );
        })}
      </View>
    );
  };

  const contentMap = [renderVideoGrid, renderAudioList, renderBooks];

  return (
    <LinearGradient colors={Gradients.screen as unknown as string[]} style={{ flex: 1 }}>
      <Screen backgroundColor="transparent" safeAreaEdges={["top"]} preset="scroll">
        <View style={styles.container}>
          <ScreenHeader title="Sermons" />
          <View style={styles.searchRow}>
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search sermons, books..."
              style={{ flex: 1 }}
            />
          </View>
          <View style={styles.segmentRow}>
            <SegmentControl
              segments={SEGMENTS}
              activeIndex={activeSegment}
              onChange={setActiveSegment}
            />
          </View>
          {activeSegment < 2 && renderCategoryPills()}
          {contentMap[activeSegment]()}
        </View>
      </Screen>
    </LinearGradient>
  );
};

export default Sermons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    paddingHorizontal: moderateSize(20),
    marginBottom: moderateSize(12),
  },
  segmentRow: {
    paddingHorizontal: moderateSize(20),
    marginBottom: moderateSize(12),
  },
  pillsScroll: {
    marginBottom: moderateSize(12),
  },
  pillsContent: {
    paddingHorizontal: moderateSize(20),
    gap: moderateSize(8),
  },
  categoryPill: {
    paddingHorizontal: moderateSize(14),
    paddingVertical: moderateSize(6),
    borderRadius: 20,
    borderCurve: "continuous",
    backgroundColor: whiteOpacity("0.04"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.06"),
  },
  categoryPillActive: {
    backgroundColor: "rgba(0,217,166,0.10)",
    borderColor: "rgba(0,217,166,0.20)",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: moderateSize(20),
    gap: moderateSize(10),
    paddingBottom: moderateSize(100),
  },
  gridItem: {
    width: "48%",
    flexGrow: 1,
  },
  listContainer: {
    paddingHorizontal: moderateSize(20),
    paddingBottom: moderateSize(100),
  },
});
