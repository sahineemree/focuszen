import type { MixerState, SoundId, TrackState } from "./models";

type Listener = () => void;

function createDefaultTrack(soundId: SoundId): TrackState {
  return {
    soundId,
    volume: 1,
    isPlaying: false,
  };
}

let state: MixerState = {
  selectedSoundId: "rain",
  tracks: {},
};

const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const mixerStore = {
  getState(): MixerState {
    return state;
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  setSelectedSound(soundId: SoundId) {
    if (state.selectedSoundId === soundId) return;
    state = {
      ...state,
      selectedSoundId: soundId,
    };
    notify();
  },

  upsertTrack(soundId: SoundId, patch: Partial<Omit<TrackState, "soundId">>) {
    const current = state.tracks[soundId] ?? createDefaultTrack(soundId);
    const next: TrackState = {
      ...current,
      ...patch,
      soundId,
    };
    state = {
      ...state,
      tracks: {
        ...state.tracks,
        [soundId]: next,
      },
    };
    notify();
  },

  removeTrack(soundId: SoundId) {
    if (!(soundId in state.tracks)) return;
    const rest = { ...state.tracks };
    delete rest[soundId];
    state = {
      ...state,
      tracks: rest,
    };
    notify();
  },

  replaceState(next: MixerState) {
    state = next;
    notify();
  },

  reset(initialSelectedSoundId: SoundId = "rain") {
    state = {
      selectedSoundId: initialSelectedSoundId,
      tracks: {},
    };
    notify();
  },
};
