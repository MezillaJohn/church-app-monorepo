import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "@/components/Screen";
import { ScreenHeader, SegmentControl } from "@/components/global";
import { Gradients } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { EventsList } from "@/screens/appScreens/Community/components/EventsList";
import { GivingSection } from "@/screens/appScreens/Community/components/GivingSection";
import { PartnerSection } from "@/screens/appScreens/Community/components/PartnerSection";
import { ServiceTimesCard } from "@/screens/appScreens/Community/components/ServiceTimesCard";

const SEGMENTS = ["Events", "Giving", "Partner"];

const Community = () => {
  const [activeSegment, setActiveSegment] = useState(0);

  const renderContent = () => {
    switch (activeSegment) {
      case 0:
        return <EventsList />;
      case 1:
        return <GivingSection />;
      case 2:
        return <PartnerSection />;
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={Gradients.screen as unknown as string[]}
      style={{ flex: 1 }}
    >
      <Screen backgroundColor="transparent" safeAreaEdges={["top"]} preset="scroll">
        <View style={styles.container}>
          <ScreenHeader title="Community" />
          <ServiceTimesCard />
          <View style={styles.segmentRow}>
            <SegmentControl
              segments={SEGMENTS}
              activeIndex={activeSegment}
              onChange={setActiveSegment}
            />
          </View>
          {renderContent()}
        </View>
      </Screen>
    </LinearGradient>
  );
};

export default Community;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentRow: {
    paddingHorizontal: moderateSize(20),
    marginBottom: moderateSize(16),
  },
});
