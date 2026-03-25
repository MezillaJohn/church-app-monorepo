import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface AnimatedListItemProps {
  children: React.ReactNode;
  index: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  index,
  delay = 50,
  style,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * delay)
        .duration(400)
        .springify()
        .damping(18)}
      style={style}
    >
      {children}
    </Animated.View>
  );
};
