import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { Filter } from "lucide-react-native";
import React, { useRef } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  search: string;
  setSearch: (text: string) => void;
  filter: "live" | "upcoming" | undefined;
  setFilter: (f: "live" | "upcoming" | undefined) => void;
  showDropdown: boolean;
  setShowDropdown: (state: boolean) => void;
};

const EventFilterBar = ({
  showDropdown,
  setShowDropdown,
  search,
  setSearch,
  filter,
  setFilter,
}: Props) => {
  const dropdownRef = useRef<View>(null);

  return (
    <View style={styles.row}>
      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search for keywords..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Filter size={moderateSize(14)} color={Colors.white} />
      </TouchableOpacity>

      {/* Dropdown */}
      {showDropdown && (
        <View style={styles.dropdown} ref={dropdownRef}>
          {[
            { label: "All", value: undefined },
            { label: "Live", value: "live" },
            { label: "Upcoming", value: "upcoming" },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => {
                setFilter(item.value as any);
                setShowDropdown(false);
              }}
              style={[
                styles.dropdownItem,
                filter === item.value && {
                  backgroundColor: Colors.primary,
                },
              ]}
            >
              <AppText
                style={[
                  styles.dropdownText,
                  filter === item.value && {
                    color: Colors.black,
                  },
                ]}
              >
                {item.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default EventFilterBar;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateSize(16),
  },
  searchBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: moderateSize(11),
    marginRight: moderateSize(10),
  },
  searchInput: {
    color: Colors.white,
    paddingVertical: moderateSize(10),
    fontSize: moderateSize(12),
  },
  filterButton: {
    width: moderateSize(38),
    borderRadius: 10,
    paddingVertical: moderateSize(10),
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: moderateSize(45),
    backgroundColor: Colors.textInputGrey,
    paddingVertical: 6,
    width: moderateSize(120),
    borderRadius: 10,
    zIndex: 1000, // Increase this
    elevation: 20, // For Android
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    color: Colors.white,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(12),
  },
});
