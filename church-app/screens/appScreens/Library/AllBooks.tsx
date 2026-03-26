import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { BookOpen } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import {
  ScreenHeader,
  SearchBar,
  SkeletonBox,
  EmptyState,
  Text,
} from "@/components/global";
import { BookCard } from "@/components/features/book/BookCard";
import { Gradients, Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useBooksQuery } from "@/services/api/library";
import useDebounce from "@/hooks/debounceSearch";

const AllBooks = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchText, 400);

  const { data: booksData, isLoading, isFetching } = useBooksQuery({ page });

  const allBooks = booksData?.data ?? [];
  const meta = booksData?.meta;
  const hasMore = meta ? meta.current_page < meta.last_page : false;

  const filteredBooks = useMemo(() => {
    if (!debouncedSearch.trim()) return allBooks;
    const query = debouncedSearch.toLowerCase();
    return allBooks.filter((item: any) => {
      const title = (item?.title || "").toLowerCase();
      const author = (item?.author || "").toLowerCase();
      return title.includes(query) || author.includes(query);
    });
  }, [allBooks, debouncedSearch]);

  const handleBookPress = useCallback(
    (item: any) => {
      router.push({
        pathname: "/stack/bookDetails",
        params: { id: (item._id || item.id).toString() },
      });
    },
    [router],
  );

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isFetching]);

  const handleScroll = useCallback(
    (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const distanceFromBottom =
        contentSize.height - layoutMeasurement.height - contentOffset.y;
      if (distanceFromBottom < 200) {
        handleLoadMore();
      }
    },
    [handleLoadMore],
  );

  const renderSkeletons = () => (
    <View style={styles.gridContainer}>
      {Array(6)
        .fill(null)
        .map((_, i) => (
          <View key={i} style={styles.gridItem}>
            <SkeletonBox
              width="100%"
              height={moderateSize(220)}
              borderRadius={12}
            />
            <View style={{ marginTop: 8, gap: 4 }}>
              <SkeletonBox
                width="80%"
                height={moderateSize(14)}
                borderRadius={6}
              />
              <SkeletonBox
                width="50%"
                height={moderateSize(12)}
                borderRadius={6}
              />
            </View>
          </View>
        ))}
    </View>
  );

  const renderBooks = () => {
    if (isLoading) return renderSkeletons();

    if (!filteredBooks.length) {
      return (
        <EmptyState
          title="No books available"
          subtitle={
            debouncedSearch
              ? "Try a different search term"
              : "Check back later for new content"
          }
          icon={<BookOpen size={48} color={Colors.textMuted} />}
        />
      );
    }

    return (
      <>
        <View style={styles.gridContainer}>
          {filteredBooks.map((item: any) => {
            const book = item;


            return (
              <View
                key={(item._id || item.id).toString()}
                style={styles.gridItem}
              >
                <BookCard
                  title={book?.title || ""}
                  author={book?.author || ""}
                  coverImage={book?.coverImage}
                  price={book?.price?.toString()}
                  rating={book?.rating?.toString()}
                  onPress={() => handleBookPress(item)}
                  style={{ width: "100%" }}
                />
              </View>
            );
          })}
        </View>
        {isFetching && page > 1 && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text variant="small" color="muted" style={{ marginLeft: 8 }}>
              Loading more...
            </Text>
          </View>
        )}
      </>
    );
  };

  return (
    <LinearGradient
      colors={Gradients.screen as unknown as string[]}
      style={{ flex: 1 }}
    >
      <Screen
        backgroundColor="transparent"
        safeAreaEdges={["top"]}
        preset="scroll"
        ScrollViewProps={{ onScroll: handleScroll, scrollEventThrottle: 16 }}
      >
        <View style={styles.container}>
          <ScreenHeader title="Books" showBack />
          <View style={styles.searchRow}>
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search books..."
              style={{ flex: 1 }}
            />
          </View>
          {renderBooks()}
        </View>
      </Screen>
    </LinearGradient>
  );
};

export default AllBooks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    paddingHorizontal: moderateSize(20),
    marginBottom: moderateSize(16),
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
  loadingMore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateSize(16),
    paddingBottom: moderateSize(100),
  },
});
