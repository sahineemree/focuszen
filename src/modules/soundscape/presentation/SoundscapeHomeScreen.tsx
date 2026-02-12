import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { audio } from "../../../platform/audio";

export function SoundscapeHomeScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  async function onToggle() {
    if (!hasLoaded) {
      await audio.loadAndPlay(require("../../../../assets/audio/rain.mp3"));
      setHasLoaded(true);
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      await audio.pause();
      setIsPlaying(false);
    } else {
      await audio.resume();
      setIsPlaying(true);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FocusZen</Text>
      <Text style={styles.subtitle}>Soundscape (Sprint 0)</Text>

      <Pressable style={styles.button} onPress={onToggle}>
        <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Play"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 32, fontWeight: "700" },
  subtitle: { fontSize: 16, marginTop: 8, opacity: 0.7 },
  button: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonText: { fontSize: 18, fontWeight: "600" },
});
