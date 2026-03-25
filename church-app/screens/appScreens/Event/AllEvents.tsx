import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Calendar } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import {
  ScreenHeader,
  SegmentControl,
  SearchBar,
  SkeletonBox,
  EmptyState,
  Text,
} from "@/components/global";
import { EventCard } from "@/components/features/event/EventCard";
import { Gradients, Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useEventsQuery } from "@/services/api/public";
import useDebounce from "@/hooks/debounceSearch";

const SEGMENTS = ["All", "Upcoming", "Live"];

const AllEvents = () => {
  const router = useRouter();
  const [activeSegment, setActiveSegment] = useState(0);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 400);

  const queryParams = {
    search: debouncedSearch,
    ...(activeSegment === 1 && { upcoming: true }),
    ...(activeSegment === 2 && { is_live: true }),
    page: 1,
  };

  const { data, isLoading } = useEventsQuery(queryParams);

  const handleEventPress = useCallback(
    (item: any) => {
      const id = String(item?._id ?? item?.id ?? "");
      if (!id) return;
      router.push({
        pathname: "/stack/eventDetails",
        params: { id },
      });
    },
    [router],
  );

  const events = data?.data ?? [];

  const renderSkeletons = () => (
    <View style={styles.listContainer}>
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <SkeletonBox
            key={i}
            width="100%"
            height={moderateSize(88)}
            borderRadius={16}
            style={{ marginBottom: moderateSize(10) }}
          />
        ))}
    </View>
  );

  const renderEvents = () => {
    if (isLoading) return renderSkeletons();

    if (!events.length) {
      return (
        <EmptyState
          title="No events found"
          subtitle={
            activeSegment === 2
              ? "No live events at the moment"
              : "Check back later for upcoming events"
          }
          icon={<Calendar size={48} color={Colors.textMuted} />}
        />
      );
    }

    return (
      <View style={styles.listContainer}>
        {events.map((item: any) => {
          const attrs = item?.attributes || item;
          return (
            <EventCard
              key={(item._id || item.id).toString()}
              title={attrs?.title || ""}
              date={attrs?.event_date || attrs?.eventDate}
              endDate={attrs?.end_date || attrs?.endDate}
              location={attrs?.location}
              imageUrl={attrs?.image_url || attrs?.imageUrl}
              isLive={attrs?.is_live || attrs?.isLive}
              onPress={() => handleEventPress(item)}
            />
          );
        })}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={Gradients.screen as unknown as string[]}
      style={{ flex: 1 }}
    >
      <Screen backgroundColor="transparent" safeAreaEdges={["top"]} preset="scroll">
        <View style={styles.container}>
          <ScreenHeader title="Events" showBack />

          <View style={styles.searchRow}>
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search events..."
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

          {renderEvents()}
        </View>
      </Screen>
    </LinearGradient>
  );
};

export default AllEvents;

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
  listContainer: {
    paddingHorizontal: moderateSize(20),
    paddingBottom: moderateSize(100),
  },
});
