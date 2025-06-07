export const CubeColors = {
  black: "#222222",
  white: "#eeeeee",
  gray: "#888888",
} as const;

export type CubeColor = keyof typeof CubeColors; // 'black' | 'white' | 'gray'
