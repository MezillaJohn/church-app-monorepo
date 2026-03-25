import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { Search } from "lucide-react-native";
import React from "react";
import { StyleSheet, TextInput, View, ViewStyle } from "react-native";

interface AppSearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

const AppSearchBar: React.FC<AppSearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChangeText,
  style,
  icon,
}) => {
  return (
    <View style={[styles.searchContainer, style]}>
      {icon ?? (
        <Search
          size={20}
          color={Colors.deemedWhite}
          style={styles.searchIcon}
        />
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.muted}
        value={value}
        onChangeText={onChangeText}
        style={styles.searchInput}
      />
    </View>
  );
};

export default AppSearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.textInputGrey,
    borderRadius: 25,
    // marginHorizontal: moderateSize(15),
    marginTop: moderateSize(20),
    paddingHorizontal: moderateSize(15),
    paddingVertical: moderateSize(10),
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
  },
});
