import { useRef, useCallback, useEffect } from "react";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";

const sounds = {
  correct: require("@/assets/sounds/correct.wav"),
  streak: require("@/assets/sounds/streak.wav"),
  gameover: require("@/assets/sounds/gameover.wav"),
  bgm: require("@/assets/sounds/bgm-loop.wav"),
  tick: require("@/assets/sounds/tick.wav"),
};

interface AudioRef {
  bgm: Audio.Sound | null;
  sfx: Audio.Sound[];
  enabled: boolean;
}

export function useGameAudio(enabled: boolean) {
  const ref = useRef<AudioRef>({
    bgm: null,
    sfx: [],
    enabled,
  });

  ref.current.enabled = enabled;

  // Configure audio mode on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    return () => {
      stopBgm();
      ref.current.sfx.forEach((s) => s.unloadAsync().catch(() => {}));
      ref.current.sfx = [];
    };
  }, []);

  // ── Play a one-shot sound effect ──
  const playSfx = useCallback(
    async (source: keyof typeof sounds, volume = 0.7) => {
      if (!ref.current.enabled) return;
      try {
        const { sound } = await Audio.Sound.createAsync(sounds[source], {
          shouldPlay: true,
          volume,
        });
        ref.current.sfx.push(sound);

        sound.setOnPlaybackStatusUpdate((status) => {
          if ((status as AVPlaybackStatusSuccess).didJustFinish) {
            sound.unloadAsync().catch(() => {});
            ref.current.sfx = ref.current.sfx.filter((s) => s !== sound);
          }
        });
      } catch {}
    },
    [],
  );

  // ── Background music (oyunbaslangic — plays once as intro, not looped) ──
  const startBgm = useCallback(async () => {
    if (!ref.current.enabled) return;
    try {
      if (ref.current.bgm) {
        await ref.current.bgm.unloadAsync().catch(() => {});
      }

      const { sound } = await Audio.Sound.createAsync(sounds.bgm, {
        shouldPlay: true,
        isLooping: false,
        volume: 0.5,
      });

      ref.current.bgm = sound;
    } catch {}
  }, []);

  const stopBgm = useCallback(async () => {
    if (ref.current.bgm) {
      try {
        await ref.current.bgm.stopAsync();
        await ref.current.bgm.unloadAsync();
      } catch {}
      ref.current.bgm = null;
    }
  }, []);

  // ── Convenience methods ──
  const playCorrect = useCallback(() => playSfx("correct", 0.6), [playSfx]);
  const playStreak = useCallback(() => playSfx("streak", 0.8), [playSfx]);
  const playGameOver = useCallback(async () => {
    await stopBgm();
    await playSfx("gameover", 0.7);
  }, [playSfx, stopBgm]);
  const playTick = useCallback(() => playSfx("tick", 0.3), [playSfx]);

  return {
    startBgm,
    stopBgm,
    playCorrect,
    playStreak,
    playGameOver,
    playTick,
  };
}
