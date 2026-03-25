import { AppText } from "@/components/AppText";
import CustomSheet from "@/components/CustomSheet";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface BottomSheetPickerProps {
  label: string;
  value?: string;
  options: string[];
  onSelect: (value: string) => void;
  error?: string;
  height?: number;
}

const PAGE_SIZE = 20;

const BottomSheetPicker: React.FC<BottomSheetPickerProps> = ({
  label,
  value,
  options,
  onSelect,
  error,
  height,
}) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const listRef = useRef<FlatList>(null);

  // 🔍 Filtered options using search
  const filtered = useMemo(() => {
    return options.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  // 📌 Paginated output
  const paginated = useMemo(() => {
    return filtered.slice(0, page * PAGE_SIZE);
  }, [filtered, page]);

  const handleSelect = (item: string) => {
    onSelect(item);
    setVisible(false);
    setSearch("");
    setPage(1);
  };

  // Auto-scroll to selected
  useEffect(() => {
    if (visible && value) {
      setTimeout(() => {
        const index = paginated.findIndex((i) => i === value);
        if (index !== -1) {
          listRef.current?.scrollToIndex({ index, animated: true });
        }
      }, 200);
    }
  }, [visible]);

  const loadMore = () => {
    if (paginated.length < filtered.length) {
      setPage((prev) => prev + 1);
    }
  };

  const resetSheet = () => {
    setVisible(false);
    setSearch("");
    setPage(1);
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{label}</AppText>

      <TouchableOpacity
        style={[styles.inputBox, error ? { borderColor: Colors.red } : null]}
        onPress={() => setVisible(true)}
      >
        <AppText style={value ? styles.value : styles.placeholder}>
          {value || `Select ${label}`}
        </AppText>
      </TouchableOpacity>

      {error ? <AppText style={styles.errorText}>{error}</AppText> : null}

      <CustomSheet
        titleColor="white"
        visible={visible}
        onClose={resetSheet}
        title={`Select ${label}`}
        height={height ?? 800}
      >
        {/* Search Input */}
        {label === "Country" && (
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor={whiteOpacity("0.3")}
              value={search}
              onChangeText={(text) => {
                setSearch(text);
                setPage(1); // reset pagination whenever search changes
              }}
            />
          </View>
        )}

        <FlatList
          ref={listRef}
          data={paginated}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContainer}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable style={styles.option} onPress={() => handleSelect(item)}>
              <AppText
                style={[
                  styles.optionText,
                  item === value && styles.selectedOption,
                ]}
              >
                {item}
              </AppText>
            </Pressable>
          )}
          ListEmptyComponent={
            <AppText style={styles.noResult}>No result found</AppText>
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
        />
      </CustomSheet>
    </View>
  );
};

export default BottomSheetPicker;

const styles = StyleSheet.create({
  container: {
    marginBottom: moderateSize(16),
  },
  label: {
    fontSize: moderateSize(12),
    color: Colors.white,
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: whiteOpacity("0.08"),
    borderRadius: moderateSize(10),
    borderWidth: 1,
    borderColor: whiteOpacity("0.15"),
    paddingVertical: moderateSize(12),
    paddingHorizontal: moderateSize(14),
  },
  placeholder: {
    color: whiteOpacity("0.4"),
    fontSize: moderateSize(12),
  },
  value: {
    color: Colors.white,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
  },
  searchBox: {
    paddingHorizontal: moderateSize(16),
    marginVertical: moderateSize(10),
  },
  searchInput: {
    backgroundColor: whiteOpacity("0.1"),
    paddingVertical: moderateSize(10),
    paddingHorizontal: moderateSize(14),
    borderRadius: moderateSize(10),
    fontSize: moderateSize(14),
    color: Colors.white,
  },
  listContainer: {
    paddingHorizontal: moderateSize(15),
    paddingBottom: moderateSize(20),
  },
  option: {
    paddingVertical: moderateSize(12),
    borderBottomWidth: 0.3,
    borderBottomColor: whiteOpacity("0.1"),
  },
  optionText: {
    fontSize: moderateSize(15),
    color: Colors.white,
  },
  selectedOption: {
    color: Colors.primary,
    fontFamily: Fonts.SemiBold,
  },
  errorText: {
    color: Colors.red,
    fontSize: moderateSize(11),
    marginTop: 4,
    marginLeft: 2,
  },
  noResult: {
    marginTop: 30,
    textAlign: "center",
    color: whiteOpacity("0.4"),
  },
});
