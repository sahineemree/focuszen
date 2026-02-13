import type { Sound, SoundId } from "../domain/models";
import { SOUNDS } from "./sounds";

export type SoundRepository = {
  listAll(): Sound[];
  getById(soundId: SoundId): Sound | undefined;
};

const SOUND_CATALOG: Sound[] = SOUNDS.map((sound) => ({
  id: sound.id,
  title: sound.title,
  file: sound.file,
  tags: sound.tags,
}));

export const soundRepository: SoundRepository = {
  listAll() {
    return SOUND_CATALOG;
  },
  getById(soundId) {
    return SOUND_CATALOG.find((sound) => sound.id === soundId);
  },
};

// Backward-compatible helpers for existing UI call sites.
export function listAllSounds(): Sound[] {
  return soundRepository.listAll();
}

export function getSoundById(soundId: SoundId): Sound | undefined {
  return soundRepository.getById(soundId);
}
