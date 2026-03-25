import { Colors } from "@/constants/theme";
import FollowUs from "@/screens/appScreens/Tv/component/FollowUs";
import NextServicesCard from "@/screens/appScreens/Tv/component/NextServicesCard";
import TvPlayerView from "@/screens/appScreens/Tv/component/TvPlayerView";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback } from "react";
import { ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Screen } from "@/components/Screen";
import { useLiveEvents } from "@/hooks/useLiveEvents";
import { useEventsQuery } from "@/services/api/public";
import { useAudio } from "@/context/AudioContext";

const Tv = () => {
  const { pause } = useAudio();

  useFocusEffect(
    useCallback(() => {
      pause();
    }, [pause])
  );

  const { data } = useEventsQuery({ search: "" });

  const events = data?.data ?? [];

  const { liveEvent, nextLiveEvent } = useLiveEvents(events);

  return (
    <Screen safeAreaEdges={["top"]}>
      <LinearGradient
        colors={Colors.gradientDeep}
        style={{ flex: 1, paddingBottom: moderateSize(30) }}
      >
        <TvPlayerView liveEvent={liveEvent} />

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: moderateSize(15),
            paddingTop: moderateSize(18),
          }}
        >
          <NextServicesCard nextLiveEvent={nextLiveEvent} />

          <FollowUs />
        </ScrollView>
      </LinearGradient>
    </Screen>
  );
};

export default Tv;
