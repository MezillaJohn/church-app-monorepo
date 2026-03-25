import AppImage from "@/components/AppImage";
import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { MyBookItem } from "@/services/api/library/types";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const MyCollectionList = ({ item }: { item: MyBookItem }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: "/(tabs)/library/bookDetails",
          params: { id: (item?.relationships?.book?.id ?? "").toString() },
        })
      }
      style={styles.card}
      activeOpacity={0.85}
    >
      <AppImage
        source={{ uri: item?.relationships?.book?.cover_image }}
        style={styles.image}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
        style={styles.gradient}
      />
      <View style={styles.textOverlay}>
        <AppText style={styles.title}>
          {item?.relationships?.book?.title}
        </AppText>
        <AppText style={styles.author}>
          {item?.relationships?.book?.price} NGN
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

export default MyCollectionList;

const styles = StyleSheet.create({
  card: {
    width: "48%",
    height: moderateSize(180),
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: moderateSize(12),
    backgroundColor: Colors.textInputGrey,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: moderateSize(180),
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  textOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  title: {
    fontFamily: Fonts.Bold,
    color: Colors.white,
    fontSize: moderateSize(12),
  },
  author: {
    fontFamily: Fonts.Regular,
    color: Colors.deemedWhite,
    fontSize: moderateSize(10),
    opacity: 0.8,
  },
});
