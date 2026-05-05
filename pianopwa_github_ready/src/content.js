/* 피아노 탐험대 - 무료 콘텐츠. 선생님이 여기만 고쳐도 레슨을 늘릴 수 있어요. */
(function (global) {
  'use strict';

  const L = global.PianoPWALogic;

  const RHYTHM_LABELS = {
    ta: { label: '타', icon: '♩', description: '한 박 소리' },
    rest: { label: '쉼', icon: '𝄽', description: '한 박 쉬기' },
    hold: { label: '길게', icon: '𝅗𝅥', description: '두 박 유지' },
    ti_ti: { label: '티티', icon: '♪♪', description: '반 박 두 번' }
  };

  const LESSONS = [
    {
      id: 'black-key-island',
      title: '검은 건반 보물섬',
      emoji: '🏝️',
      short: '도레미 위치',
      teacherGoal: '검은 건반 2개/3개 묶음을 기준으로 흰 건반 이름을 찾게 한다.',
      missions: [
        {
          id: 'bk-1',
          type: 'note_find',
          concept: 'black_key_group',
          title: '도 보물 찾기',
          prompt: '두 검은 건반 왼쪽에 숨어 있는 도를 눌러봐.',
          targetPitch: 'C',
          acceptAnyOctave: true,
          baseReward: 12,
          hint: '검은 건반이 2개 붙어 있는 곳을 먼저 찾고, 바로 왼쪽 흰 건반을 눌러요.',
          explain: '피아노에는 도가 여러 개 있어요. 하지만 찾는 법은 같아요. 두 검은 건반 왼쪽이 도예요.'
        },
        {
          id: 'bk-2',
          type: 'note_find',
          concept: 'note_position',
          title: '레 다리 건너기',
          prompt: '두 검은 건반 사이의 레를 찾아봐.',
          targetPitch: 'D',
          acceptAnyOctave: true,
          baseReward: 12,
          hint: '레는 도와 미 사이, 두 검은 건반 아래 가운데에 있어요.',
          explain: '도-레-미는 서로 이웃이에요. 도를 찾은 다음 오른쪽으로 한 칸 가면 레예요.'
        },
        {
          id: 'bk-3',
          type: 'note_find',
          concept: 'note_position',
          title: '미 문 열기',
          prompt: '두 검은 건반 오른쪽의 미를 눌러봐.',
          targetPitch: 'E',
          acceptAnyOctave: true,
          baseReward: 12,
          hint: '검은 건반 2개 묶음의 오른쪽 끝 흰 건반이에요.',
          explain: '미는 두 검은 건반 묶음의 오른쪽 문이에요. 도-레-미로 노래하며 찾으면 쉬워요.'
        },
        {
          id: 'bk-4',
          type: 'note_find',
          concept: 'black_key_group',
          title: '파 숲 입구',
          prompt: '검은 건반 3개 묶음 왼쪽의 파를 찾아봐.',
          targetPitch: 'F',
          acceptAnyOctave: true,
          baseReward: 13,
          hint: '검은 건반이 3개 붙어 있는 곳을 찾고, 바로 왼쪽 흰 건반을 눌러요.',
          explain: '파는 검은 건반 3개 묶음을 시작하는 입구예요.'
        },
        {
          id: 'bk-5',
          type: 'note_find',
          concept: 'note_position',
          title: '솔 별 찾기',
          prompt: '파 오른쪽의 솔을 눌러봐.',
          targetPitch: 'G',
          acceptAnyOctave: true,
          baseReward: 13,
          hint: '파를 찾고 바로 오른쪽으로 한 칸 가면 솔이에요.',
          explain: '솔은 파 다음 음이에요. 파-솔-라-시 순서로 올라가요.'
        },
        {
          id: 'bk-6',
          type: 'note_find',
          concept: 'note_position',
          title: '라와 시 친구',
          prompt: '검은 건반 3개 묶음 안쪽의 라를 눌러봐.',
          targetPitch: 'A',
          acceptAnyOctave: true,
          baseReward: 14,
          hint: '검은 건반 3개 묶음에서 두 번째와 세 번째 검은 건반 사이 아래가 라예요.',
          explain: '검은 건반 3개 묶음 아래에는 파, 솔, 라, 시가 차례대로 있어요.'
        }
      ]
    },
    {
      id: 'staff-map',
      title: '오선지 지도',
      emoji: '🗺️',
      short: '악보-건반 연결',
      teacherGoal: '악보의 음표를 건반 위치와 연결한다. 처음에는 정확한 옥타브보다 음 이름을 우선한다.',
      missions: [
        {
          id: 'sm-1',
          type: 'staff_note',
          concept: 'staff_note',
          title: '가온도 지도',
          prompt: '오선지 아래 작은 줄의 도를 건반에서 찾아봐.',
          targetNote: 'C4',
          targetPitch: 'C',
          acceptAnyOctave: true,
          baseReward: 15,
          hint: '악보에서는 아래 작은 줄, 건반에서는 두 검은 건반 왼쪽이에요.',
          explain: '가온도는 악보와 피아노를 연결하는 기준점이에요. 처음에는 도의 위치를 확실히 기억해요.'
        },
        {
          id: 'sm-2',
          type: 'staff_note',
          concept: 'staff_note',
          title: '레 계단 오르기',
          prompt: '도보다 한 계단 위의 레를 눌러봐.',
          targetNote: 'D4',
          targetPitch: 'D',
          acceptAnyOctave: true,
          baseReward: 15,
          hint: '도에서 오른쪽으로 한 칸 가면 레예요.',
          explain: '악보에서 한 칸 올라가면 피아노에서도 오른쪽으로 한 음 올라가는 느낌이에요.'
        },
        {
          id: 'sm-3',
          type: 'staff_note',
          concept: 'staff_note',
          title: '미 계단 오르기',
          prompt: '악보의 미를 보고 건반에서 미를 찾아봐.',
          targetNote: 'E4',
          targetPitch: 'E',
          acceptAnyOctave: true,
          baseReward: 15,
          hint: '미는 두 검은 건반 오른쪽이에요.',
          explain: '도-레-미를 건반에서 차례대로 세어보면 악보 음표도 쉽게 읽을 수 있어요.'
        },
        {
          id: 'sm-4',
          type: 'staff_note',
          concept: 'staff_note',
          title: '솔 언덕',
          prompt: '오선 둘째 줄의 솔을 눌러봐.',
          targetNote: 'G4',
          targetPitch: 'G',
          acceptAnyOctave: true,
          baseReward: 16,
          hint: '솔은 파 오른쪽, 검은 건반 3개 묶음 아래쪽에 있어요.',
          explain: '높은음자리표에서 솔은 기준 음 중 하나예요. 건반에서는 파 다음 음이에요.'
        }
      ]
    },
    {
      id: 'rhythm-playground',
      title: '리듬 놀이터',
      emoji: '🥁',
      short: '박자 놀이',
      teacherGoal: '4분음표, 쉼표, 2분음표, 8분음표 두 개를 몸동작으로 느끼게 한다.',
      missions: [
        {
          id: 'rp-1',
          type: 'rhythm_tap',
          concept: 'rhythm',
          title: '타 타 쉼 타',
          prompt: '리듬 카드를 순서대로 눌러봐: 타, 타, 쉼, 타',
          pattern: ['ta', 'ta', 'rest', 'ta'],
          baseReward: 13,
          hint: '쉼은 소리를 내지 않고 마음속으로 한 박 쉬는 거예요.',
          explain: '쉼표도 박자는 계속 흘러가요. 소리는 쉬지만 마음속 카운트는 멈추지 않아요.'
        },
        {
          id: 'rp-2',
          type: 'rhythm_tap',
          concept: 'rhythm',
          title: '길게 두 박',
          prompt: '타, 길게, 타, 쉼 순서로 눌러봐.',
          pattern: ['ta', 'hold', 'ta', 'rest'],
          baseReward: 14,
          hint: '길게는 손뼉 한 번 뒤에 두 박 동안 소리가 이어진다고 생각해요.',
          explain: '2분음표는 두 박이에요. 빨리 지나가지 말고 길게 느껴요.'
        },
        {
          id: 'rp-3',
          type: 'rhythm_tap',
          concept: 'rhythm',
          title: '티티 달리기',
          prompt: '티티, 타, 티티, 쉼 순서로 눌러봐.',
          pattern: ['ti_ti', 'ta', 'ti_ti', 'rest'],
          baseReward: 15,
          hint: '티티는 한 박 안에 작은 발걸음 두 번이에요.',
          explain: '8분음표 두 개는 한 박을 반으로 나눠요. 말로는 티-티처럼 짧게 느껴요.'
        }
      ]
    },
    {
      id: 'ear-lab',
      title: '소리 실험실',
      emoji: '🔊',
      short: '귀 훈련',
      teacherGoal: '소리를 듣고 같은 음 이름을 찾는 경험을 만든다.',
      missions: [
        {
          id: 'el-1',
          type: 'ear_match',
          concept: 'ear',
          title: '도 소리 찾기',
          prompt: '소리를 듣고 같은 이름의 건반을 찾아봐.',
          targetNote: 'C4',
          targetPitch: 'C',
          acceptAnyOctave: true,
          baseReward: 16,
          hint: '소리를 다시 듣고, 두 검은 건반 왼쪽의 도를 찾아봐.',
          explain: '처음 귀 훈련은 정확한 높이보다 같은 음 이름을 찾는 것이 좋아요.'
        },
        {
          id: 'el-2',
          type: 'ear_match',
          concept: 'ear',
          title: '미 소리 찾기',
          prompt: '이번 소리는 미야. 들어보고 미를 눌러봐.',
          targetNote: 'E4',
          targetPitch: 'E',
          acceptAnyOctave: true,
          baseReward: 16,
          hint: '미는 두 검은 건반 오른쪽이에요.',
          explain: '도-레-미로 노래하면서 미의 느낌을 기억해 보세요.'
        },
        {
          id: 'el-3',
          type: 'ear_match',
          concept: 'ear',
          title: '솔 소리 찾기',
          prompt: '소리를 듣고 솔을 찾아봐.',
          targetNote: 'G4',
          targetPitch: 'G',
          acceptAnyOctave: true,
          baseReward: 16,
          hint: '솔은 파 오른쪽, 검은 건반 3개 묶음 아래에 있어요.',
          explain: '솔은 도에서 다섯 번째 소리라 안정적인 느낌이 있어요.'
        }
      ]
    },
    {
      id: 'theory-camp',
      title: '이론 캠프',
      emoji: '🏕️',
      short: '짧은 퀴즈',
      teacherGoal: '아이들이 위치와 리듬 개념을 말로 설명할 수 있는지 확인한다.',
      missions: [
        {
          id: 'tc-1',
          type: 'quiz',
          concept: 'quiz',
          title: '도는 어디 있을까?',
          prompt: '도는 어떤 검은 건반 묶음 옆에 있을까?',
          options: ['검은 건반 2개 묶음 왼쪽', '검은 건반 3개 묶음 오른쪽', '피아노 맨 끝에만 있음'],
          correctAnswer: '검은 건반 2개 묶음 왼쪽',
          baseReward: 10,
          hint: '도는 항상 두 검은 건반 왼쪽에서 찾을 수 있어요.',
          explain: '피아노에는 도가 여러 개 있지만 찾는 규칙은 같아요.'
        },
        {
          id: 'tc-2',
          type: 'quiz',
          concept: 'quiz',
          title: '쉼표의 비밀',
          prompt: '쉼표가 나오면 박자는 어떻게 될까?',
          options: ['박자가 사라진다', '소리만 쉬고 박자는 계속 간다', '무조건 더 빨라진다'],
          correctAnswer: '소리만 쉬고 박자는 계속 간다',
          baseReward: 10,
          hint: '쉼표는 조용히 쉬지만 마음속 카운트는 계속해요.',
          explain: '쉼표는 음악의 숨이에요. 소리가 없어도 박자는 계속 흘러요.'
        },
        {
          id: 'tc-3',
          type: 'quiz',
          concept: 'quiz',
          title: '2분음표 느낌',
          prompt: '2분음표는 보통 몇 박 동안 길게 느낄까?',
          options: ['한 박', '두 박', '네 박'],
          correctAnswer: '두 박',
          baseReward: 10,
          hint: '이름에 2가 들어가면 두 박이라고 연결해 봐요.',
          explain: '기초 단계에서는 2분음표를 두 박 동안 길게 이어지는 소리로 느끼면 좋아요.'
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
