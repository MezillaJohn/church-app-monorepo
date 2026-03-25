import { AppText } from "@/components/AppText";
import Switch from "@/components/Switch";
import { $styles } from "@/constants/styles";
import { NestedEvent } from "@/services/api/public/types";
import React from "react";
import { View } from "react-native";

const Reminder = ({ event }: { event: NestedEvent }) => {
  return (
    <View
      style={[
        $styles.flexCenterBetween,
        $styles.borderBottom,
        { paddingTop: 15 },
      ]}
    >
      <AppText>Set a reminder</AppText>
      <Switch isOn={false} />
    </View>
  );
};

export default Reminder;
