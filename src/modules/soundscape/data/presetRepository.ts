import type { MixPreset } from "../domain/models";

export type PresetRepository = {
  list(): Promise<MixPreset[]>;
  save(preset: MixPreset): Promise<void>;
  remove(id: string): Promise<void>;
};

// Sprint 1 stub: in-memory preset storage. Replace with persistent storage later.
let presets: MixPreset[] = [];

export const presetRepository: PresetRepository = {
  async list(): Promise<MixPreset[]> {
    return presets;
  },

  async save(preset: MixPreset): Promise<void> {
    presets = [preset, ...presets.filter((item) => item.id !== preset.id)];
  },

  async remove(id: string): Promise<void> {
    presets = presets.filter((item) => item.id !== id);
  },
};
