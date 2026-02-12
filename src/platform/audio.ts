import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

export const audio = {
  async loadAndPlay(asset: number) {
    if (sound) {
      await sound.unloadAsync();
      sound = null;
    }
    const { sound: created } = await Audio.Sound.createAsync(asset, { shouldPlay: true });
    sound = created;
  },

  async pause() {
    if (!sound) return;
    await sound.pauseAsync();
  },

  async resume() {
    if (!sound) return;
    await sound.playAsync();
  },

  async stop() {
    if (!sound) return;
    await sound.stopAsync();
  },
};
