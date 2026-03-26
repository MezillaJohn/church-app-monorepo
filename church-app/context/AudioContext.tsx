import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useVideoPlayer } from "expo-video";
import { setAudioModeAsync } from "expo-audio";
import type { Sermon } from "@/services/api/sermon/type";

interface AudioContextType {
    player: ReturnType<typeof useVideoPlayer> | null;
    currentSermon: Sermon | null;
    playSermon: (sermon: Sermon, audioUrl: string) => void;
    togglePlay: () => void;
    pause: () => void;
    seekTo: (seconds: number) => void;
    closePlayer: () => void;
    isPlaying: boolean;
    duration: number;
    position: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);

    useEffect(() => {
        setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: true,
            interruptionMode: "doNotMix",
        });
    }, []);

    // Create a single, stable player with null source — it lives for the app's lifetime
    const player = useVideoPlayer(null, (p) => {
        p.loop = false;
        p.staysActiveInBackground = true;
        p.showNowPlayingNotification = true;
        p.audioMixingMode = "doNotMix";
    });

    useEffect(() => {
        if (!player) return;

        const interval = setInterval(() => {
            try {
                setPosition(player.currentTime ?? 0);
                setDuration(player.duration ?? 0);
            } catch {
                // Player may not be ready yet
            }
        }, 500);

        return () => clearInterval(interval);
    }, [player]);

    useEffect(() => {
        if (!player) return;

        const playingSubscription = player.addListener("playingChange", (event) => {
            setIsPlaying(event.isPlaying);
        });

        const statusSubscription = player.addListener("statusChange", (event) => {
            if (event.status === "readyToPlay") {
                setDuration(player.duration ?? 0);
                // Auto-play when the new source is ready
                player.play();
            }
        });

        return () => {
            playingSubscription.remove();
            statusSubscription.remove();
        };
    }, [player]);

    const playSermon = useCallback((sermon: Sermon, url: string) => {
        if (!player) return;

        const metadata = {
            title: sermon.title || "Unknown Title",
            artist: sermon.speaker || "Unknown Speaker",
            artwork: sermon.thumbnailUrl?.startsWith("http") ? sermon.thumbnailUrl : undefined,
        };

        const uri = url.startsWith("file://")
            ? url.replace("file://", "")
            : url;

        setCurrentSermon(sermon);
        setPosition(0);
        setDuration(0);

        player.replace({ uri, metadata });
    }, [player]);

    const togglePlay = useCallback(() => {
        if (!player) return;
        if (isPlaying) {
            player.pause();
        } else {
            // If audio ended (position at or near duration), restart from beginning
            if (duration > 0 && position >= duration - 0.5) {
                player.currentTime = 0;
            }
            player.play();
        }
    }, [player, isPlaying, duration, position]);

    const pause = useCallback(() => {
        player?.pause();
    }, [player]);

    const seekTo = useCallback((seconds: number) => {
        if (player) {
            player.currentTime = seconds;
        }
    }, [player]);

    const closePlayer = useCallback(() => {
        if (player) {
            player.pause();
            player.replace(null);
        }
        setCurrentSermon(null);
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
    }, [player]);

    return (
        <AudioContext.Provider
            value={{
                player,
                currentSermon,
                playSermon,
                togglePlay,
                pause,
                seekTo,
                closePlayer,
                isPlaying,
                duration,
                position,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
};
