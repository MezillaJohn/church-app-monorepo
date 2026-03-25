import { Colors } from "@/constants/theme";
import LibraryHeader from "@/screens/appScreens/Library/component/LibraryHeader";
import LibraryTabs from "@/screens/appScreens/Library/tab/LibraryTab";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";

const Library = () => {
  return (
    <LinearGradient colors={Colors.gradientDeep} style={{ flex: 1 }}>
      <LibraryHeader />
      <LibraryTabs />
    </LinearGradient>

  );
};

export default Library;
