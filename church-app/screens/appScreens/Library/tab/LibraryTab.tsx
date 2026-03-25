import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import MyCollectionGrid from "@/screens/appScreens/Library/tab/MyCollectionGrid";
import WholewordList from "@/screens/appScreens/Library/tab/WholeWordList";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const LibraryTabs = () => {
  const [activeTab, setActiveTab] = useState<"store" | "collection">("store");

  const renderTabButton = (label: string, key: "store" | "collection") => {
    const isActive = activeTab === key;

    return (
      <TouchableOpacity
        onPress={() => setActiveTab(key)}
        activeOpacity={0.9}
        style={styles.tabButton}
      >
        <LinearGradient
          colors={
            isActive
              ? [Colors.primary, "#d8a166ff"]
              : [Colors.textInputGrey, Colors.textInputGrey]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientButton, isActive && styles.activeShadow]}
        >
          <AppText
            style={[
              styles.tabText,
              { color: isActive ? Colors.black : Colors.deemedWhite },
            ]}
          >
            {label}
          </AppText>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* === Tabs === */}
      <View style={styles.tabRow}>
        {renderTabButton("Store", "store")}
        {renderTabButton("My Books", "collection")}
      </View>

      {/* === Content === */}
      <View
        style={{
          marginTop: moderateSize(10),
          paddingHorizontal: moderateSize(10),
        }}
      >
        {activeTab === "store" ? <WholewordList /> : <MyCollectionGrid />}
      </View>
    </View>
  );
};

export default LibraryTabs;

const styles = StyleSheet.create({
  container: {
    marginTop: moderateSize(10),
    flex: 1,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: moderateSize(15),
    backgroundColor: Colors.textInputGrey,
    borderRadius: 25,
    padding: 5,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  gradientButton: {
    borderRadius: moderateSize(20),
    paddingVertical: moderateSize(10),
    alignItems: "center",
    justifyContent: "center",
  },
  activeShadow: {
    shadowColor: Colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  tabText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
  },
});
