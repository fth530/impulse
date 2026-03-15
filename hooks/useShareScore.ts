import { useCallback } from "react";
import { Share, Platform } from "react-native";
import { useT } from "@/i18n/LanguageContext";

export function useShareScore() {
  const t = useT();

  const shareScore = useCallback(
    async (score: number) => {
      const messages: Record<string, string> = {
        en: `I scored ${score} points on MathPulse! Can you beat me? 🧠⚡`,
        tr: `MathPulse'da ${score} puan yaptım! Beni geçebilir misin? 🧠⚡`,
        de: `Ich habe ${score} Punkte bei MathPulse erreicht! Kannst du mich schlagen? 🧠⚡`,
        pt: `Fiz ${score} pontos no MathPulse! Consegue me superar? 🧠⚡`,
        es: `Hice ${score} puntos en MathPulse! ¿Puedes superarme? 🧠⚡`,
        fr: `J'ai fait ${score} points sur MathPulse ! Tu peux me battre ? 🧠⚡`,
        ja: `MathPulseで${score}点取った！超えられる？🧠⚡`,
        ko: `MathPulse에서 ${score}점 달성! 이길 수 있어? 🧠⚡`,
      };

      // Determine current language from t.play (hacky but avoids circular dep)
      const lang =
        t.play === "OYNA" ? "tr" :
        t.play === "SPIELEN" ? "de" :
        t.play === "JOGAR" ? "pt" :
        t.play === "JUGAR" ? "es" :
        t.play === "JOUER" ? "fr" :
        t.play === "プレイ" ? "ja" :
        t.play === "플레이" ? "ko" : "en";

      const message = messages[lang] || messages.en;

      try {
        await Share.share({
          message,
          ...(Platform.OS === "ios" ? { url: "https://apps.apple.com/app/mathpulse" } : {}),
        });
      } catch {}
    },
    [t],
  );

  return { shareScore };
}
