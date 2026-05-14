# 피아노 탐험대 / Piano Quest

A free, bilingual Progressive Web App for children learning basic piano theory through short interactive missions.

아이들이 피아노 이론을 게임처럼 배울 수 있도록 만든 무료 한영 PWA입니다.

## Live Demo

https://sklee935.github.io/pianopwa/

## What it does

- Korean / English language toggle
- Interactive on-screen piano keyboard
- Note-finding missions
- Staff-to-key matching
- Rhythm practice
- Ear-training style activities
- Music theory quizzes
- XP, hearts, streaks, and encouraging feedback
- Offline-ready PWA structure
- Local progress storage with `localStorage`
- Zero-cost deployment on GitHub Pages

## 한영 전환

The app stores the selected language on the device. Use the `한국어 / English` toggle in the top bar.

앱 상단의 `한국어 / English` 버튼으로 언어를 전환할 수 있습니다. 선택한 언어는 해당 기기에 저장됩니다.

## Tech Stack

- HTML
- CSS
- JavaScript
- PWA Manifest
- Service Worker
- Web Audio API
- localStorage
- GitHub Pages

## Zero-cost rules

This project is designed to stay free to host:

- No backend server
- No database
- No paid AI API
- No login system
- No app store deployment required

## Development notes

Run tests:

```bash
npm test
```

After changing PWA files, update the cache version in `sw.js` and the query string in `index.html` so browsers receive the new files.
