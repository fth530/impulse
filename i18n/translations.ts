export type Language = "en" | "tr" | "de" | "pt" | "es" | "fr" | "ja" | "ko";

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
];

export interface Translations {
  // Menu
  menuBadge: string;
  menuTitle: string;
  menuSubtitle: string;
  menuTagline: string;
  bestScoreLabel: string;
  play: string;
  playAccessibility: string;
  howToPlay: string;
  howToPlayAccessibility: string;

  // Playing
  score: string;
  best: string;
  tap: string;
  wait: string;

  // Rules
  ruleBadgeLabel: string;
  ruleEven: string;
  ruleOdd: string;
  rulePrime: string;
  ruleGreaterThan: (n: number) => string;
  ruleLessThan: (n: number) => string;
  ruleEndsWith5: string;
  ruleEndsWith0: string;
  ruleMultipleOf3: string;

  // Difficulty
  diffBeginner: string;
  diffIntermediate: string;
  diffHard: string;
  diffExpert: string;

  // Game Over
  gameOver: string;
  newRecord: string;
  bestInline: (n: number) => string;
  correct: string;
  duration: string;
  bestStreak: string;
  level: string;
  playAgain: string;
  playAgainAccessibility: string;
  menu: string;
  menuAccessibility: string;

  // Stats
  statsTitle: string;
  totalGames: string;
  averageScore: string;
  bestScore: string;
  longestStreak: string;
  accuracyTitle: string;
  correctWrong: (c: number, w: number) => string;
  scoreHistory: string;
  noGamesYet: string;
  points: string;

  // Settings
  settingsTitle: string;
  vibration: string;
  vibrationDesc: string;
  soundEffects: string;
  soundDesc: string;
  privacyPolicy: string;
  supportContact: string;
  clearData: string;
  clearDataHint: string;
  clearDataConfirmTitle: string;
  clearDataConfirmMsg: string;
  cancel: string;
  reset: string;
  language: string;
  languageDesc: string;
  appTagline: string;

  // How To Play
  howToPlayTitle: string;
  howToRule1Title: string;
  howToRule1Desc: string;
  howToRule2Title: string;
  howToRule2Desc: string;
  howToRule3Title: string;
  howToRule3Desc: string;
  howToRule4Title: string;
  howToRule4Desc: string;
  howToExample: string;
  howToExampleText: string;

  // Share
  shareScore: string;

  // Error
  errorTitle: string;
  errorMessage: string;
  tryAgain: string;

  // Not Found
  notFoundTitle: string;
  notFoundMessage: string;
  goHome: string;
}

const en: Translations = {
  menuBadge: "MATHPULSE",
  menuTitle: "QUICK",
  menuSubtitle: "MATH GAME",
  menuTagline: "One rule. One tap. No mistakes.",
  bestScoreLabel: "BEST SCORE",
  play: "PLAY",
  playAccessibility: "Start Game",
  howToPlay: "HOW TO PLAY?",
  howToPlayAccessibility: "How to Play",

  score: "SCORE",
  best: "BEST",
  tap: "TAP!",
  wait: "WAIT",

  ruleBadgeLabel: "RULE",
  ruleEven: "EVEN NUMBER",
  ruleOdd: "ODD NUMBER",
  rulePrime: "PRIME NUMBER",
  ruleGreaterThan: (n) => `GREATER THAN ${n}`,
  ruleLessThan: (n) => `LESS THAN ${n}`,
  ruleEndsWith5: "ENDS WITH 5",
  ruleEndsWith0: "ENDS WITH 0",
  ruleMultipleOf3: "MULTIPLE OF 3",

  diffBeginner: "BEGINNER",
  diffIntermediate: "MEDIUM",
  diffHard: "HARD",
  diffExpert: "EXPERT",

  gameOver: "GAME OVER",
  newRecord: "NEW RECORD!",
  bestInline: (n) => `Best: ${n}`,
  correct: "Correct",
  duration: "Time",
  bestStreak: "Best Streak",
  level: "Level",
  playAgain: "PLAY AGAIN",
  playAgainAccessibility: "Play Again",
  menu: "MENU",
  menuAccessibility: "Back to Menu",

  statsTitle: "STATISTICS",
  totalGames: "Total Games",
  averageScore: "Average Score",
  bestScore: "Best Score",
  longestStreak: "Longest Streak",
  accuracyTitle: "ACCURACY",
  correctWrong: (c, w) => `${c} correct / ${w} wrong`,
  scoreHistory: "SCORE HISTORY",
  noGamesYet: "No games played yet",
  points: "pts",

  settingsTitle: "SETTINGS",
  vibration: "Vibration",
  vibrationDesc: "Haptic feedback",
  soundEffects: "Sound Effects",
  soundDesc: "Music and sound effects",
  privacyPolicy: "Privacy Policy",
  supportContact: "Support & Contact",
  clearData: "Clear Data",
  clearDataHint: "Score history and best score will be deleted",
  clearDataConfirmTitle: "Clear Data",
  clearDataConfirmMsg: "All score history and best score will be reset. This cannot be undone.",
  cancel: "Cancel",
  reset: "Reset",
  language: "Language",
  languageDesc: "App language",
  appTagline: "Quick Math Game",

  howToPlayTitle: "HOW TO PLAY?",
  howToRule1Title: "If it matches the rule, TAP",
  howToRule1Desc: "Tap the screen before time runs out. Too late and you lose!",
  howToRule2Title: "If it doesn't match, DON'T TAP",
  howToRule2Desc: "Wait and watch the timer expire. Tap and you lose!",
  howToRule3Title: "The rule changes",
  howToRule3Desc: "Every 3-5 turns the rule changes. Watch for the yellow flash!",
  howToRule4Title: "Difficulty increases",
  howToRule4Desc: "Each correct move shortens the timer. How long can you last?",
  howToExample: "Example",
  howToExampleText: "If the rule is EVEN NUMBER and the equation is 3 + 5 (result = 8, even) → TAP!",

  shareScore: "SHARE SCORE",

  errorTitle: "Something went wrong",
  errorMessage: "Please reload the app to continue.",
  tryAgain: "Try Again",

  notFoundTitle: "Not Found",
  notFoundMessage: "This page does not exist.",
  goHome: "Go to home screen",
};

const tr: Translations = {
  menuBadge: "MATHPULSE",
  menuTitle: "HIZLI",
  menuSubtitle: "MATEMATİK",
  menuTagline: "Kural var. Süre var. Hata yok.",
  bestScoreLabel: "EN İYİ SKOR",
  play: "OYNA",
  playAccessibility: "Oyunu Başlat",
  howToPlay: "NASIL OYNANIR?",
  howToPlayAccessibility: "Nasıl Oynanır",

  score: "SKOR",
  best: "EN İYİ",
  tap: "DOKUN!",
  wait: "BEKLEME ZAMANI",

  ruleBadgeLabel: "KURAL",
  ruleEven: "ÇİFT SAYI",
  ruleOdd: "TEK SAYI",
  rulePrime: "ASAL SAYI",
  ruleGreaterThan: (n) => `${n}'DAN BÜYÜK`,
  ruleLessThan: (n) => `${n}'DEN KÜÇÜK`,
  ruleEndsWith5: "SONU 5 İLE BİTEN",
  ruleEndsWith0: "SONU 0 İLE BİTEN",
  ruleMultipleOf3: "3'ÜN KATI",

  diffBeginner: "BAŞLANGIÇ",
  diffIntermediate: "ORTA",
  diffHard: "ZOR",
  diffExpert: "UZMAN",

  gameOver: "OYUN BİTTİ",
  newRecord: "YENİ REKOR!",
  bestInline: (n) => `En İyi: ${n}`,
  correct: "Doğru",
  duration: "Süre",
  bestStreak: "En İyi Seri",
  level: "Seviye",
  playAgain: "TEKRAR OYNA",
  playAgainAccessibility: "Tekrar Oyna",
  menu: "MENÜ",
  menuAccessibility: "Menüye Dön",

  statsTitle: "İSTATİSTİKLER",
  totalGames: "Toplam Oyun",
  averageScore: "Ortalama Skor",
  bestScore: "En İyi Skor",
  longestStreak: "En Uzun Seri",
  accuracyTitle: "İSABET ORANI",
  correctWrong: (c, w) => `${c} doğru / ${w} yanlış`,
  scoreHistory: "SKOR GEÇMİŞİ",
  noGamesYet: "Henüz oyun oynamadın",
  points: "puan",

  settingsTitle: "AYARLAR",
  vibration: "Titreşim",
  vibrationDesc: "Dokunmatik geri bildirim",
  soundEffects: "Ses Efektleri",
  soundDesc: "Müzik ve ses efektleri",
  privacyPolicy: "Gizlilik Politikası",
  supportContact: "Destek & İletişim",
  clearData: "Verileri Sıfırla",
  clearDataHint: "Skor geçmişi ve en iyi skor silinir",
  clearDataConfirmTitle: "Verileri Sıfırla",
  clearDataConfirmMsg: "Tüm skor geçmişi ve en iyi skor sıfırlanacak. Bu işlem geri alınamaz.",
  cancel: "İptal",
  reset: "Sıfırla",
  language: "Dil",
  languageDesc: "Uygulama dili",
  appTagline: "Hızlı Matematik Oyunu",

  howToPlayTitle: "NASIL OYNANIR?",
  howToRule1Title: "Kurala uyuyorsa DOKUN",
  howToRule1Desc: "Süre bitmeden önce ekrana dokun. Geç kalırsan yanarsın!",
  howToRule2Title: "Kurala uymuyorsa DOKUNMA",
  howToRule2Desc: "Bekle ve sürenin bitmesini izle. Dokunursan yanarsın!",
  howToRule3Title: "Kural değişiyor",
  howToRule3Desc: "Her 3-5 turda bir kural değişir. Sarı yanıp söndüğünde dikkat et!",
  howToRule4Title: "Zorluk artıyor",
  howToRule4Desc: "Her doğru hamlede süre kısalır. Ne kadar dayanabilirsin?",
  howToExample: "Örnek",
  howToExampleText: "Kural ÇİFT SAYI ise ve denklem 3 + 5 ise (sonuç = 8, çift) → DOKUN!",

  shareScore: "SKORU PAYLAŞ",

  errorTitle: "Bir sorun oluştu",
  errorMessage: "Devam etmek için uygulamayı yeniden yükleyin.",
  tryAgain: "Tekrar Dene",

  notFoundTitle: "Bulunamadı",
  notFoundMessage: "Bu sayfa mevcut değil.",
  goHome: "Ana sayfaya dön",
};

const de: Translations = {
  menuBadge: "MATHPULSE",
  menuTitle: "KOPF-",
  menuSubtitle: "RECHNEN",
  menuTagline: "Eine Regel. Eine Zeit. Keine Fehler.",
  bestScoreLabel: "BESTLEISTUNG",
  play: "SPIELEN",
  playAccessibility: "Spiel starten",
  howToPlay: "WIE SPIELT MAN?",
  howToPlayAccessibility: "Wie spielt man",

  score: "PUNKTE",
  best: "BESTE",
  tap: "TIPPEN!",
  wait: "WARTEN",

  ruleBadgeLabel: "REGEL",
  ruleEven: "GERADE ZAHL",
  ruleOdd: "UNGERADE ZAHL",
  rulePrime: "PRIMZAHL",
  ruleGreaterThan: (n) => `GRÖẞER ALS ${n}`,
  ruleLessThan: (n) => `KLEINER ALS ${n}`,
  ruleEndsWith5: "ENDET MIT 5",
  ruleEndsWith0: "ENDET MIT 0",
  ruleMultipleOf3: "VIELFACHES VON 3",

  diffBeginner: "ANFÄNGER",
  diffIntermediate: "MITTEL",
  diffHard: "SCHWER",
  diffExpert: "EXPERTE",

  gameOver: "SPIEL VORBEI",
  newRecord: "NEUER REKORD!",
  bestInline: (n) => `Beste: ${n}`,
  correct: "Richtig",
  duration: "Zeit",
  bestStreak: "Beste Serie",
  level: "Level",
  playAgain: "NOCHMAL",
  playAgainAccessibility: "Nochmal spielen",
  menu: "MENÜ",
  menuAccessibility: "Zurück zum Menü",

  statsTitle: "STATISTIKEN",
  totalGames: "Spiele gesamt",
  averageScore: "Durchschnitt",
  bestScore: "Bestleistung",
  longestStreak: "Längste Serie",
  accuracyTitle: "GENAUIGKEIT",
  correctWrong: (c, w) => `${c} richtig / ${w} falsch`,
  scoreHistory: "SPIELVERLAUF",
  noGamesYet: "Noch keine Spiele",
  points: "Pkt",

  settingsTitle: "EINSTELLUNGEN",
  vibration: "Vibration",
  vibrationDesc: "Haptisches Feedback",
  soundEffects: "Soundeffekte",
  soundDesc: "Musik und Soundeffekte",
  privacyPolicy: "Datenschutz",
  supportContact: "Support & Kontakt",
  clearData: "Daten löschen",
  clearDataHint: "Spielverlauf und Bestleistung werden gelöscht",
  clearDataConfirmTitle: "Daten löschen",
  clearDataConfirmMsg: "Alle Daten werden gelöscht. Dies kann nicht rückgängig gemacht werden.",
  cancel: "Abbrechen",
  reset: "Löschen",
  language: "Sprache",
  languageDesc: "App-Sprache",
  appTagline: "Kopfrechnen Spiel",

  howToPlayTitle: "WIE SPIELT MAN?",
  howToRule1Title: "Passt zur Regel? TIPPEN",
  howToRule1Desc: "Tippe den Bildschirm bevor die Zeit abläuft. Zu spät und du verlierst!",
  howToRule2Title: "Passt nicht? NICHT TIPPEN",
  howToRule2Desc: "Warte bis der Timer abläuft. Tippst du, verlierst du!",
  howToRule3Title: "Die Regel ändert sich",
  howToRule3Desc: "Alle 3-5 Runden ändert sich die Regel. Achte auf das gelbe Blinken!",
  howToRule4Title: "Schwierigkeit steigt",
  howToRule4Desc: "Jeder richtige Zug verkürzt den Timer. Wie lange hältst du durch?",
  howToExample: "Beispiel",
  howToExampleText: "Regel GERADE ZAHL, Gleichung 3 + 5 (Ergebnis = 8, gerade) → TIPPEN!",

  shareScore: "PUNKTZAHL TEILEN",

  errorTitle: "Etwas ist schiefgelaufen",
  errorMessage: "Bitte lade die App neu.",
  tryAgain: "Erneut versuchen",

  notFoundTitle: "Nicht gefunden",
  notFoundMessage: "Diese Seite existiert nicht.",
  goHome: "Zur Startseite",
};

const pt: Translations = {
  menuBadge: "MATHPULSE",
  menuTitle: "JOGO",
  menuSubtitle: "MATEMÁTICA",
  menuTagline: "Uma regra. Um tempo. Sem erros.",
  bestScoreLabel: "MELHOR PONTUAÇÃO",
  play: "JOGAR",
  playAccessibility: "Iniciar Jogo",
  howToPlay: "COMO JOGAR?",
  howToPlayAccessibility: "Como Jogar",

  score: "PONTOS",
  best: "MELHOR",
  tap: "TOQUE!",
  wait: "ESPERE",

  ruleBadgeLabel: "REGRA",
  ruleEven: "NÚMERO PAR",
  ruleOdd: "NÚMERO ÍMPAR",
  rulePrime: "NÚMERO PRIMO",
  ruleGreaterThan: (n) => `MAIOR QUE ${n}`,
  ruleLessThan: (n) => `MENOR QUE ${n}`,
  ruleEndsWith5: "TERMINA EM 5",
  ruleEndsWith0: "TERMINA EM 0",
  ruleMultipleOf3: "MÚLTIPLO DE 3",

  diffBeginner: "INICIANTE",
  diffIntermediate: "MÉDIO",
  diffHard: "DIFÍCIL",
  diffExpert: "EXPERT",

  gameOver: "FIM DE JOGO",
  newRecord: "NOVO RECORDE!",
  bestInline: (n) => `Melhor: ${n}`,
  correct: "Corretas",
  duration: "Tempo",
  bestStreak: "Melhor Série",
  level: "Nível",
  playAgain: "JOGAR NOVAMENTE",
  playAgainAccessibility: "Jogar Novamente",
  menu: "MENU",
  menuAccessibility: "Voltar ao Menu",

  statsTitle: "ESTATÍSTICAS",
  totalGames: "Total de Jogos",
  averageScore: "Média",
  bestScore: "Melhor Pontuação",
  longestStreak: "Maior Série",
  accuracyTitle: "PRECISÃO",
  correctWrong: (c, w) => `${c} corretas / ${w} erradas`,
  scoreHistory: "HISTÓRICO",
  noGamesYet: "Nenhum jogo ainda",
  points: "pts",

  settingsTitle: "CONFIGURAÇÕES",
  vibration: "Vibração",
  vibrationDesc: "Feedback tátil",
  soundEffects: "Efeitos Sonoros",
  soundDesc: "Música e efeitos sonoros",
  privacyPolicy: "Política de Privacidade",
  supportContact: "Suporte & Contato",
  clearData: "Limpar Dados",
  clearDataHint: "Histórico e melhor pontuação serão apagados",
  clearDataConfirmTitle: "Limpar Dados",
  clearDataConfirmMsg: "Todo o histórico será apagado. Isso não pode ser desfeito.",
  cancel: "Cancelar",
  reset: "Limpar",
  language: "Idioma",
  languageDesc: "Idioma do app",
  appTagline: "Jogo de Matemática",

  howToPlayTitle: "COMO JOGAR?",
  howToRule1Title: "Se combina com a regra, TOQUE",
  howToRule1Desc: "Toque a tela antes do tempo acabar. Atrasou, perdeu!",
  howToRule2Title: "Se não combina, NÃO TOQUE",
  howToRule2Desc: "Espere o timer acabar. Se tocar, você perde!",
  howToRule3Title: "A regra muda",
  howToRule3Desc: "A cada 3-5 rodadas a regra muda. Fique atento ao flash amarelo!",
  howToRule4Title: "Dificuldade aumenta",
  howToRule4Desc: "Cada acerto diminui o timer. Quanto tempo você aguenta?",
  howToExample: "Exemplo",
  howToExampleText: "Regra NÚMERO PAR, equação 3 + 5 (resultado = 8, par) → TOQUE!",

  shareScore: "COMPARTILHAR",

  errorTitle: "Algo deu errado",
  errorMessage: "Recarregue o app para continuar.",
  tryAgain: "Tentar Novamente",

  notFoundTitle: "Não encontrado",
  notFoundMessage: "Esta página não existe.",
  goHome: "Ir para o início",
};

const es: Translations = {
  menuBadge: "MATHPULSE",
  menuTitle: "JUEGO",
  menuSubtitle: "MATEMÁTICO",
  menuTagline: "Una regla. Un tiempo. Sin errores.",
  bestScoreLabel: "MEJOR PUNTUACIÓN",
  play: "JUGAR",
  playAccessibility: "Iniciar Juego",
  howToPlay: "¿CÓMO JUGAR?",
  howToPlayAccessibility: "Cómo Jugar",

  score: "PUNTOS",
  best: "MEJOR",
  tap: "¡TOCA!",
  wait: "ESPERA",

  ruleBadgeLabel: "REGLA",
  ruleEven: "NÚMERO PAR",
  ruleOdd: "NÚMERO IMPAR",
  rulePrime: "NÚMERO PRIMO",
  ruleGreaterThan: (n) => `MAYOR QUE ${n}`,
  ruleLessThan: (n) => `MENOR QUE ${n}`,
  ruleEndsWith5: "TERMINA EN 5",
  ruleEndsWith0: "TERMINA EN 0",
  ruleMultipleOf3: "MÚLTIPLO DE 3",

  diffBeginner: "PRINCIPIANTE",
  diffIntermediate: "MEDIO",
  diffHard: "DIFÍCIL",
  diffExpert: "EXPERTO",

  gameOver: "FIN DEL JUEGO",
  newRecord: "¡NUEVO RÉCORD!",
  bestInline: (n) => `Mejor: ${n}`,
  correct: "Correctas",
  duration: "Tiempo",
  bestStreak: "Mejor Racha",
  level: "Nivel",
  playAgain: "JUGAR DE NUEVO",
  playAgainAccessibility: "Jugar de Nuevo",
  menu: "MENÚ",
  menuAccessibility: "Volver al Menú",

  statsTitle: "ESTADÍSTICAS",
  totalGames: "Total Partidas",
  averageScore: "Promedio",
  bestScore: "Mejor Puntuación",
  longestStreak: "Mayor Racha",
  accuracyTitle: "PRECISIÓN",
  correctWrong: (c, w) => `${c} correctas / ${w} incorrectas`,
  scoreHistory: "HISTORIAL",
  noGamesYet: "Sin partidas aún",
  points: "pts",

  settingsTitle: "AJUSTES",
  vibration: "Vibración",
  vibrationDesc: "Respuesta háptica",
  soundEffects: "Efectos de Sonido",
  soundDesc: "Música y efectos de sonido",
  privacyPolicy: "Política de Privacidad",
  supportContact: "Soporte y Contacto",
  clearData: "Borrar Datos",
  clearDataHint: "Se borrarán el historial y la mejor puntuación",
  clearDataConfirmTitle: "Borrar Datos",
  clearDataConfirmMsg: "Se borrarán todos los datos. Esto no se puede deshacer.",
  cancel: "Cancelar",
  reset: "Borrar",
  language: "Idioma",
  languageDesc: "Idioma de la app",
  appTagline: "Juego Matemático Rápido",

  howToPlayTitle: "¿CÓMO JUGAR?",
  howToRule1Title: "Si coincide con la regla, ¡TOCA!",
  howToRule1Desc: "Toca la pantalla antes de que se acabe el tiempo. ¡Si llegas tarde, pierdes!",
  howToRule2Title: "Si no coincide, NO TOQUES",
  howToRule2Desc: "Espera a que el temporizador termine. ¡Si tocas, pierdes!",
  howToRule3Title: "La regla cambia",
  howToRule3Desc: "Cada 3-5 turnos la regla cambia. ¡Atento al destello amarillo!",
  howToRule4Title: "La dificultad aumenta",
  howToRule4Desc: "Cada acierto acorta el temporizador. ¿Cuánto puedes aguantar?",
  howToExample: "Ejemplo",
  howToExampleText: "Regla NÚMERO PAR, ecuación 3 + 5 (resultado = 8, par) → ¡TOCA!",

  shareScore: "COMPARTIR",

  errorTitle: "Algo salió mal",
  errorMessage: "Recarga la app para continuar.",
  tryAgain: "Reintentar",

  notFoundTitle: "No encontrado",
  notFoundMessage: "Esta página no existe.",
  goHome: "Ir al inicio",
};

const fr: Translations = {
  menuBadge: "MATHPULSE",
  menuTitle: "CALCUL",
  menuSubtitle: "MENTAL",
  menuTagline: "Une règle. Un temps. Zéro erreur.",
  bestScoreLabel: "MEILLEUR SCORE",
  play: "JOUER",
  playAccessibility: "Commencer",
  howToPlay: "COMMENT JOUER ?",
  howToPlayAccessibility: "Comment Jouer",

  score: "SCORE",
  best: "MEILLEUR",
  tap: "TOUCHE !",
  wait: "ATTENDS",

  ruleBadgeLabel: "RÈGLE",
  ruleEven: "NOMBRE PAIR",
  ruleOdd: "NOMBRE IMPAIR",
  rulePrime: "NOMBRE PREMIER",
  ruleGreaterThan: (n) => `PLUS GRAND QUE ${n}`,
  ruleLessThan: (n) => `PLUS PETIT QUE ${n}`,
  ruleEndsWith5: "FINIT PAR 5",
  ruleEndsWith0: "FINIT PAR 0",
  ruleMultipleOf3: "MULTIPLE DE 3",

  diffBeginner: "DÉBUTANT",
  diffIntermediate: "MOYEN",
  diffHard: "DIFFICILE",
  diffExpert: "EXPERT",

  gameOver: "PARTIE TERMINÉE",
  newRecord: "NOUVEAU RECORD !",
  bestInline: (n) => `Meilleur : ${n}`,
  correct: "Correct",
  duration: "Temps",
  bestStreak: "Meilleure Série",
  level: "Niveau",
  playAgain: "REJOUER",
  playAgainAccessibility: "Rejouer",
  menu: "MENU",
  menuAccessibility: "Retour au Menu",

  statsTitle: "STATISTIQUES",
  totalGames: "Parties jouées",
  averageScore: "Score moyen",
  bestScore: "Meilleur Score",
  longestStreak: "Plus longue série",
  accuracyTitle: "PRÉCISION",
  correctWrong: (c, w) => `${c} correct / ${w} faux`,
  scoreHistory: "HISTORIQUE",
  noGamesYet: "Aucune partie jouée",
  points: "pts",

  settingsTitle: "PARAMÈTRES",
  vibration: "Vibration",
  vibrationDesc: "Retour haptique",
  soundEffects: "Effets Sonores",
  soundDesc: "Musique et effets sonores",
  privacyPolicy: "Confidentialité",
  supportContact: "Support & Contact",
  clearData: "Effacer les données",
  clearDataHint: "L'historique et le meilleur score seront effacés",
  clearDataConfirmTitle: "Effacer les données",
  clearDataConfirmMsg: "Toutes les données seront effacées. Cette action est irréversible.",
  cancel: "Annuler",
  reset: "Effacer",
  language: "Langue",
  languageDesc: "Langue de l'app",
  appTagline: "Jeu Calcul Mental",

  howToPlayTitle: "COMMENT JOUER ?",
  howToRule1Title: "Si ça correspond, TOUCHE",
  howToRule1Desc: "Touche l'écran avant la fin du temps. Trop tard et tu perds !",
  howToRule2Title: "Si ça ne correspond pas, NE TOUCHE PAS",
  howToRule2Desc: "Attends que le timer expire. Si tu touches, tu perds !",
  howToRule3Title: "La règle change",
  howToRule3Desc: "Toutes les 3-5 tours la règle change. Attention au flash jaune !",
  howToRule4Title: "La difficulté augmente",
  howToRule4Desc: "Chaque bonne réponse raccourcit le timer. Combien de temps tiendras-tu ?",
  howToExample: "Exemple",
  howToExampleText: "Règle NOMBRE PAIR, équation 3 + 5 (résultat = 8, pair) → TOUCHE !",

  shareScore: "PARTAGER",

  errorTitle: "Un problème est survenu",
  errorMessage: "Rechargez l'app pour continuer.",
  tryAgain: "Réessayer",

  notFoundTitle: "Non trouvé",
  notFoundMessage: "Cette page n'existe pas.",
  goHome: "Retour à l'accueil",
};

const ja: Translations = {
  menuBadge: "MATHPULSE",
  menuTitle: "計算",
  menuSubtitle: "ゲーム",
  menuTagline: "ルールあり。時間あり。ミスなし。",
  bestScoreLabel: "ベストスコア",
  play: "プレイ",
  playAccessibility: "ゲーム開始",
  howToPlay: "遊び方",
  howToPlayAccessibility: "遊び方",

  score: "スコア",
  best: "ベスト",
  tap: "タップ！",
  wait: "待って",

  ruleBadgeLabel: "ルール",
  ruleEven: "偶数",
  ruleOdd: "奇数",
  rulePrime: "素数",
  ruleGreaterThan: (n) => `${n}より大きい`,
  ruleLessThan: (n) => `${n}より小さい`,
  ruleEndsWith5: "末尾が5",
  ruleEndsWith0: "末尾が0",
  ruleMultipleOf3: "3の倍数",

  diffBeginner: "初級",
  diffIntermediate: "中級",
  diffHard: "上級",
  diffExpert: "エキスパート",

  gameOver: "ゲームオーバー",
  newRecord: "新記録！",
  bestInline: (n) => `ベスト: ${n}`,
  correct: "正解",
  duration: "時間",
  bestStreak: "最高連続",
  level: "レベル",
  playAgain: "もう一度",
  playAgainAccessibility: "もう一度プレイ",
  menu: "メニュー",
  menuAccessibility: "メニューに戻る",

  statsTitle: "統計",
  totalGames: "総プレイ数",
  averageScore: "平均スコア",
  bestScore: "ベストスコア",
  longestStreak: "最長連続",
  accuracyTitle: "正確率",
  correctWrong: (c, w) => `${c}正解 / ${w}不正解`,
  scoreHistory: "スコア履歴",
  noGamesYet: "まだプレイしていません",
  points: "点",

  settingsTitle: "設定",
  vibration: "振動",
  vibrationDesc: "触覚フィードバック",
  soundEffects: "サウンド",
  soundDesc: "音楽と効果音",
  privacyPolicy: "プライバシーポリシー",
  supportContact: "サポート",
  clearData: "データ削除",
  clearDataHint: "スコア履歴とベストスコアが削除されます",
  clearDataConfirmTitle: "データ削除",
  clearDataConfirmMsg: "全てのデータが削除されます。元に戻せません。",
  cancel: "キャンセル",
  reset: "削除",
  language: "言語",
  languageDesc: "アプリの言語",
  appTagline: "計算ゲーム 脳トレ",

  howToPlayTitle: "遊び方",
  howToRule1Title: "ルールに合えばタップ",
  howToRule1Desc: "時間内に画面をタップ。遅れたら負け！",
  howToRule2Title: "合わなければタップしない",
  howToRule2Desc: "タイマーが切れるまで待つ。タップしたら負け！",
  howToRule3Title: "ルールが変わる",
  howToRule3Desc: "3〜5ターンごとにルールが変化。黄色の点滅に注意！",
  howToRule4Title: "難易度が上がる",
  howToRule4Desc: "正解するたびにタイマーが短くなる。どこまで耐えられる？",
  howToExample: "例",
  howToExampleText: "ルール「偶数」、式 3 + 5（答え = 8、偶数）→ タップ！",

  shareScore: "スコアを共有",

  errorTitle: "問題が発生しました",
  errorMessage: "アプリを再読み込みしてください。",
  tryAgain: "再試行",

  notFoundTitle: "見つかりません",
  notFoundMessage: "このページは存在しません。",
  goHome: "ホームに戻る",
};

const ko: Translations = {
  menuBadge: "MATHPULSE",
  menuTitle: "수학",
  menuSubtitle: "게임",
  menuTagline: "규칙이 있다. 시간이 있다. 실수는 없다.",
  bestScoreLabel: "최고 점수",
  play: "플레이",
  playAccessibility: "게임 시작",
  howToPlay: "플레이 방법",
  howToPlayAccessibility: "플레이 방법",

  score: "점수",
  best: "최고",
  tap: "탭!",
  wait: "기다려",

  ruleBadgeLabel: "규칙",
  ruleEven: "짝수",
  ruleOdd: "홀수",
  rulePrime: "소수",
  ruleGreaterThan: (n) => `${n}보다 큰`,
  ruleLessThan: (n) => `${n}보다 작은`,
  ruleEndsWith5: "끝자리 5",
  ruleEndsWith0: "끝자리 0",
  ruleMultipleOf3: "3의 배수",

  diffBeginner: "초급",
  diffIntermediate: "중급",
  diffHard: "고급",
  diffExpert: "전문가",

  gameOver: "게임 오버",
  newRecord: "새 기록!",
  bestInline: (n) => `최고: ${n}`,
  correct: "정답",
  duration: "시간",
  bestStreak: "최고 연속",
  level: "레벨",
  playAgain: "다시 하기",
  playAgainAccessibility: "다시 플레이",
  menu: "메뉴",
  menuAccessibility: "메뉴로 돌아가기",

  statsTitle: "통계",
  totalGames: "총 게임 수",
  averageScore: "평균 점수",
  bestScore: "최고 점수",
  longestStreak: "최장 연속",
  accuracyTitle: "정확도",
  correctWrong: (c, w) => `${c}정답 / ${w}오답`,
  scoreHistory: "점수 기록",
  noGamesYet: "아직 플레이하지 않았습니다",
  points: "점",

  settingsTitle: "설정",
  vibration: "진동",
  vibrationDesc: "햅틱 피드백",
  soundEffects: "사운드",
  soundDesc: "음악 및 효과음",
  privacyPolicy: "개인정보처리방침",
  supportContact: "지원 및 문의",
  clearData: "데이터 삭제",
  clearDataHint: "점수 기록과 최고 점수가 삭제됩니다",
  clearDataConfirmTitle: "데이터 삭제",
  clearDataConfirmMsg: "모든 데이터가 삭제됩니다. 되돌릴 수 없습니다.",
  cancel: "취소",
  reset: "삭제",
  language: "언어",
  languageDesc: "앱 언어",
  appTagline: "수학게임 두뇌훈련",

  howToPlayTitle: "플레이 방법",
  howToRule1Title: "규칙에 맞으면 탭",
  howToRule1Desc: "시간이 끝나기 전에 화면을 탭하세요. 늦으면 패배!",
  howToRule2Title: "맞지 않으면 탭하지 마세요",
  howToRule2Desc: "타이머가 끝날 때까지 기다리세요. 탭하면 패배!",
  howToRule3Title: "규칙이 바뀝니다",
  howToRule3Desc: "3-5턴마다 규칙이 변경됩니다. 노란색 깜박임에 주의!",
  howToRule4Title: "난이도가 올라갑니다",
  howToRule4Desc: "정답마다 타이머가 짧아집니다. 얼마나 버틸 수 있나요?",
  howToExample: "예시",
  howToExampleText: "규칙 「짝수」, 식 3 + 5 (답 = 8, 짝수) → 탭!",

  shareScore: "점수 공유",

  errorTitle: "문제가 발생했습니다",
  errorMessage: "앱을 다시 로드해주세요.",
  tryAgain: "다시 시도",

  notFoundTitle: "찾을 수 없음",
  notFoundMessage: "이 페이지는 존재하지 않습니다.",
  goHome: "홈으로 돌아가기",
};

export const translationMap: Record<Language, Translations> = {
  en,
  tr,
  de,
  pt,
  es,
  fr,
  ja,
  ko,
};
