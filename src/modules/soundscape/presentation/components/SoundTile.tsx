import Slider from "@react-native-community/slider";
import { Pressable, StyleSheet, Text, View } from "react-native";

type SoundTileProps = {
  title: string;
  isPlaying: boolean;
  volume: number;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
};

export function SoundTile({ title, isPlaying, volume, onToggle, onVolumeChange }: SoundTileProps) {
  return (
    <View style={styles.wrapper}>
      <Pressable style={[styles.tile, isPlaying && styles.tileActive]} onPress={onToggle}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>{isPlaying ? "Playing" : "Tap to play"}</Text>
      </Pressable>

      {isPlaying ? (
        <View style={styles.sliderWrap}>
          <Slider minimumValue={0} maximumValue={1} value={volume} onValueChange={onVolumeChange} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 8,
  },
  tile: {
    minHeight: 96,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: "center",
  },
  tileActive: {
    borderWidth: 2,
    opacity: 0.95,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  meta: {
    marginTop: 8,
    opacity: 0.7,
    fontSize: 13,
  },
  sliderWrap: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});
