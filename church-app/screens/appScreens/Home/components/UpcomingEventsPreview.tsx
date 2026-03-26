import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import SectionHeader from "@/components/SectionHeader";
import { EventCard } from "@/components/features/event/EventCard";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useEventsQuery } from "@/services/api/public";

export const UpcomingEventsPreview: React.FC = () => {
  const router = useRouter();
  const { data, isLoading } = useEventsQuery({ search: "", upcoming: true });

  const events = data?.data?.slice(0, 3);

  if (isLoading || !events?.length) return null;

  return (
    <View style={styles.container}>
      <SectionHeader text="Upcoming Events" rightText="See all" route="/stack/events" />
      {events.map((event: any) => {
        return (
          <EventCard
            key={(event._id || event.id).toString()}
            title={event?.title}
            date={event?.eventDate}
            location={event?.location}
            imageUrl={event?.imageUrl || ""}
            isLive={event?.isLive}
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
    marginHorizontal: moderateSize(20),
    marginBottom: moderateSize(100),
  },
});
