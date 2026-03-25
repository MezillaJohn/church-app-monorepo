// src/components/Input/TextInputField.tsx
import React, { forwardRef } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { AppText } from "@/components/AppText";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

type Accessory = React.ComponentType<{
  onPress?: () => void;
  style?: ViewStyle;
}>;

export interface TextInputFieldProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string | null;
  helper?: string | null;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftAccessory?: Accessory | null;
  rightAccessory?: Accessory | null;
  showClear?: boolean; // shows an X to clear the field
}

const TextInputField = forwardRef<TextInput, TextInputFieldProps>(
  (props, ref) => {
    const {
      label,
      error,
      helper,
      containerStyle,
      inputStyle,
      leftAccessory: LeftAccessory,
      rightAccessory: RightAccessory,
      showClear,
      value,
      onChangeText,
      placeholder,
      secureTextEntry,
      keyboardType,
      multiline,
      numberOfLines,
      maxLength,
      editable = true,
      ...rest
    } = props;

    const handleClear = () => {
      if (onChangeText) onChangeText("");
    };

    return (
      <View style={[styles.wrapper, containerStyle]}>
        {label ? <AppText style={styles.label}>{label}</AppText> : null}

        <View
          style={[
            styles.inputContainer,
            error ? styles.inputContainerError : null,
            multiline ? { paddingVertical: moderateSize(8) } : null,
          ]}
        >
          {LeftAccessory ? (
            <View style={styles.leftAccessory}>
              <LeftAccessory />
            </View>
          ) : null}

          <TextInput
            ref={ref}
            placeholder={placeholder}
            placeholderTextColor={whiteOpacity("0.3")}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            editable={editable}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            style={[
              styles.input,
              inputStyle,
              multiline ? { textAlignVertical: "top" } : null,
            ]}
            {...rest}
          />

          {showClear && !!value ? (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppText style={styles.clearText}>✕</AppText>
            </TouchableOpacity>
          ) : null}

          {RightAccessory ? (
            <View style={styles.rightAccessory}>
              <RightAccessory />
            </View>
          ) : null}
        </View>

        {error ? (
          <AppText style={styles.errorText}>{error}</AppText>
        ) : helper ? (
          <AppText style={styles.helperText}>{helper}</AppText>
        ) : null}
      </View>
    );
  }
);

export default TextInputField;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: moderateSize(12),
  },
  label: {
    fontFamily: Fonts.Medium,
    color: Colors.deemedWhite,
    fontSize: moderateSize(12),
    marginBottom: moderateSize(8),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: whiteOpacity("0.06"),
    borderRadius: moderateSize(14),
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: whiteOpacity("0.08"),
    paddingHorizontal: moderateSize(14),
    height: moderateSize(50),
  },
  inputContainerError: {
    borderColor: Colors.red,
  },
  leftAccessory: {
    marginRight: moderateSize(8),
    justifyContent: "center",
    alignItems: "center",
  },
  rightAccessory: {
    marginLeft: moderateSize(8),
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(14),
    paddingVertical: 0, // keeps vertical size consistent on single-line inputs
  },
  clearButton: {
    marginLeft: moderateSize(8),
    justifyContent: "center",
    alignItems: "center",
  },
  clearText: {
    color: whiteOpacity("0.5"),
    fontSize: moderateSize(14),
  },
  helperText: {
    marginTop: moderateSize(6),
    color: Colors.muted,
    fontSize: moderateSize(12),
  },
  errorText: {
    marginTop: moderateSize(6),
    color: Colors.red,
    fontSize: moderateSize(12),
  },
});
