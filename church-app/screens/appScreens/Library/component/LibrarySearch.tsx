import AppSearchBar from "@/components/AppBarSearch";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React from "react";

const LibrarySearch = () => {
  return (
    <AppSearchBar
      style={{ marginHorizontal: moderateSize(15) }}
      placeholder="Search messages, devotionals..."
    />
  );
};

export default LibrarySearch;
