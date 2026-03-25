import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Calendar } from "lucide-react-native";
import { SkeletonBox, EmptyState } from "@/components/global";
import { EventCard } from "@/components/features/event/EventCard";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useEventsQuery } from "@/services/api/public";

export const EventsList: React.FC = () => {
  const router = useRouter();
  const { data, isLoading } = useEventsQuery({ search: "" });

  if (isLoading) {
    return (
      <View style={styles.container}>
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <SkeletonBox
              key={i}
              width="100%"
              height={moderateSize(90)}
              borderRadius={16}
              style={{ marginBottom: 10 }}
            />
          ))}
      </View>
    );
  }

  const events = data?.data ?? [];

  if (!events.length) {
    return (
      <EmptyState
        title="No events"
        subtitle="Check back later for events"
        icon={<Calendar size={48} color={Colors.textMuted} />}
      />
    );
  }

  return (
    <View style={styles.container}>
      {events.map((event: any) => {
        const attrs = event?.attributes || event;
        const startDate = attrs?.start_date || attrs?.startDate || attrs?.event_date;
        const imageUrl = attrs?.image_url || (attrs as any)?.imageUrl || "";
        return (
          <EventCard
            key={(event._id || event.id).toString()}
            title={attrs?.title || attrs?.name}
            date={startDate}
            location={attrs?.location || attrs?.venue}
            imageUrl={imageUrl}
            onPress={() =>
              router.push({
                pathname: "/stack/eventDetails",
                params: { id: event._id || event.id },
              })
            }
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateSize(20),
    paddingBottom: moderateSize(100),
  },
});
