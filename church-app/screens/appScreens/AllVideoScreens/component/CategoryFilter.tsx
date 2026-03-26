import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { useGetCategoryQuery } from "@/services/api/public";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { ChevronDown, Folder } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface CategoryFilterProps {
  onSelect: (category: { id: number | null; name: string }) => void;
}

const CategoryFilter = ({ onSelect }: CategoryFilterProps) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data } = useGetCategoryQuery(null);
  const categories = data?.data || [];

  return (
    <View>
      {/* CATEGORY DROPDOWN */}
      <View style={{ position: "relative" }}>
        <Pressable
          style={styles.optionContainer}
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          <View style={styles.optionLeft}>
            <Folder size={moderateSize(16)} color={Colors.white} />
            <AppText style={styles.optionText}>{selectedCategory}</AppText>
          </View>
          <ChevronDown size={moderateSize(16)} color={Colors.white} />
        </Pressable>

        {showCategoryDropdown && (
          <View style={styles.dropdownWrapper}>
            <FlatList
              data={[{ _id: null, name: "All" }, ...categories.map((c: any) => ({ _id: c._id || c.id, name: c.name }))]}
              keyExtractor={(item) => String(item._id ?? "all")}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCategory(item.name);
                    setShowCategoryDropdown(false);
                    onSelect({ id: item._id ?? null, name: item.name });
                  }}
                >
                  <AppText style={styles.dropdownText}>
                    {item.name}
                  </AppText>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default CategoryFilter;

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 25,
    paddingBottom: moderateSize(8),
    gap: 10,
    // backgroundColor: Colors.textInputGrey,
    // paddingHorizontal: moderateSize(15),
    // minWidth: moderateSize(140),
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
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: Colors.textInputGrey,
    borderRadius: 12,
    marginTop: 5,
    zIndex: 10,
    overflow: "hidden",
    width: moderateSize(140),
    paddingVertical: 10,
  },
  dropdownItem: {
    paddingVertical: moderateSize(10),
    paddingHorizontal: moderateSize(10),
  },
  dropdownText: {
    color: Colors.white,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(12),
  },
});
