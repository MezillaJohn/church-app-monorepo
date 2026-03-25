import AppImage from "@/components/AppImage";
import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const StoreList = ({ item }: { item: any }) => {
  const handleNav = () => {
    router.push({
      pathname: "/(tabs)/library/bookDetails",
      params: { id: (item?._id || item?.id).toString() },
    });
  };

  return (
    <TouchableOpacity
      onPress={handleNav}
      activeOpacity={0.8}
      style={styles.itemContainer}
    >
      <AppImage
        onImagePress={handleNav}
        source={{ uri: item?.attributes?.cover_image }}
        style={styles.image}
      />
      <View style={styles.textContent}>
        <AppText style={styles.title}>{item?.attributes?.title}</AppText>
        <AppText style={styles.author}>{item?.attributes?.author}</AppText>
        <AppText style={styles.pages}>
          {item?.attributes?.preview_pages} pages
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

export default StoreList;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    backgroundColor: Colors.textInputGrey,
    borderRadius: 16,
    padding: moderateSize(10),
    marginBottom: moderateSize(12),
  },
  image: {
    width: moderateSize(80),
    height: moderateSize(100),
    borderRadius: 12,
    marginRight: moderateSize(10),
  },
  textContent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: Fonts.Bold,
    color: Colors.white,
    fontSize: moderateSize(13),
  },
  author: {
    fontFamily: Fonts.Medium,
    color: Colors.deemedWhite,
    fontSize: moderateSize(11),
    marginTop: 2,
  },
  pages: {
    fontFamily: Fonts.Regular,
    color: Colors.deemedWhite,
    fontSize: moderateSize(10),
    marginTop: 4,
  },
  details: {
    fontFamily: Fonts.Regular,
    color: Colors.deemedWhite,
    fontSize: moderateSize(10),
    marginTop: 2,
    opacity: 0.7,
  },
});
