# 🧠 IMPULSE: Tek Tuş Matematik

> Kural var. Süre var. **HATA YOK.**  
> Zihninin sınırlarını zorlayacak, dinamik zorluk motoruna sahip hiper-casual refleks & matematik oyunu.

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🌟 Özellikler

Oyun sadece hız üzerine değil, oyuncunun **bilişsel (kognitif) performansına** meydan okuyacak bir **"Dinamik Zorluk Motoru (Dynamic Difficulty Engine)"** barındırır.

- **Dinamik Kural Havuzu:**
  - *Başlangıç (Skor 0-10):* İşlem sonuçları **Çift veya Tek Sayı** mı?
  - *Orta Seviye (Skor 11-30):* **Asal** mı? **10/20/25'ten Büyük** mü? **15/30'dan Küçük** mü?
  - *Zor Seviye (Skor 31+):* **Sonu 5 ile Biten, Sonu 0 ile Biten, 3'ün Katı** vb. ek mantık kuralları.
- **Kademeli İşlem Zorluğu (Progressive Math):**
  - Basit Toplama ve Çıkarmadan (`10 - 7`), Çarpmaya (`6 × 7`).
  - *Rezalet Zorluk (Skor > 60):* Çoklu işlem önceliğine (`(3 + 2) × 4`), ondalıksız kusursuz bölmelere (`24 ÷ 6`) kadar evrilir.
- **Refleks Odaklı Zaman Sınırı (Timer Decay):** Skorlar arttıkça zaman barı her hamlede daralır.
- **Kesintisiz Deneyim:** `react-native-reanimated` kullanılarak kurulan %100 UI Thread çalışan akıcı 60/120FPS animasyonlar. (0ms Lag).
- **Haptic (Titreşim) Geri Bildirimi:** Doğru/Yanlış seçimlerde fiziksel geri bildirim.
- **Test Edilmiş Kod Tabanı:** Kalbindeki matematik denetleyicisi `jest` ile %100 başarıyla sınır (boundary) testlerinden geçmiştir.


## 🛠️ Kurulum ve Çalıştırma

Proje **Expo** kullanılarak ayaklandırılmıştır.

```bash
# Bağımlılıkları yükleyin
npm install

# Yerel geliştirme ortamında çalıştırın
npm run start
```
*IOS, Android, ya da Web (React Native Web) ortamlarının tümünde sorunsuz çalışacak PWA/Native altyapısına sahiptir.*

## 📐 Mimari & Tasarım

Oyun kod tabanında temiz bir modüler mimari izlenmiştir:
- **`components/`**: İzole UI elemanları (`TimerBar.tsx`, `RuleBadge.tsx`, `ScorePill.tsx`, `HowToPlayModal.tsx`). `index.tsx` içerisindeki Spagetti yapı temizlenmiş, arayüz salt bir çatıya (Frame) dönüştürülmüştür.
- **`hooks/useMathGame.ts`**: Tüm Core oyun mekaniklerini barındıran kalptir. Component tarafındaki re-render döngülerinden arındırılmıştır (State isolation). 
  - *Stale-timer engelleyici* ve *double-tap lock* mekanizmaları ile asenkron hata/leak riski giderilmiştir.
- **`server/`**: Custom express sunucu, platform odaklı statik manifest gönderimi yapan Expo router servisi. (Replit kalıntılarından, lokal config hatalarından tamamen temizlenmiştir).

## 🧪 Test Süreci

Kritik seviyeler barındıran bu oyunda `isEven`, `isPrime`, `isGreaterThan`, vb. saf fonksiyonlar bir test motoruna ihtiyaç duyuyordu. Proje, Edge Cases (0, -1 gibi sınır denetimleri) de dâhil kuralları baştan sona sağlamlaştıran kapsamlı `jest` unit testleri içerir.

```bash
# Tüm test senaryolarını çalıştırmak için:
npx jest
```

## 🔐 Erişilebilirlik (A11y)
Ekranda bulunan buton ve menü öğeleri için Screen Reader (Ekran Okuyucu) destekleri (`accessibilityRole="button"`, `accessibilityLabel="..."`) tam entegredir. Her oyuncu oyunu kolaylıkla anlayabilir ve gezinebilir.

---
*Developed with ☕ & strict engineering rules.*
