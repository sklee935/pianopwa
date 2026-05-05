# 선생님용 콘텐츠 수정 가이드

레슨과 미션은 `src/content.js`에 들어 있습니다.

## 미션 타입

### 1. note_find

건반에서 특정 음을 찾는 미션입니다.

```js
{
  id: 'bk-7',
  type: 'note_find',
  concept: 'note_position',
  title: '시 찾기',
  prompt: '검은 건반 3개 묶음 오른쪽의 시를 눌러봐.',
  targetPitch: 'B',
  acceptAnyOctave: true,
  baseReward: 14,
  hint: '시는 검은 건반 3개 묶음 오른쪽이에요.',
  explain: '파-솔-라-시 순서로 올라가요.'
}
```

### 2. staff_note

오선지 음표를 보고 건반에서 찾는 미션입니다.

```js
{
  id: 'sm-5',
  type: 'staff_note',
  concept: 'staff_note',
  title: '라 지도',
  prompt: '악보의 라를 보고 건반에서 라를 찾아봐.',
  targetNote: 'A4',
  targetPitch: 'A',
  acceptAnyOctave: true,
  baseReward: 16,
  hint: '라는 솔 오른쪽이에요.',
  explain: '오선지에서 위로 갈수록 건반도 오른쪽으로 갑니다.'
}
```

### 3. rhythm_tap

리듬 카드를 순서대로 누르는 미션입니다.

```js
{
  id: 'rp-4',
  type: 'rhythm_tap',
  concept: 'rhythm',
  title: '타 쉼 타 길게',
  prompt: '타, 쉼, 타, 길게 순서로 눌러봐.',
  pattern: ['ta', 'rest', 'ta', 'hold'],
  baseReward: 14,
  hint: '쉼도 한 박이에요.',
  explain: '쉼표에서도 박자는 계속 흘러가요.'
}
```

사용 가능한 리듬:

```text
ta      = 타
rest    = 쉼
hold    = 길게
ti_ti   = 티티
```

### 4. ear_match

소리를 듣고 같은 음 이름을 찾는 미션입니다.

```js
{
  id: 'el-4',
  type: 'ear_match',
  concept: 'ear',
  title: '라 소리 찾기',
  prompt: '소리를 듣고 라를 찾아봐.',
  targetNote: 'A4',
  targetPitch: 'A',
  acceptAnyOctave: true,
  baseReward: 16,
  hint: '라는 솔 다음 음이에요.',
  explain: '소리를 듣고 손으로 찾는 연습은 귀 훈련에 좋아요.'
}
```

### 5. quiz

짧은 이론 퀴즈입니다.

```js
{
  id: 'tc-4',
  type: 'quiz',
  concept: 'quiz',
  title: '파는 어디 있을까?',
  prompt: '파는 어떤 검은 건반 묶음 옆에 있을까?',
  options: ['검은 건반 3개 묶음 왼쪽', '검은 건반 2개 묶음 사이', '항상 맨 끝'],
  correctAnswer: '검은 건반 3개 묶음 왼쪽',
  baseReward: 10,
  hint: '파는 세 검은 건반의 시작점이에요.',
  explain: '파는 검은 건반 3개 묶음의 바로 왼쪽 흰 건반이에요.'
}
```

## 추천 콘텐츠 순서

처음 아이들에게는 이 순서가 좋습니다.

1. 도 찾기
2. 레, 미 찾기
3. 파 찾기
4. 솔, 라, 시 찾기
5. 악보의 도-레-미 연결
6. 쉬운 리듬
7. 듣고 찾기
8. 짧은 퀴즈

## 중요한 원칙

- 한 미션에는 하나의 개념만 넣기
- 설명은 짧게 쓰기
- 틀렸을 때 부정적인 표현 쓰지 않기
- 검은 건반 묶음을 기준으로 설명하기
- 아이가 직접 눌러서 확인하게 만들기
