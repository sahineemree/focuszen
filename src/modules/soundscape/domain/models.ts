export type SoundId = string;

export type Sound = {
  id: SoundId;
  title: string;
  file: number;
  tags?: string[];
};

export type TrackState = {
  soundId: SoundId;
  volume: number;
  isPlaying: boolean;
};

export type MixerState = {
  selectedSoundId: SoundId;
  tracks: Record<SoundId, TrackState>;
};

export type MixPreset = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tracks: TrackState[];
};

export function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return 1;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

