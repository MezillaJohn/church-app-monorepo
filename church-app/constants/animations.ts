import {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  withSpring,
  withTiming,
  type WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";

/* ── Spring presets ── */
export const SpringPresets = {
  gentle: {
    damping: 20,
    stiffness: 120,
    mass: 0.8,
  } satisfies WithSpringConfig,

  bouncy: {
    damping: 12,
    stiffness: 150,
    mass: 0.6,
  } satisfies WithSpringConfig,

  snappy: {
    damping: 26,
    stiffness: 300,
    mass: 0.5,
  } satisfies WithSpringConfig,

  smooth: {
    damping: 28,
    stiffness: 200,
    mass: 0.8,
  } satisfies WithSpringConfig,
} as const;

/* ── Timing presets ── */
export const TimingPresets = {
  fast: { duration: 150 } satisfies WithTimingConfig,
  normal: { duration: 250 } satisfies WithTimingConfig,
  slow: { duration: 400 } satisfies WithTimingConfig,
} as const;

/* ── Entry/Exit animations ── */
export const Entering = {
  fadeIn: FadeIn.duration(300),
  fadeInDown: FadeInDown.duration(400).springify().damping(18),
  fadeInUp: FadeInUp.duration(400).springify().damping(18),
  slideInRight: SlideInRight.duration(300).springify().damping(20),
} as const;

export const Exiting = {
  fadeOut: FadeOut.duration(200),
  slideOutLeft: SlideOutLeft.duration(200),
} as const;

/* ── Stagger helper ── */
export const staggerDelay = (index: number, base = 50) =>
  FadeInDown.delay(index * base)
    .duration(400)
    .springify()
    .damping(18);
