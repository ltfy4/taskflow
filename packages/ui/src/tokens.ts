/** Design system color tokens */
export const colors = {
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b",
  },
  success: "#22c55e",
  warning: "#f97316",
  danger: "#ef4444",
} as const;

/** Design system spacing (4px base) */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;

/** Border radius values */
export const radii = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
} as const;

/** Animation duration values in milliseconds */
export const durations = {
  fast: 150,
  normal: 200,
  slow: 250,
} as const;
