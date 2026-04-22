import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { audio } from "../../../platform/audio";
import { usePresetStore } from "../data/presetStore";
import { listAllSounds } from "../data/soundRepository";
import { mixerStore } from "../domain/mixerStore";
import type { MixPreset } from "../domain/models";

export function LibraryScreen() {
  const router = useRouter();
  const { presets, loading, error, actions } = usePresetStore();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [mixerState, setMixerState] = useState(mixerStore.getState());

  useEffect(() => {
    void actions.loadPresets();
  }, [actions]);

  // Subscribe to mixer state changes to know what's playing
  useEffect(() => {
    return mixerStore.subscribe(() => {
      setMixerState(mixerStore.getState());
    });
  }, []);

  const getIsPresetPlaying = (preset: MixPreset): boolean => {
    return preset.tracks.some((track) => {
      return mixerState.tracks[track.soundId]?.isPlaying === true;
    });
  };

  const handleLoadPreset = (preset: MixPreset) => {
    // Clear all existing tracks first
    const currentTracks = mixerStore.getState().tracks;
    Object.keys(currentTracks).forEach((soundId) => {
      mixerStore.removeTrack(soundId);
    });

    // Load tracks into mixer state (all paused initially)
    const tracksRecord = preset.tracks.reduce(
      (acc, track) => ({
        ...acc,
        [track.soundId]: {
          ...track,
          isPlaying: false, // Keep all tracks paused on load
        },
      }),
      {}
    );
    mixerStore.replaceState({
      selectedSoundId: preset.tracks[0]?.soundId ?? "rain",
      tracks: tracksRecord,
    });
    // Go back to home screen
    router.back();
  };

  const handleTogglePresetPlayback = async (preset: MixPreset) => {
    setToggling(preset.id);
    try {
      const sounds = listAllSounds();
      const isPlaying = getIsPresetPlaying(preset);

      // If this preset is already playing, stop it
      if (isPlaying) {
        for (const track of preset.tracks) {
          await audio.pause(track.soundId);
          mixerStore.upsertTrack(track.soundId, { isPlaying: false });
        }
      } else {
        // Stop all other presets first
        const currentTracks = mixerStore.getState().tracks;
        for (const [soundId, track] of Object.entries(currentTracks)) {
          if (track?.isPlaying) {
            await audio.pause(soundId);
            mixerStore.upsertTrack(soundId, { isPlaying: false });
          }
        }

        // Then play THIS preset
        for (const track of preset.tracks) {
          const sound = sounds.find((s) => s.id === track.soundId);
          if (!sound) continue;
          await audio.play(track.soundId, sound.file, track.volume);
          mixerStore.upsertTrack(track.soundId, { isPlaying: true });
        }
      }
    } catch (error) {
      console.error("[LibraryScreen] Toggle preset playback error:", error);
    } finally {
      setToggling(null);
    }
  };

  const handleDeletePreset = async (id: string) => {
    setDeleting(id);
    try {
      await actions.removePreset(id);
    } finally {
      setDeleting(null);
    }
  };

  if (loading && presets.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && presets.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (presets.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.subtitle}>No presets yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library</Text>
      <FlatList
        data={presets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.presetCard,
              getIsPresetPlaying(item) && styles.presetCardPlaying,
              pressed && styles.presetCardPressed,
            ]}
            onPress={() => handleTogglePresetPlayback(item)}
            disabled={deleting === item.id || toggling === item.id}
          >
            <View style={styles.cardContent}>
              <Text style={styles.presetName}>{item.name}</Text>
              <Text style={styles.presetDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.presetSummary}>
                {item.tracks.length} sound{item.tracks.length !== 1 ? "s" : ""}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.deleteButton, pressed && styles.buttonPressed]}
              onPress={() => handleDeletePreset(item.id)}
              disabled={deleting !== null}
            >
              {deleting === item.id ? (
                <ActivityIndicator size="small" color="#FF4444" />
              ) : (
                <MaterialCommunityIcons name="trash-can" size={24} color="#FF4444" />
              )}
            </Pressable>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 32,
  },
  errorText: {
    fontSize: 14,
    color: "#FF4444",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 24,
  },
  presetCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  presetCardPlaying: {
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  presetCardPressed: {
    backgroundColor: "#E8E8E8",
  },
  cardContent: {
    flex: 1,
  },
  presetName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  presetDate: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 4,
  },
  presetSummary: {
    fontSize: 12,
    opacity: 0.7,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 12,
  },
  playButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  buttonPressed: {
    opacity: 0.6,
  },
});
