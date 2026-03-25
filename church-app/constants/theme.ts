import { Platform } from "react-native";

/* ── Color Palette ── "Elevated Teal" ── */
export const Colors = {
  /** Primary Brand */
  primary: "#00D9A6",
  primaryLight: "#33E8BE",
  primaryDark: "#00B88E",
  primaryMuted: "rgba(0,217,166,0.10)",
  primaryGlow: "rgba(0,217,166,0.20)",

  /** Backgrounds */
  background: "#08080F",
  backgroundElevated: "#0D0D12",

  /** Surfaces */
  surface: "#13141F",
  surfaceElevated: "#1A1B2E",
  surfaceGlass: "rgba(255,255,255,0.04)",

  /** Text */
  text: "#FFFFFF",
  textSecondary: "#E2E8F0",
  textMuted: "#94A3B8",
  textDisabled: "#475569",

  /** Borders */
  border: "rgba(255,255,255,0.06)",
  borderFocused: "rgba(0,217,166,0.30)",

  /** Accent & State */
  accent2: "#A78BFA",
  accent3: "#60A5FA",
  success: "#34D399",
  error: "#F87171",
  warning: "#FBBF24",

  /* ── Legacy aliases (keep for backward compat) ── */
  black: "#0D0D12",
  dark: "#08080F",
  darkSecondary: "#111320",
  textInputGrey: "#1A1A24",
  overlay: "rgba(0, 0, 0, 0.40)",
  white: "#FFFFFF",
  deemedWhite: "#E2E8F0",
  muted: "#94A3B8",
  disabled: "#475569",
  red: "#F87171",
  info: "#60A5FA",
  purple: "#A78BFA",
  shadow: "rgba(0,0,0,0.35)",

  /** Legacy gradients */
  gradientHeader: ["#1A2940", "#111B30", "#0A0F1E"],
  gradientAction: ["#131828", "#1B2540", "#151D35"],
  gradientCard: ["#0E1018", "#151828", "#0D1020"],
  gradientDeep: ["#08080F", "#111320", "#0A0D18"],
  purpleDark: "#0C0F1A",
} as const;

/* ── New Gradients ── */
export const Gradients = {
  screen: ["#08080F", "#0A0E1A", "#0D1225"] as const,
  card: ["#13141F", "#171A2C", "#13141F"] as const,
  hero: ["#0A0E1A", "#111830", "#0A0E1A"] as const,
  primary: ["#00D9A6", "#00C49A", "#00B88E"] as const,
  premium: ["#00D9A6", "#A78BFA"] as const,
  glass: ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"] as const,
  overlay: ["transparent", "rgba(8,8,15,0.85)"] as const,
} as const;

/* ── Glass-morphism ── */
export const Glass = {
  base: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderRadius: 20,
    borderCurve: "continuous" as const,
    overflow: "hidden" as const,
  },
  elevated: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderRadius: 20,
    borderCurve: "continuous" as const,
    overflow: "hidden" as const,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0,217,166,0.05)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
} as const;

/** Helper to create white with opacity */
export const whiteOpacity = (opacity: string) =>
  `rgba(255,255,255,${opacity})`;

export const Fonts = {
  Regular: "Inter_400Regular",
  Medium: "Inter_500Medium",
  SemiBold: "Inter_600SemiBold",
  Bold: "Inter_700Bold",
  ExtraBold: "Inter_800ExtraBold",
  Black: "Inter_900Black",
};
