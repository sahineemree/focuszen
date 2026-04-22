import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MixPreset } from "../domain/models";

const STORAGE_KEY = "@focuszen:presets";

export type PresetRepository = {
  list(): Promise<MixPreset[]>;
  save(preset: MixPreset): Promise<void>;
  remove(id: string): Promise<void>;
};

export const presetRepository: PresetRepository = {
  async list(): Promise<MixPreset[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("[PresetRepository] list() error:", error);
      return [];
    }
  },

  async save(preset: MixPreset): Promise<void> {
    try {
      const existing = await presetRepository.list();
      const updated = [preset, ...existing.filter((item) => item.id !== preset.id)];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("[PresetRepository] save() error:", error);
      throw error;
    }
  },

  async remove(id: string): Promise<void> {
    try {
      const existing = await presetRepository.list();
      const updated = existing.filter((item) => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("[PresetRepository] remove() error:", error);
      throw error;
    }
  },
};
