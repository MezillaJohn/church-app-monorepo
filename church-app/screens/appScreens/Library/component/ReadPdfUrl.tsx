import BackIcon from "@/assets/svg/BackIcon";
import { Colors } from "@/constants/theme";
import { useAppAlert } from "@/context/AlertContext";
import { moderateSize } from "@/utils/useResponsiveStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";

const ReadPdfUrl = () => {
  const { alert } = useAppAlert();
  const pdfRef = useRef<Pdf>(null);

  const { bookUrl } = useLocalSearchParams<{ bookUrl: string }>();
  const storageKey = `pdf_progress_${encodeURIComponent(bookUrl)}`;

  const [initialPage, setInitialPage] = useState<number | null>(null);

  const lastPageRef = useRef(1);
  const totalPagesRef = useRef(0);


  const source = {
    uri: bookUrl,
    cache: true,
  };

  // ✅ Load once
  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem(storageKey);
      if (saved) {
        const { page } = JSON.parse(saved);
        lastPageRef.current = page;
        setInitialPage(page); // ONLY ONCE

        if (page > 1) {
          alert("Kick off from where you left off.");
        }
      } else {
        setInitialPage(1);
      }
    };
    load();
  }, []);

  // ✅ Save silently
  const saveProgress = async () => {
    await AsyncStorage.setItem(
      storageKey,
      JSON.stringify({
        page: lastPageRef.current,
        totalPages: totalPagesRef.current,
      })
    );
  };

  // ✅ Save when leaving screen
  useEffect(() => {
    return () => {
      saveProgress();
    };
  }, []);

  if (initialPage === null) return null; // prevent re-mount

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }} edges={["top"]}>
      <StatusBar backgroundColor="#000" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <BackIcon width={moderateSize(20)} height={moderateSize(20)} />
        </Pressable>
      </View>

      <Pdf
        ref={pdfRef}
        source={source}
        page={initialPage} // 🔒 SET ONCE
        trustAllCerts={false}
        enablePaging={false}
        onLoadComplete={(pages) => {
          totalPagesRef.current = pages;
        }}
        onPageChanged={(page) => {
          lastPageRef.current = page;
        }}
        style={styles.pdf}

      />
    </SafeAreaView>
  );
};

export default ReadPdfUrl;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.black,
    paddingHorizontal: moderateSize(15),
    paddingVertical: moderateSize(10),
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: Colors.white,
  },
});
