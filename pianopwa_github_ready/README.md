# 피아노 탐험대 PWA

아이들이 피아노 이론을 게임처럼 배우는 **무료 유지형 PWA**입니다.

이 버전은 `https://github.com/sklee935/pianopwa` 저장소에 바로 올릴 수 있도록 만들었습니다.
GitHub Pages를 켜면 예상 주소는 다음과 같습니다.

```text
https://sklee935.github.io/pianopwa/
```

## 목표

- 월 유지비 0원
- 서버 없음
- DB 없음
- 실제 AI API 없음
- 앱스토어 등록 없음
- 아이 기기 안에만 진도 저장
- 홈 화면에 앱처럼 추가 가능

## 포함 기능

- 화면 피아노 건반
- 도/레/미/파/솔/라 위치 찾기
- 오선지 음표 보고 건반 찾기
- 리듬 카드 게임
- 듣고 같은 음 찾기
- 짧은 이론 퀴즈
- XP, 하트, 연속 정답
- 무료 규칙 기반 AI 선생님 피드백
- 선생님용 미니 대시보드
- 숙제 문장 복사
- 진도 JSON 저장/불러오기
- 오프라인 캐시용 service worker

## 파일 구조

```text
.
├── index.html
├── style.css
├── manifest.webmanifest
├── sw.js
├── .nojekyll
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── maskable-512.png
├── src/
│   ├── logic.js
│   ├── content.js
│   └── app.js
├── tests/
│   └── logic.test.cjs
├── docs/
│   ├── DEPLOY_GITHUB_PAGES.md
│   └── TEACHER_CONTENT_GUIDE.md
└── package.json
```

## 로컬에서 열기

파일을 더블클릭해도 기본 기능은 동작합니다. 다만 PWA 설치와 오프라인 캐시는 `http://localhost` 또는 HTTPS에서 더 정확히 테스트됩니다.

```bash
npm test
npm run serve
```

그 다음 브라우저에서 열기:

```text
http://localhost:8080
```

## GitHub Pages 배포

자세한 설명은 `docs/DEPLOY_GITHUB_PAGES.md`를 보세요.

짧게는:

1. 이 폴더 안의 모든 파일을 `sklee935/pianopwa` 저장소 루트에 업로드
2. GitHub에서 `Settings` → `Pages`
3. `Source`를 `Deploy from a branch`로 선택
4. Branch: `main`, Folder: `/(root)`
5. Save
6. 잠시 뒤 `https://sklee935.github.io/pianopwa/` 접속

## 레슨 수정

`src/content.js` 파일에서 미션을 추가하거나 문장을 고칠 수 있습니다.

예:

```js
{
  id: 'new-1',
  type: 'note_find',
  concept: 'note_position',
  title: '시 찾기',
  prompt: '검은 건반 3개 묶음 오른쪽의 시를 눌러봐.',
  targetPitch: 'B',
  acceptAnyOctave: true,
  baseReward: 14,
  hint: '시는 검은 건반 3개 묶음의 바로 오른쪽 흰 건반이에요.',
  explain: '파-솔-라-시 순서로 올라가면 시를 찾을 수 있어요.'
}
```

## 무료 유지 모드의 한계

- 학생 기록은 각 기기 안에 저장됩니다.
- 선생님이 모든 학생의 기록을 자동으로 모아보는 기능은 없습니다.
- 실제 AI Tutor는 붙어 있지 않습니다.
- 기기를 초기화하거나 브라우저 데이터를 지우면 기록이 사라질 수 있습니다.

실제 AI, 로그인, 여러 기기 동기화, 선생님 전체 학생 관리가 필요해지는 시점에는 Supabase/Firebase/OpenAI API 같은 유료 가능성이 있는 기능을 나중에 붙이면 됩니다.
