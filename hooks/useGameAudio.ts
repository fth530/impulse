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

  // Update enabled flag
  ref.current.enabled = enabled;

  // When sound is disabled, stop everything immediately
  useEffect(() => {
    if (!enabled) {
      // Stop BGM
      if (ref.current.bgm) {
        ref.current.bgm.stopAsync().catch(() => {});
        ref.current.bgm.unloadAsync().catch(() => {});
        ref.current.bgm = null;
      }
      // Stop all SFX
      ref.current.sfx.forEach((s) => {
        s.stopAsync().catch(() => {});
        s.unloadAsync().catch(() => {});
      });
      ref.current.sfx = [];
    }
  }, [enabled]);

  // Configure audio mode on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    return () => {
      if (ref.current.bgm) {
        ref.current.bgm.unloadAsync().catch(() => {});
      }
      ref.current.sfx.forEach((s) => s.unloadAsync().catch(() => {}));
      ref.current.sfx = [];
    };
  }, []);

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
