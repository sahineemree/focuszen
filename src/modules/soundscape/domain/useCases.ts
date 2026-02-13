import { mixerStore } from "./mixerStore";
import { clampVolume, type MixPreset, type MixerState, type SoundId, type TrackState } from "./models";

export type PresetRepository = {
  list(): Promise<MixPreset[]>;
  save(preset: MixPreset): Promise<void>;
  remove(id: string): Promise<void>;
};

function getOrCreateTrack(soundId: SoundId): TrackState {
  return (
    mixerStore.getState().tracks[soundId] ?? {
      soundId,
      volume: 1,
      isPlaying: false,
    }
  );
}

export function setSelectedSound(soundId: SoundId) {
  mixerStore.setSelectedSound(soundId);
}

export function toggleTrack(soundId: SoundId) {
  const current = getOrCreateTrack(soundId);
  mixerStore.upsertTrack(soundId, { isPlaying: !current.isPlaying });
}

export function setTrackVolume(soundId: SoundId, volume: number) {
  mixerStore.upsertTrack(soundId, { volume: clampVolume(volume) });
}

export function stopTrack(soundId: SoundId) {
  mixerStore.upsertTrack(soundId, { isPlaying: false });
}

export function snapshotState(): MixerState {
  return mixerStore.getState();
}

export function snapshotTracks(): TrackState[] {
  return Object.values(mixerStore.getState().tracks);
}

export function buildPreset(name: string): MixPreset {
  const now = new Date().toISOString();
  return {
    id: `preset-${Date.now()}`,
    name: name.trim(),
    createdAt: now,
    updatedAt: now,
    tracks: snapshotTracks(),
  };
}

export function applyPreset(preset: MixPreset) {
  const tracks = preset.tracks.reduce<Record<SoundId, TrackState>>((acc, track) => {
    acc[track.soundId] = {
      soundId: track.soundId,
      isPlaying: track.isPlaying,
      volume: clampVolume(track.volume),
    };
    return acc;
  }, {});

  const selectedSoundId = preset.tracks[0]?.soundId ?? mixerStore.getState().selectedSoundId;

  mixerStore.replaceState({
    selectedSoundId,
    tracks,
  });
}

export function createPresetUseCases(repository: PresetRepository) {
  return {
    listPresets: () => repository.list(),
    saveCurrentPreset: async (name: string) => {
      const preset = buildPreset(name);
      await repository.save(preset);
      return preset;
    },
    removePreset: (id: string) => repository.remove(id),
    applyPreset,
  };
}

