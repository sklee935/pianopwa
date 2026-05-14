# 선생님용 콘텐츠 수정 가이드 / Teacher Content Guide

레슨과 미션은 `src/content.js`에 들어 있습니다.
Lessons and missions live in `src/content.js`.

## 한영 텍스트 구조 / Bilingual text structure

이제 화면 문구는 아래처럼 한국어와 영어를 함께 넣습니다.
Use the helper pattern below for Korean and English text.

```js
const tx = (ko, en) => ({ ko, en });

title: tx('도 보물 찾기', 'Find the C Treasure')
prompt: tx('두 검은 건반 왼쪽의 도를 눌러봐.', 'Press C to the left of two black keys.')
```

퀴즈 선택지는 배열도 한영으로 넣을 수 있습니다.
Quiz options can also be bilingual arrays.

```js
options: tx(
  ['한 박', '두 박', '네 박'],
  ['One beat', 'Two beats', 'Four beats']
),
correctOptionIndex: 1
```

## 미션 타입 / Mission types

### 1. note_find

건반에서 특정 음을 찾는 미션입니다.
A mission for finding a note on the keyboard.

```js
{
  id: 'bk-7',
  type: 'note_find',
  concept: 'note_position',
  title: tx('시 찾기', 'Find B'),
  prompt: tx('검은 건반 3개 묶음 오른쪽의 시를 눌러봐.', 'Press B to the right of three black keys.'),
  targetPitch: 'B',
  acceptAnyOctave: true,
  baseReward: 14,
  hint: tx('시는 검은 건반 3개 묶음 오른쪽이에요.', 'B is to the right of a group of three black keys.'),
  explain: tx('파-솔-라-시 순서로 올라가요.', 'The order goes F-G-A-B.')
}
```

### 2. staff_note

오선지 음표를 보고 건반에서 찾는 미션입니다.
A mission for matching a staff note to the keyboard.

```js
{
  id: 'sm-5',
  type: 'staff_note',
  concept: 'staff_note',
  title: tx('라 지도', 'A Map'),
  prompt: tx('악보의 라를 보고 건반에서 라를 찾아봐.', 'Look at A on the staff and find A on the keyboard.'),
  targetNote: 'A4',
  targetPitch: 'A',
  acceptAnyOctave: true,
  baseReward: 16,
  hint: tx('라는 솔 오른쪽이에요.', 'A is to the right of G.'),
  explain: tx('오선지에서 위로 갈수록 건반도 오른쪽으로 갑니다.', 'As notes move up on the staff, the keyboard moves to the right.')
}
```

### 3. rhythm_tap

리듬 카드를 순서대로 누르는 미션입니다.
A mission for tapping rhythm cards in order.

```js
{
  id: 'rp-4',
  type: 'rhythm_tap',
  concept: 'rhythm',
  title: tx('타 쉼 타 길게', 'Ta Rest Ta Hold'),
  prompt: tx('타, 쉼, 타, 길게 순서로 눌러봐.', 'Tap Ta, Rest, Ta, Hold in order.'),
  pattern: ['ta', 'rest', 'ta', 'hold'],
  baseReward: 14,
  hint: tx('쉼도 한 박이에요.', 'A rest still takes one beat.'),
  explain: tx('쉼표에서도 박자는 계속 흘러가요.', 'The beat keeps going during a rest.')
}
```

사용 가능한 리듬 / Available rhythms:

```text
ta      = 타 / Ta
rest    = 쉼 / Rest
hold    = 길게 / Hold
ti_ti   = 티티 / Ti-ti
```

### 4. ear_match

소리를 듣고 같은 음 이름을 찾는 미션입니다.
A mission for listening to a note and finding the matching note name.

```js
{
  id: 'el-4',
  type: 'ear_match',
  concept: 'ear',
  title: tx('라 소리 찾기', 'Find the A Sound'),
  prompt: tx('소리를 듣고 라를 찾아봐.', 'Listen to the sound and find A.'),
  targetNote: 'A4',
  targetPitch: 'A',
  acceptAnyOctave: true,
  baseReward: 16,
  hint: tx('라는 솔 다음 음이에요.', 'A comes after G.'),
  explain: tx('소리를 듣고 손으로 찾는 연습은 귀 훈련에 좋아요.', 'Listening and finding the sound by hand is good ear practice.')
}
```

### 5. quiz

짧은 이론 퀴즈입니다.
A short theory quiz.

```js
{
  id: 'tc-4',
  type: 'quiz',
  concept: 'quiz',
  title: tx('파는 어디 있을까?', 'Where is F?'),
  prompt: tx('파는 어떤 검은 건반 묶음 옆에 있을까?', 'Which black-key group helps you find F?'),
  options: tx(
    ['검은 건반 3개 묶음 왼쪽', '검은 건반 2개 묶음 사이', '항상 맨 끝'],
    ['Left of three black keys', 'Between two black keys', 'Always at the end']
  ),
  correctOptionIndex: 0,
  baseReward: 10,
  hint: tx('파는 세 검은 건반의 시작점이에요.', 'F starts the three-black-key group.'),
  explain: tx('파는 검은 건반 3개 묶음의 바로 왼쪽 흰 건반이에요.', 'F is the white key just to the left of three black keys.')
}
```

## 추천 콘텐츠 순서 / Recommended content order

1. 도/C 찾기
2. 레/D, 미/E 찾기
3. 파/F 찾기
4. 솔/G, 라/A, 시/B 찾기
5. 악보의 도-레-미 / C-D-E 연결
6. 쉬운 리듬 / simple rhythms
7. 듣고 찾기 / ear matching
8. 짧은 퀴즈 / short quizzes

## 중요한 원칙 / Important principles

- 한 미션에는 하나의 개념만 넣기 / Keep one concept per mission
- 설명은 짧게 쓰기 / Keep explanations short
- 틀렸을 때 부정적인 표현 쓰지 않기 / Never shame the child
- 검은 건반 묶음을 기준으로 설명하기 / Use black-key groups as anchors
- 아이가 직접 눌러서 확인하게 만들기 / Let the child press and discover
