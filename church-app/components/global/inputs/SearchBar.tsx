import React from "react";
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { Search, X } from "lucide-react-native";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { Pressable } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Search size={moderateSize(16)} color={Colors.textMuted} strokeWidth={1.8} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textDisabled}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <X size={moderateSize(14)} color={Colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: whiteOpacity("0.04"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.08"),
    borderRadius: 12,
    borderCurve: "continuous",
    paddingHorizontal: moderateSize(12),
    height: moderateSize(42),
    gap: moderateSize(8),
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(14),
  },
});
