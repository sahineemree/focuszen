export type SoundItem = {
  id: string;
  title: string;
  file: number;
  tags?: string[];
};

export const SOUNDS: SoundItem[] = [
  {
    id: "rain",
    title: "Rain",
    file: require("../../../../assets/audio/rain.mp3"),
    tags: ["nature", "relax"],
  },
  {
    id: "wind",
    title: "Wind",
    file: require("../../../../assets/audio/wind.mp3"),
    tags: ["nature", "calm"],
  },
  {
    id: "fireplace",
    title: "Fireplace",
    file: require("../../../../assets/audio/fireplace.mp3"),
    tags: ["warm", "cozy"],
  },
  {
    id: "ocean",
    title: "Ocean",
    file: require("../../../../assets/audio/ocean.mp3"),
    tags: ["nature", "waves"],
  },
  {
    id: "guitar",
    title: "Guitar",
    file: require("../../../../assets/audio/guitar.mp3"),
    tags: ["music", "focus"],
  },
];
