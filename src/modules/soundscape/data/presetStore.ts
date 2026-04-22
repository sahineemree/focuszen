import { create } from "zustand";
import type { MixPreset } from "../domain/models";
import { presetRepository } from "./presetRepository";

export type PresetStoreState = {
  presets: MixPreset[];
  loading: boolean;
  error: string | null;
  actions: {
    loadPresets(): Promise<void>;
    savePreset(preset: MixPreset): Promise<void>;
    removePreset(id: string): Promise<void>;
  };
};

export const usePresetStore = create<PresetStoreState>((set) => ({
  presets: [],
  loading: false,
  error: null,

  actions: {
    async loadPresets() {
      set({ loading: true, error: null });
      try {
        const presets = await presetRepository.list();
        set({ presets, loading: false });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load presets";
        set({ error: message, loading: false });
        console.error("[PresetStore] loadPresets error:", error);
      }
    },

    async savePreset(preset: MixPreset) {
      set({ error: null });
      try {
        await presetRepository.save(preset);
        const presets = await presetRepository.list();
        set({ presets });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save preset";
        set({ error: message });
        console.error("[PresetStore] savePreset error:", error);
        throw error;
      }
    },

    async removePreset(id: string) {
      set({ error: null });
      try {
        await presetRepository.remove(id);
        const presets = await presetRepository.list();
        set({ presets });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to remove preset";
        set({ error: message });
        console.error("[PresetStore] removePreset error:", error);
        throw error;
      }
    },
  },
}));
