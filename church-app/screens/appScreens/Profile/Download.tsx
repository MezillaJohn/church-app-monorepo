import AppBackHeader from "@/components/AppBackHeader";
import { AppText } from "@/components/AppText";
import EmptyState from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { Colors, Fonts } from "@/constants/theme";
import AudioSermonCard from "@/screens/appScreens/AllAudioScreens/component/AudioSermonCard";
import {
  DownloadedSermon,
  getAllDownloads,
  searchDownloads,
} from "@/services/database/downloadDatabase";
import { deleteDownloadedSermon } from "@/services/download/downloadService";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Search, Trash2, X } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DownloadsScreen() {
  const [downloads, setDownloads] = useState<DownloadedSermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const params = {
    search: "",
    sort: "desc" as const,
    category_id: "",
  };

  const loadDownloads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllDownloads();
      setDownloads(data);
    } catch (error) {
      console.error("Error loading downloads:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDownloads();
    }, [loadDownloads])
  );

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      const data = await getAllDownloads();
      setDownloads(data);
    } else {
      setIsSearching(true);
      try {
        const results = await searchDownloads(query);
        setDownloads(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }
  }, []);

  const handleClearSearch = () => {
    setSearchQuery("");
    loadDownloads();
  };

  const handleDeleteDownload = useCallback(
    (sermonId: string, title: string) => {
      Alert.alert(
        "Delete Download",
        `Are you sure you want to delete "${title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await deleteDownloadedSermon(sermonId);
              loadDownloads();
            },
          },
        ]
      );
    },
    [loadDownloads]
  );

  const parseSermonFromDownload = (download: DownloadedSermon): any => {
    try {
      const parsed = JSON.parse(download.sermon_json);
      // Ensure _id is present for navigation
      if (!parsed._id && parsed.id) parsed._id = String(parsed.id);
      if (!parsed.id && parsed._id) parsed.id = parsed._id;
      return parsed;
    } catch {
      return {
        _id: download.sermon_id,
        id: download.sermon_id,
        title: download.title,
        speaker: download.speaker,
        audioFileUrl: download.local_audio_uri,
        thumbnailUrl: download.thumbnail_url,
        duration: download.duration,
        description: "",
        type: "audio",
        createdAt: download.downloaded_at,
      };
    }
  };

  const renderItem = ({ item }: { item: DownloadedSermon }) => {
    const sermon = parseSermonFromDownload(item);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.cardWrapper}>
          <AudioSermonCard
            item={sermon}
            params={params}
            isDownloaded={true}
            localUri={item.local_audio_uri}
          />
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteDownload(item.sermon_id, item.title)}
        >
          <Trash2 size={moderateSize(16)} color={Colors.red} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient colors={Colors.gradientDeep} style={styles.container}>
      <Screen backgroundColor="transaperent" safeAreaEdges={["bottom", "top"]}>
        <AppBackHeader text="Downloads" style={{ marginBottom: 20 }} />

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={18} color={Colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search downloads..."
              placeholderTextColor={Colors.muted}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <X size={18} color={Colors.muted} />
              </TouchableOpacity>
            )}
            {isSearching && (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : downloads.length === 0 ? (
          <EmptyState
            title={searchQuery ? "No results found" : "No Downloads Yet"}
            message={
              searchQuery
                ? "Try a different search term"
                : "Download sermons to listen offline"
            }
          />
        ) : (
          <>
            <AppText style={styles.countText}>
              {downloads.length} sermon{downloads.length !== 1 ? "s" : ""}{" "}
              downloaded
            </AppText>
            <FlatList
              data={downloads}
              keyExtractor={(item) => item.sermon_id.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </>
        )}
      </Screen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: moderateSize(16),
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.textInputGrey,
    borderRadius: moderateSize(10),
    paddingHorizontal: moderateSize(12),
    paddingVertical: moderateSize(10),
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateSize(8),
    color: Colors.white,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(14),
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    color: Colors.muted,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(12),
    marginBottom: moderateSize(8),
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardWrapper: {
    flex: 1,
  },
  deleteButton: {
    padding: moderateSize(8),
  },
});
