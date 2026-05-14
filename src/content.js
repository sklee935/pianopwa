/* Piano Quest / 피아노 탐험대 - free bilingual content. Teachers can add more lessons here. */
(function (global) {
  'use strict';

  const L = global.PianoPWALogic;

  const tx = (ko, en) => ({ ko, en });

  const RHYTHM_LABELS = {
    ta: { label: tx('타', 'Ta'), icon: '♩', description: tx('한 박 소리', 'One beat') },
    rest: { label: tx('쉼', 'Rest'), icon: '𝄽', description: tx('한 박 쉬기', 'One beat silent') },
    hold: { label: tx('길게', 'Hold'), icon: '𝅗𝅥', description: tx('두 박 유지', 'Hold for two beats') },
    ti_ti: { label: tx('티티', 'Ti-ti'), icon: '♪♪', description: tx('반 박 두 번', 'Two quick half beats') }
  };

  const LESSONS = [
    {
      id: 'black-key-island',
      title: tx('검은 건반 보물섬', 'Black-Key Treasure Island'),
      emoji: '🏝️',
      short: tx('도레미 위치', 'Note positions'),
      teacherGoal: tx('검은 건반 2개/3개 묶음을 기준으로 흰 건반 이름을 찾게 한다.', 'Help students find white-key note names by using groups of two and three black keys.'),
      missions: [
        {
          id: 'bk-1',
          type: 'note_find',
          concept: 'black_key_group',
          title: tx('도 보물 찾기', 'Find the C Treasure'),
          prompt: tx('두 검은 건반 왼쪽에 숨어 있는 도를 눌러봐.', 'Press the C hiding to the left of two black keys.'),
          targetPitch: 'C',
          acceptAnyOctave: true,
          baseReward: 12,
          hint: tx('검은 건반이 2개 붙어 있는 곳을 먼저 찾고, 바로 왼쪽 흰 건반을 눌러요.', 'First find a group of two black keys, then press the white key just to the left.'),
          explain: tx('피아노에는 도가 여러 개 있어요. 하지만 찾는 법은 같아요. 두 검은 건반 왼쪽이 도예요.', 'There are many C keys on the piano, but the pattern is always the same: C is to the left of two black keys.')
        },
        {
          id: 'bk-2',
          type: 'note_find',
          concept: 'note_position',
          title: tx('레 다리 건너기', 'Cross the D Bridge'),
          prompt: tx('두 검은 건반 사이의 레를 찾아봐.', 'Find D between the two black keys.'),
          targetPitch: 'D',
          acceptAnyOctave: true,
          baseReward: 12,
          hint: tx('레는 도와 미 사이, 두 검은 건반 아래 가운데에 있어요.', 'D is between C and E, right under the middle of two black keys.'),
          explain: tx('도-레-미는 서로 이웃이에요. 도를 찾은 다음 오른쪽으로 한 칸 가면 레예요.', 'C, D, and E are neighbors. Once you find C, move one white key to the right to find D.')
        },
        {
          id: 'bk-3',
          type: 'note_find',
          concept: 'note_position',
          title: tx('미 문 열기', 'Open the E Door'),
          prompt: tx('두 검은 건반 오른쪽의 미를 눌러봐.', 'Press E to the right of two black keys.'),
          targetPitch: 'E',
          acceptAnyOctave: true,
          baseReward: 12,
          hint: tx('검은 건반 2개 묶음의 오른쪽 끝 흰 건반이에요.', 'E is the white key on the right side of a group of two black keys.'),
          explain: tx('미는 두 검은 건반 묶음의 오른쪽 문이에요. 도-레-미로 노래하며 찾으면 쉬워요.', 'E is like the right-side door of the two-black-key group. Sing C-D-E as you find it.')
        },
        {
          id: 'bk-4',
          type: 'note_find',
          concept: 'black_key_group',
          title: tx('파 숲 입구', 'The Forest Gate F'),
          prompt: tx('검은 건반 3개 묶음 왼쪽의 파를 찾아봐.', 'Find F to the left of a group of three black keys.'),
          targetPitch: 'F',
          acceptAnyOctave: true,
          baseReward: 13,
          hint: tx('검은 건반이 3개 붙어 있는 곳을 찾고, 바로 왼쪽 흰 건반을 눌러요.', 'Find a group of three black keys, then press the white key just to the left.'),
          explain: tx('파는 검은 건반 3개 묶음을 시작하는 입구예요.', 'F is the entrance to a group of three black keys.')
        },
        {
          id: 'bk-5',
          type: 'note_find',
          concept: 'note_position',
          title: tx('솔 별 찾기', 'Find the G Star'),
          prompt: tx('파 오른쪽의 솔을 눌러봐.', 'Press G, the white key to the right of F.'),
          targetPitch: 'G',
          acceptAnyOctave: true,
          baseReward: 13,
          hint: tx('파를 찾고 바로 오른쪽으로 한 칸 가면 솔이에요.', 'Find F, then move one white key to the right to find G.'),
          explain: tx('솔은 파 다음 음이에요. 파-솔-라-시 순서로 올라가요.', 'G comes right after F. The order goes F-G-A-B.')
        },
        {
          id: 'bk-6',
          type: 'note_find',
          concept: 'note_position',
          title: tx('라와 시 친구', 'A and B Friends'),
          prompt: tx('검은 건반 3개 묶음 안쪽의 라를 눌러봐.', 'Press A inside the group of three black keys.'),
          targetPitch: 'A',
          acceptAnyOctave: true,
          baseReward: 14,
          hint: tx('검은 건반 3개 묶음에서 두 번째와 세 번째 검은 건반 사이 아래가 라예요.', 'A is below the space between the second and third black keys in a group of three.'),
          explain: tx('검은 건반 3개 묶음 아래에는 파, 솔, 라, 시가 차례대로 있어요.', 'Under a group of three black keys, the white keys go F, G, A, B.')
        }
      ]
    },
    {
      id: 'staff-map',
      title: tx('오선지 지도', 'Staff Map'),
      emoji: '🗺️',
      short: tx('악보-건반 연결', 'Staff to keys'),
      teacherGoal: tx('악보의 음표를 건반 위치와 연결한다. 처음에는 정확한 옥타브보다 음 이름을 우선한다.', 'Connect notes on the staff to piano keys. At first, focus on note names more than exact octaves.'),
      missions: [
        {
          id: 'sm-1',
          type: 'staff_note',
          concept: 'staff_note',
          title: tx('가온도 지도', 'Middle C Map'),
          prompt: tx('오선지 아래 작은 줄의 도를 건반에서 찾아봐.', 'Find the C shown on the little ledger line below the staff.'),
          targetNote: 'C4',
          targetPitch: 'C',
          acceptAnyOctave: true,
          baseReward: 15,
          hint: tx('악보에서는 아래 작은 줄, 건반에서는 두 검은 건반 왼쪽이에요.', 'On the staff it is on a small line below. On the keyboard it is to the left of two black keys.'),
          explain: tx('가온도는 악보와 피아노를 연결하는 기준점이에요. 처음에는 도의 위치를 확실히 기억해요.', 'Middle C is a helpful anchor between sheet music and the piano. First, remember where C lives.')
        },
        {
          id: 'sm-2',
          type: 'staff_note',
          concept: 'staff_note',
          title: tx('레 계단 오르기', 'Step Up to D'),
          prompt: tx('도보다 한 계단 위의 레를 눌러봐.', 'Press D, one step above C.'),
          targetNote: 'D4',
          targetPitch: 'D',
          acceptAnyOctave: true,
          baseReward: 15,
          hint: tx('도에서 오른쪽으로 한 칸 가면 레예요.', 'Move one white key to the right from C to find D.'),
          explain: tx('악보에서 한 칸 올라가면 피아노에서도 오른쪽으로 한 음 올라가는 느낌이에요.', 'When the note steps up on the staff, it also feels like moving one note to the right on the piano.')
        },
        {
          id: 'sm-3',
          type: 'staff_note',
          concept: 'staff_note',
          title: tx('미 계단 오르기', 'Step Up to E'),
          prompt: tx('악보의 미를 보고 건반에서 미를 찾아봐.', 'Look at E on the staff and find E on the keyboard.'),
          targetNote: 'E4',
          targetPitch: 'E',
          acceptAnyOctave: true,
          baseReward: 15,
          hint: tx('미는 두 검은 건반 오른쪽이에요.', 'E is to the right of two black keys.'),
          explain: tx('도-레-미를 건반에서 차례대로 세어보면 악보 음표도 쉽게 읽을 수 있어요.', 'Counting C-D-E on the keyboard can help you read the notes on the staff.')
        },
        {
          id: 'sm-4',
          type: 'staff_note',
          concept: 'staff_note',
          title: tx('솔 언덕', 'G Hill'),
          prompt: tx('오선 둘째 줄의 솔을 눌러봐.', 'Press G on the second line of the treble staff.'),
          targetNote: 'G4',
          targetPitch: 'G',
          acceptAnyOctave: true,
          baseReward: 16,
          hint: tx('솔은 파 오른쪽, 검은 건반 3개 묶음 아래쪽에 있어요.', 'G is to the right of F, under the three-black-key group.'),
          explain: tx('높은음자리표에서 솔은 기준 음 중 하나예요. 건반에서는 파 다음 음이에요.', 'G is an important anchor note in treble clef. On the keyboard, it comes after F.')
        }
      ]
    },
    {
      id: 'rhythm-playground',
      title: tx('리듬 놀이터', 'Rhythm Playground'),
      emoji: '🥁',
      short: tx('박자 놀이', 'Beat practice'),
      teacherGoal: tx('4분음표, 쉼표, 2분음표, 8분음표 두 개를 몸동작으로 느끼게 한다.', 'Help students feel quarter notes, rests, half notes, and paired eighth notes through movement.'),
      missions: [
        {
          id: 'rp-1',
          type: 'rhythm_tap',
          concept: 'rhythm',
          title: tx('타 타 쉼 타', 'Ta Ta Rest Ta'),
          prompt: tx('리듬 카드를 순서대로 눌러봐: 타, 타, 쉼, 타', 'Tap the rhythm cards in order: Ta, Ta, Rest, Ta.'),
          pattern: ['ta', 'ta', 'rest', 'ta'],
          baseReward: 13,
          hint: tx('쉼은 소리를 내지 않고 마음속으로 한 박 쉬는 거예요.', 'A rest means one silent beat. Keep counting in your head.'),
          explain: tx('쉼표도 박자는 계속 흘러가요. 소리는 쉬지만 마음속 카운트는 멈추지 않아요.', 'Even during a rest, the beat keeps moving. The sound pauses, but the counting continues.')
        },
        {
          id: 'rp-2',
          type: 'rhythm_tap',
          concept: 'rhythm',
          title: tx('길게 두 박', 'Hold for Two Beats'),
          prompt: tx('타, 길게, 타, 쉼 순서로 눌러봐.', 'Tap Ta, Hold, Ta, Rest in order.'),
          pattern: ['ta', 'hold', 'ta', 'rest'],
          baseReward: 14,
          hint: tx('길게는 손뼉 한 번 뒤에 두 박 동안 소리가 이어진다고 생각해요.', 'For Hold, imagine one clap ringing for two beats.'),
          explain: tx('2분음표는 두 박이에요. 빨리 지나가지 말고 길게 느껴요.', 'A half note lasts for two beats. Do not rush past it; feel it stretch.')
        },
        {
          id: 'rp-3',
          type: 'rhythm_tap',
          concept: 'rhythm',
          title: tx('티티 달리기', 'Ti-ti Run'),
          prompt: tx('티티, 타, 티티, 쉼 순서로 눌러봐.', 'Tap Ti-ti, Ta, Ti-ti, Rest in order.'),
          pattern: ['ti_ti', 'ta', 'ti_ti', 'rest'],
          baseReward: 15,
          hint: tx('티티는 한 박 안에 작은 발걸음 두 번이에요.', 'Ti-ti means two little steps inside one beat.'),
          explain: tx('8분음표 두 개는 한 박을 반으로 나눠요. 말로는 티-티처럼 짧게 느껴요.', 'Two eighth notes split one beat in half. Say them as quick “ti-ti.”')
        }
      ]
    },
    {
      id: 'ear-lab',
      title: tx('소리 실험실', 'Sound Lab'),
      emoji: '🔊',
      short: tx('귀 훈련', 'Ear practice'),
      teacherGoal: tx('소리를 듣고 같은 음 이름을 찾는 경험을 만든다.', 'Let students listen to a sound and find the matching note name.'),
      missions: [
        {
          id: 'el-1',
          type: 'ear_match',
          concept: 'ear',
          title: tx('도 소리 찾기', 'Find the C Sound'),
          prompt: tx('소리를 듣고 같은 이름의 건반을 찾아봐.', 'Listen to the sound and find the key with the same note name.'),
          targetNote: 'C4',
          targetPitch: 'C',
          acceptAnyOctave: true,
          baseReward: 16,
          hint: tx('소리를 다시 듣고, 두 검은 건반 왼쪽의 도를 찾아봐.', 'Listen again, then find C to the left of two black keys.'),
          explain: tx('처음 귀 훈련은 정확한 높이보다 같은 음 이름을 찾는 것이 좋아요.', 'In early ear practice, matching the note name is more important than finding the exact octave.')
        },
        {
          id: 'el-2',
          type: 'ear_match',
          concept: 'ear',
          title: tx('미 소리 찾기', 'Find the E Sound'),
          prompt: tx('이번 소리는 미야. 들어보고 미를 눌러봐.', 'This sound is E. Listen, then press E.'),
          targetNote: 'E4',
          targetPitch: 'E',
          acceptAnyOctave: true,
          baseReward: 16,
          hint: tx('미는 두 검은 건반 오른쪽이에요.', 'E is to the right of two black keys.'),
          explain: tx('도-레-미로 노래하면서 미의 느낌을 기억해 보세요.', 'Sing C-D-E and try to remember how E feels.')
        },
        {
          id: 'el-3',
          type: 'ear_match',
          concept: 'ear',
          title: tx('솔 소리 찾기', 'Find the G Sound'),
          prompt: tx('소리를 듣고 솔을 찾아봐.', 'Listen to the sound and find G.'),
          targetNote: 'G4',
          targetPitch: 'G',
          acceptAnyOctave: true,
          baseReward: 16,
          hint: tx('솔은 파 오른쪽, 검은 건반 3개 묶음 아래에 있어요.', 'G is to the right of F, under the group of three black keys.'),
          explain: tx('솔은 도에서 다섯 번째 소리라 안정적인 느낌이 있어요.', 'G is the fifth note above C, so it can feel stable and strong.')
        }
      ]
    },
    {
      id: 'theory-camp',
      title: tx('이론 캠프', 'Theory Camp'),
      emoji: '🏕️',
      short: tx('짧은 퀴즈', 'Short quizzes'),
      teacherGoal: tx('아이들이 위치와 리듬 개념을 말로 설명할 수 있는지 확인한다.', 'Check whether students can explain note positions and rhythm ideas in words.'),
      missions: [
        {
          id: 'tc-1',
          type: 'quiz',
          concept: 'quiz',
          title: tx('도는 어디 있을까?', 'Where is C?'),
          prompt: tx('도는 어떤 검은 건반 묶음 옆에 있을까?', 'Which black-key group helps you find C?'),
          options: tx(['검은 건반 2개 묶음 왼쪽', '검은 건반 3개 묶음 오른쪽', '피아노 맨 끝에만 있음'], ['Left of a group of two black keys', 'Right of a group of three black keys', 'Only at the end of the piano']),
          correctOptionIndex: 0,
          correctAnswer: '검은 건반 2개 묶음 왼쪽',
          baseReward: 10,
          hint: tx('도는 항상 두 검은 건반 왼쪽에서 찾을 수 있어요.', 'You can always find C to the left of two black keys.'),
          explain: tx('피아노에는 도가 여러 개 있지만 찾는 규칙은 같아요.', 'There are many C keys on the piano, but the pattern is always the same.')
        },
        {
          id: 'tc-2',
          type: 'quiz',
          concept: 'quiz',
          title: tx('쉼표의 비밀', 'The Secret of a Rest'),
          prompt: tx('쉼표가 나오면 박자는 어떻게 될까?', 'What happens to the beat when you see a rest?'),
          options: tx(['박자가 사라진다', '소리만 쉬고 박자는 계속 간다', '무조건 더 빨라진다'], ['The beat disappears', 'The sound rests, but the beat continues', 'It always gets faster']),
          correctOptionIndex: 1,
          correctAnswer: '소리만 쉬고 박자는 계속 간다',
          baseReward: 10,
          hint: tx('쉼표는 조용히 쉬지만 마음속 카운트는 계속해요.', 'A rest is quiet, but the counting continues inside.'),
          explain: tx('쉼표는 음악의 숨이에요. 소리가 없어도 박자는 계속 흘러요.', 'A rest is like a breath in music. Even without sound, the beat keeps flowing.')
        },
        {
          id: 'tc-3',
          type: 'quiz',
          concept: 'quiz',
          title: tx('2분음표 느낌', 'Half Note Feeling'),
          prompt: tx('2분음표는 보통 몇 박 동안 길게 느낄까?', 'How many beats does a half note usually last?'),
          options: tx(['한 박', '두 박', '네 박'], ['One beat', 'Two beats', 'Four beats']),
          correctOptionIndex: 1,
          correctAnswer: '두 박',
          baseReward: 10,
          hint: tx('이름에 2가 들어가면 두 박이라고 연결해 봐요.', 'Try connecting the “half note” with holding for two beats in this level.'),
          explain: tx('기초 단계에서는 2분음표를 두 박 동안 길게 이어지는 소리로 느끼면 좋아요.', 'At this level, feel a half note as a sound that lasts for two beats.')
        }
      ]
    }
  ];

  const KEYBOARD = L.generateKeyboard(60, 83);

  global.PianoPWAContent = {
    RHYTHM_LABELS,
    LESSONS,
    KEYBOARD
  };
})(typeof window !== 'undefined' ? window : globalThis);
