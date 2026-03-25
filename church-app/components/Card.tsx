import { Colors } from "@/constants/theme";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  return (
    <Pressable onPress={onPress} style={[styles.card, style]}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.textInputGrey,
    borderRadius: 12,
    padding: 16,
    shadowColor: "rgba(25, 16, 21, 0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Card;
