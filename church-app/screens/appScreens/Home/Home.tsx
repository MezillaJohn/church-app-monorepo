import React, { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "@/components/Screen";
import OfflineBanner from "@/components/OfflineBanner";
import { Gradients } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useProfileQuery } from "@/services/api/profile";
import Header from "@/screens/appScreens/Home/component/Header";
import ProfileCompletionModal from "@/screens/appScreens/Home/component/ProfileCompletionModal";
import { LiveBanner } from "@/screens/appScreens/Home/components/LiveBanner";
import { DailyVerseCard } from "@/screens/appScreens/Home/components/DailyVerseCard";
import { QuickActionsGrid } from "@/screens/appScreens/Home/components/QuickActionsGrid";
import { FeaturedSermons } from "@/screens/appScreens/Home/components/FeaturedSermons";
import { UpcomingEventsPreview } from "@/screens/appScreens/Home/components/UpcomingEventsPreview";

const Home = () => {
  const [isProfileModal, setIsProfileModal] = useState(false);

  const { data } = useProfileQuery(null);
  const { setAuthUser } = useAuth();

  const profile = data?.data;
  const isProfileCompleted = profile?.profileComplete;

  useEffect(() => {
    if (!profile) return;
    setAuthUser(profile);
  }, [profile]);

  useEffect(() => {
    if (isProfileCompleted === false) {
      setTimeout(() => {
        setIsProfileModal(true);
      }, 1000);
    }
  }, [isProfileCompleted]);

  const sections = useMemo(
    () => [
      { key: "header", component: <Header /> },
      { key: "liveBanner", component: <LiveBanner /> },
      { key: "dailyVerse", component: <DailyVerseCard /> },
      { key: "quickActions", component: <QuickActionsGrid /> },
      { key: "videoSermons", component: <FeaturedSermons type="video" /> },
      { key: "audioSermons", component: <FeaturedSermons type="audio" /> },
      { key: "upcomingEvents", component: <UpcomingEventsPreview /> },
    ],
    []
  );



  return (
    <LinearGradient
      colors={Gradients.screen as unknown as string[]}
      style={{ flex: 1 }}
    >
      <Screen backgroundColor="transparent" safeAreaEdges={["top"]}>
        <OfflineBanner />
        <FlatList
          data={sections}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 14 }}>{item.component}</View>
          )}
          showsVerticalScrollIndicator={false}
        />

        <ProfileCompletionModal
          visible={isProfileModal}
          onClose={() => setIsProfileModal(false)}
        />
      </Screen>
    </LinearGradient>
  );
};

export default Home;
