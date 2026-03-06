# Tek Tuş Matematik

A chic, hypercasual "Go/No-Go" brain-teaser mobile game built with Expo React Native. The entire UI is in Turkish.

## Architecture

- **Frontend**: Expo Router (file-based routing), React Native, Reanimated 2
- **Backend**: Express.js (serves landing page + API shell)
- **State**: React refs + useState (no external state library needed)
- **Persistence**: AsyncStorage for best score

## Key Files

- `app/index.tsx` — Main game screen (menu, playing, game over states all in one file)
- `hooks/useMathGame.ts` — Core game logic hook (math engine, timer, Go/No-Go logic)
- `constants/colors.ts` — App color palette (mint green, navy, white)
- `app/(tabs)/_layout.tsx` — Slot layout (no tab bar, passes through to game)

## Game Mechanics

- Player sees a math equation (numbers 1-12, ops: + - ×) and a dynamic rule
- **Go** (rule matches): TAP before timer → +1 score; timeout → game over
- **No-Go** (rule doesn't match): DON'T TAP; timeout → +1 score; tap → game over
- Timer starts at 2.5s, decreases by 0.05s per point (min 0.8s)
- Rules change every 3-5 turns with a flash animation

## Rules (Turkish)

- `ÇİFT SAYI` — Even number
- `TEK SAYI` — Odd number
- `ASAL SAYI` — Prime number
- `10'DAN BÜYÜK` — Greater than 10

## UI Features

- White minimalist Apple/Google aesthetic
- 60fps Reanimated timer bar (green → orange → red as it shrinks)
- Rule flash animation (mint → yellow) when rule changes
- Haptic feedback on correct/incorrect moves
- Best score persisted via AsyncStorage

## Running

- Frontend: `npm run expo:dev` (port 8081)
- Backend: `npm run server:dev` (port 5000)
