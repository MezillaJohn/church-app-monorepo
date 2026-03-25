import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { BookOpen, Calendar, Heart, Radio } from "lucide-react-native";
import { FeatureCard } from "@/components/global";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useLiveEvents } from "@/hooks/useLiveEvents";
import { useEventsQuery } from "@/services/api/public";

export const QuickActionsGrid: React.FC = () => {
  const router = useRouter();
  const { data: eventsData } = useEventsQuery({ search: "", is_live: true });
  const { liveEvent } = useLiveEvents(eventsData?.data ?? []);

  const actions = [
    ...(liveEvent
      ? [
          {
            id: "live",
            title: "Live Now",
            icon: <Radio size={moderateSize(22)} color={Colors.error} strokeWidth={1.8} />,
            color: Colors.error,
            onPress: () =>
              router.push({
                pathname: "/stack/eventDetails",
                params: { id: (liveEvent as any)._id || liveEvent.id },
              }),
          },
        ]
      : []),
    {
      id: "give",
      title: "Give",
      icon: <Heart size={moderateSize(22)} color={Colors.primary} strokeWidth={1.8} />,
      color: Colors.primary,
      onPress: () => router.push("/stack/giving"),
    },
    {
      id: "events",
      title: "Events",
      icon: <Calendar size={moderateSize(22)} color={Colors.success} strokeWidth={1.8} />,
      color: Colors.success,
      onPress: () => router.push("/stack/events"),
    },
    {
      id: "books",
      title: "Books",
      icon: <BookOpen size={moderateSize(22)} color={Colors.accent2} strokeWidth={1.8} />,
      color: Colors.accent2,
      onPress: () => router.push("/stack/books"),
    },
  ];

  // If live, show 1 live + 3 actions (max 4). Otherwise show 4.
  const displayActions = actions.slice(0, 4);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {displayActions.map((action) => (
          <View key={action.id} style={styles.cell}>
            <FeatureCard
              icon={action.icon}
              title={action.title}
              color={action.color}
              onPress={action.onPress}
              style={styles.card}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateSize(20),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateSize(10),
  },
  cell: {
    width: "48%",
    flexGrow: 1,
  },
  card: {
    width: "100%",
  },
});
