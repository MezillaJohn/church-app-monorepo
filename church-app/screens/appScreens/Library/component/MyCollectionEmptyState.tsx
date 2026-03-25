import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { BookOpen } from "lucide-react-native"; // nice clean outline icon
import React from "react";
import { StyleSheet, View } from "react-native";

const MyCollectionEmptyState = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <BookOpen size={moderateSize(40)} color={Colors.deemedWhite} />
      </View>
      <AppText style={styles.title}>No Books in Your Collection</AppText>
      <AppText style={styles.subtitle}>
        Start purchasing books to build your personal library.
      </AppText>
    </View>
  );
};

export default MyCollectionEmptyState;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateSize(80),
  },
  iconWrapper: {
    backgroundColor: Colors.textInputGrey,
    borderRadius: 50,
    padding: moderateSize(16),
    marginBottom: moderateSize(16),
  },
  title: {
    fontFamily: Fonts.SemiBold,
    color: Colors.white,
    fontSize: moderateSize(14),
    marginBottom: moderateSize(6),
  },
  subtitle: {
    fontFamily: Fonts.Regular,
    color: Colors.deemedWhite,
    fontSize: moderateSize(12),
    textAlign: "center",
    opacity: 0.8,
    width: "70%",
  },
});
