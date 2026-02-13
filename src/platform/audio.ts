import { Audio } from "expo-av";

type TrackEntry = {
  sound: Audio.Sound;
  asset: number;
};

const tracks = new Map<string, TrackEntry>();
const LEGACY_TRACK_ID = "__legacy_single__";
let legacyAsset: number | null = null;

function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return 1;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

async function createTrack(asset: number, volume: number): Promise<Audio.Sound> {
  const { sound } = await Audio.Sound.createAsync(asset, {
    shouldPlay: false,
    isLooping: true,
    volume: clampVolume(volume),
  });
  return sound;
}

async function ensureTrack(soundId: string, asset: number, volume: number): Promise<Audio.Sound> {
  const current = tracks.get(soundId);

  if (current && current.asset === asset) {
    return current.sound;
  }

  if (current) {
    await current.sound.unloadAsync();
    tracks.delete(soundId);
  }

  const sound = await createTrack(asset, volume);
  tracks.set(soundId, { sound, asset });
  return sound;
}

async function play(soundId: string, asset: number, volume = 1) {
  const sound = await ensureTrack(soundId, asset, volume);
  await sound.setVolumeAsync(clampVolume(volume));
  await sound.playAsync();
}

async function pause(soundId: string = LEGACY_TRACK_ID) {
  const current = tracks.get(soundId);
  if (!current) return;
  await current.sound.pauseAsync();
}

async function setVolume(soundId: string, volume: number) {
  const current = tracks.get(soundId);
  if (!current) return;
  await current.sound.setVolumeAsync(clampVolume(volume));
}

async function stop(soundId: string = LEGACY_TRACK_ID) {
  const current = tracks.get(soundId);
  if (!current) return;
  await current.sound.stopAsync();
  await current.sound.setPositionAsync(0);
}

async function unload(soundId: string = LEGACY_TRACK_ID) {
  const current = tracks.get(soundId);
  if (!current) return;
  await current.sound.unloadAsync();
  tracks.delete(soundId);
}

async function unloadAll() {
  const ids = Array.from(tracks.keys());
  await Promise.all(ids.map((id) => unload(id)));
}

async function loadAndPlay(asset: number) {
  legacyAsset = asset;
  await play(LEGACY_TRACK_ID, asset, 1);
}

async function resume() {
  if (legacyAsset == null) return;
  await play(LEGACY_TRACK_ID, legacyAsset, 1);
}

export const audio = {
  play,
  pause,
  setVolume,
  stop,
  unload,
  unloadAll,
  loadAndPlay,
  resume,
};
