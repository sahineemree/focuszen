import { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { audio } from "../../../platform/audio";
import { usePresetStore } from "../data/presetStore";
import { listAllSounds } from "../data/soundRepository";
import { mixerStore } from "../domain/mixerStore";
import type { MixPreset, SoundId, TrackState } from "../domain/models";
import { setTrackVolume, toggleTrack } from "../domain/useCases";
import { SoundTile } from "./components/SoundTile";

function getInactiveTrack(soundId: SoundId): TrackState {
  return { soundId, isPlaying: false, volume: 1 };
}

export function SoundscapeHomeScreen() {
  const sounds = useMemo(() => listAllSounds(), []);
  const [tracks, setTracks] = useState<Record<SoundId, TrackState>>(
    mixerStore.getState().tracks
  );
  const prevTracksRef = useRef<Record<SoundId, TrackState>>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { actions } = usePresetStore();

  useEffect(() => {
    return mixerStore.subscribe(() => {
      setTracks(mixerStore.getState().tracks);
    });
  }, []);

  useEffect(() => {
    const prevTracks = prevTracksRef.current;

    for (const sound of sounds) {
      const prevTrack = prevTracks[sound.id] ?? getInactiveTrack(sound.id);
      const nextTrack = tracks[sound.id] ?? getInactiveTrack(sound.id);

      if (nextTrack.isPlaying && !prevTrack.isPlaying) {
        void audio.play(sound.id, sound.file, nextTrack.volume);
      } else if (!nextTrack.isPlaying && prevTrack.isPlaying) {
        void audio.pause(sound.id);
      } else if (nextTrack.isPlaying && nextTrack.volume !== prevTrack.volume) {
        void audio.setVolume(sound.id, nextTrack.volume);
      }
    }

    prevTracksRef.current = tracks;
  }, [sounds, tracks]);

  const getActiveSoundsSummary = (): string => {
    const activeTracks = Object.values(tracks).filter((t) => t.isPlaying);
    if (activeTracks.length === 0) {
      return "No sounds selected";
    }

    const soundsWithVolumes = activeTracks
      .map((track) => {
        const sound = sounds.find((s) => s.id === track.soundId);
        const volumePercent = Math.round(track.volume * 100);
        return `${sound?.title} (${volumePercent}%)`;
      })
      .join(", ");

    return `${activeTracks.length} sound${activeTracks.length !== 1 ? "s" : ""}: ${soundsWithVolumes}`;
  };

  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      Alert.alert("Name Required", "Please enter a preset name");
      return;
    }

    const activeTracks = Object.values(tracks).filter((t) => t.isPlaying);
    if (activeTracks.length === 0) {
      Alert.alert("No Sounds", "Please enable at least one sound before saving");
      return;
    }

    setIsSaving(true);
    try {
      const preset: MixPreset = {
        id: Date.now().toString(),
        name: presetName.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tracks: activeTracks,
      };

      await actions.savePreset(preset);

      Alert.alert("Success", `Preset "${preset.name}" saved successfully`);
      setModalVisible(false);
      setPresetName("");
    } catch (error) {
      Alert.alert("Error", "Failed to save preset. Please try again.");
      console.error("[SoundscapeHomeScreen] save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FocusZen</Text>
      <Text style={styles.subtitle}>Mixer</Text>

      <FlatList
        data={sounds}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const track = tracks[item.id];
          return (
            <SoundTile
              title={item.title}
              isPlaying={Boolean(track?.isPlaying)}
              volume={track?.volume ?? 1}
              onToggle={() => toggleTrack(item.id)}
              onVolumeChange={(volume) => setTrackVolume(item.id, volume)}
            />
          );
        }}
      />

      <Pressable style={styles.saveButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.saveButtonText}>Save Mix</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          if (!isSaving) {
            setModalVisible(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Mix Preset</Text>

            <TextInput
              style={styles.input}
              placeholder="Preset name (e.g., Night Study)"
              placeholderTextColor="#999"
              value={presetName}
              onChangeText={setPresetName}
              editable={!isSaving}
              maxLength={50}
            />

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Will save:</Text>
              <Text style={styles.summaryText}>{getActiveSoundsSummary()}</Text>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  pressed && styles.buttonPressed,
                  isSaving && styles.buttonDisabled,
                ]}
                onPress={() => setModalVisible(false)}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.saveButtonModal,
                  pressed && styles.buttonPressed,
                  isSaving && styles.buttonDisabled,
                ]}
                onPress={handleSavePreset}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonModalText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 24, paddingHorizontal: 16 },
  title: { fontSize: 32, fontWeight: "700", textAlign: "center" },
  subtitle: { fontSize: 16, marginTop: 8, opacity: 0.7, textAlign: "center" },
  grid: {
    paddingTop: 18,
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  summaryBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e8e8e8",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  saveButtonModal: {
    backgroundColor: "#007AFF",
  },
  saveButtonModalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
