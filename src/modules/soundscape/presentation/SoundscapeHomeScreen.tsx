import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { audio } from "../../../platform/audio";
import { listAllSounds } from "../data/soundRepository";
import type { SoundId, TrackState } from "../domain/models";
import { mixerStore } from "../domain/mixerStore";
import { setTrackVolume, toggleTrack } from "../domain/useCases";
import { SoundTile } from "./components/SoundTile";

function getInactiveTrack(soundId: SoundId): TrackState {
  return { soundId, isPlaying: false, volume: 1 };
}

export function SoundscapeHomeScreen() {
  const sounds = useMemo(() => listAllSounds(), []);
  const [tracks, setTracks] = useState<Record<SoundId, TrackState>>(mixerStore.getState().tracks);
  const prevTracksRef = useRef<Record<SoundId, TrackState>>({});

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
});
