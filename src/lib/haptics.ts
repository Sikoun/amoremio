/**
 * Silent tactile vibration haptics for mobile devices.
 * Uses navigator.vibrate with graceful fallbacks.
 */

export const haptic = {
  // Light 10ms micro-tap on button presses, mood selection
  lightTap: () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore devices where vibration is disabled
      }
    }
  },

  // Heartbeat pattern (40ms, 60ms pause, 40ms) when sending kisses/hugs
  heartbeat: () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {}
    }
  },

  // Rhythmic celebration pattern when both answers unlock
  celebration: () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([30, 50, 30, 50, 80]);
      } catch {}
    }
  },

  // Soft double-tap when favoriting / double-tapping a partner's answer
  loveReaction: () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([25, 40, 35]);
      } catch {}
    }
  },
};
