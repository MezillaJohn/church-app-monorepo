import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Radio } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, Badge } from "@/components/global";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useLiveEvents } from "@/hooks/useLiveEvents";
import { useEventsQuery } from "@/services/api/public";

export const LiveBanner: React.FC = () => {
  const router = useRouter();
  const { data: eventsData } = useEventsQuery({ search: "", is_live: true });
  const { liveEvent } = useLiveEvents(eventsData?.data ?? []);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (liveEvent) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [liveEvent]);

  if (!liveEvent) return null;

  const attrs: any = liveEvent.attributes || liveEvent;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { transform: [{ scale: pulseAnim }] },
      ]}
    >
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/stack/eventDetails",
            params: { id: (liveEvent as any)._id || liveEvent.id },
          })
        }
      >
        <LinearGradient
          colors={["rgba(248,113,113,0.15)", "rgba(248,113,113,0.05)"]}
          style={styles.banner}
        >
          <View style={styles.left}>
            <Radio size={moderateSize(20)} color={Colors.error} strokeWidth={2} />
            <View style={styles.textBlock}>
              <Badge label="LIVE NOW" variant="live" />
              <Text variant="caption" numberOfLines={1} style={{ marginTop: 4 }}>
                {attrs?.title || attrs?.name || "Live Event"}
              </Text>
            </View>
          </View>
          <Text variant="caption" color="accent" style={{ color: Colors.error }}>
            Watch
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: moderateSize(20),
    marginBottom: moderateSize(8),
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: moderateSize(14),
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.20)",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateSize(12),
    flex: 1,
  },
  textBlock: {
    flex: 1,
  },
});
