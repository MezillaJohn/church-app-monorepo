import { AppText } from "@/components/AppText";
import { Colors } from "@/constants/theme";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

type Props = {
  title?: string;
  message?: string;
  buttonLabel?: string;
  onPress?: () => void;
  styleWrapper?: ViewStyle;
};

const EmptyState = ({
  title = "No Data Found",
  message = "There’s nothing here yet. Add a new item to get started.",
  buttonLabel,
  onPress,
  styleWrapper,
}: Props) => {
  return (
    <View style={[styles.container, styleWrapper]}>
      <View style={styles.iconWrapper}>
        <AntDesign name="inbox" size={40} color={Colors.primary} />
      </View>

      <AppText style={styles.title}>{title}</AppText>
      <AppText style={styles.message}>{message}</AppText>

      {buttonLabel && onPress && (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <AppText style={styles.buttonText}>{buttonLabel}</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 45,
    backgroundColor: "rgba(183,149,11,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  message: {
    fontSize: 12,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
    width: "75%",
  },
  button: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
  },
});
