import { Screen } from "@/components/Screen";
import AllAudioScreens from "@/screens/appScreens/AllAudioScreens/AllAudioScreens";
import React from "react";

const allAudioSermons = () => {
  return (
    <Screen safeAreaEdges={["top", "bottom"]}>
      <AllAudioScreens />
    </Screen>
  );
};

export default allAudioSermons;
