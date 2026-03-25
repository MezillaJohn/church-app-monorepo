import AppBackHeader from "@/components/AppBackHeader";
import { AppText } from "@/components/AppText";
import ImageViewer from "@/components/ImageViewer";
import { Screen } from "@/components/Screen";
import { Colors } from "@/constants/theme";
import useDebounce from "@/hooks/debounceSearch";
import EventCard from "@/screens/appScreens/Event/EventCard";
import EventFilterBar from "@/screens/appScreens/Event/EventFilterBar";
import { useEventsQuery } from "@/services/api/public";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

const Event = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"live" | "upcoming" | undefined>(
    undefined
  );
  const [reminders, setReminders] = useState<{ [key: string]: boolean }>({});

  const [showDropdown, setShowDropdown] = useState(false);

  const [ispreviewImage, setIsPreviewImage] = useState(false);
  const [imageToView, setImageToView] = useState("");

  const debouncedSearch = useDebounce(search, 1000);

  const { data, isLoading, isFetching } = useEventsQuery({
    search: debouncedSearch,
    upcoming: filter === "upcoming" ? true : undefined,
    is_live: filter === "live" ? true : undefined,
    page,
  });

  const toggleReminder = (id: string) => {
    setReminders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <Screen preset="fixed" safeAreaEdges={["top"]}>
        <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
          <AppBackHeader
            text="Updates"
            style={{ marginBottom: 30, marginTop: 15 }}
          />

          {/* Search + Filter Extracted Component */}
          <EventFilterBar
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />

          {/* List */}
          {isLoading || isFetching ? (
            <ActivityIndicator color={Colors.primary} size="large" />
          ) : data?.data?.length === 0 ? (
            <View style={{ marginTop: 30 }}>
              <AppText>No Events Found</AppText>
            </View>
          ) : (
            <FlatList
              data={data?.data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <EventCard
                  onImagePress={(image) => {
                    setImageToView(image);
                    setIsPreviewImage(true);
                  }}
                  item={{
                    id: item.id.toString(),
                    title: item?.attributes.title,
                    description: item.attributes.description,
                    date: moment(item.attributes.event_date).format("DD"),
                    month: moment(item.attributes.event_date).format("MMM"),
                    year: moment(item.attributes.event_date).format("YYYY"),
                    time: moment(
                      `${item.attributes.event_date} ${item.attributes.event_time}`,
                      "YYYY-MM-DD HH:mm"
                    ).format("h:mm A"),
                    image: item.attributes.image_url ?? "",
                    reactions: Math.floor(Math.random() * 500),
                  }}
                  reminderEnabled={!!reminders[item.id]}
                  onToggleReminder={() => toggleReminder(item.id.toString())}
                />
              )}
              contentContainerStyle={{ paddingBottom: moderateSize(100) }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </LinearGradient>
      </Screen>

      <ImageViewer
        visible={ispreviewImage}
        image={imageToView}
        onClose={() => setIsPreviewImage(false)}
      />
    </>
  );
};

export default Event;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateSize(16),
  },
});
