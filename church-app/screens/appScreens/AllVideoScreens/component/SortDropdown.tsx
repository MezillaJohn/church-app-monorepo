import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { ChevronDown, ListFilter } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface SortDropdownProps {
  selectedSort?: "asc" | "desc";
  onSelectSort?: (value: "asc" | "desc") => void;
}

const sortOptions = [
  { label: "Ascending (A → Z)", value: "asc" },
  { label: "Descending (Z → A)", value: "desc" },
];

const SortDropdown: React.FC<SortDropdownProps> = ({
  selectedSort = "desc",
  onSelectSort,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedLabel =
    sortOptions.find((opt) => opt.value === selectedSort)?.label ||
    "Descending (Z → A)";

  return (
    <View
      style={{
        position: "relative",
      }}
    >
      <Pressable
        style={styles.optionContainer}
        onPress={() => setShowDropdown((prev) => !prev)}
      >
        <View style={styles.optionLeft}>
          <ListFilter size={moderateSize(16)} color={Colors.white} />
          <AppText style={styles.optionText}>{selectedLabel}</AppText>
        </View>
        <ChevronDown size={moderateSize(16)} color={Colors.white} />
      </Pressable>

      {showDropdown && (
        <View style={styles.dropdownWrapper}>
          <FlatList
            data={sortOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  onSelectSort?.(item.value as "asc" | "desc");
                  setShowDropdown(false);
                }}
              >
                <AppText style={styles.dropdownText}>{item.label}</AppText>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default SortDropdown;

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 25,
    // paddingVertical: moderateSize(8),
    gap: 10,
    // backgroundColor: Colors.textInputGrey,
    // paddingHorizontal: moderateSize(15),
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionText: {
    color: Colors.white,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
  },
  dropdownWrapper: {
    position: "absolute",
    top: "110%",
    left: 0,
    right: 0,
    backgroundColor: Colors.textInputGrey,
    borderRadius: 12,
    marginTop: 5,
    zIndex: 10,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: moderateSize(8),
    paddingHorizontal: moderateSize(10),
  },
  dropdownText: {
    color: Colors.white,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(12),
  },
});
