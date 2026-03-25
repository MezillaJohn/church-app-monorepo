import { Screen } from "@/components/Screen";
import Tv from "@/screens/appScreens/Tv/Tv";
import React from "react";

const tv = () => {
  return (
    <Screen preset="scroll">
      <Tv />
    </Screen>
  );
};

export default tv;
