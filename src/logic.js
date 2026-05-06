/* 피아노 탐험대 - 순수 로직. Browser + Node compatible. */
(function (global) {
  'use strict';

  const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const BASE_TO_SEMITONE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const KR_TO_PITCH = {
    '도': 'C', '도#': 'C#', '레': 'D', '레#': 'D#', '미': 'E',
    '파': 'F', '파#': 'F#', '솔': 'G', '솔#': 'G#', '라': 'A', '라#': 'A#', '시': 'B'
  };
  const PITCH_TO_KR = Object.fromEntries(Object.entries(KR_TO_PITCH).map(([kr, pitch]) => [pitch, kr]));
  const CONCEPT_LABELS = {
    note_position: '건반 위치',
    black_key_group: '검은 건반 묶음',
    staff_note: '오선지-건반 연결',
    rhythm: '리듬 읽기',
    ear: '듣고 찾기',
    quiz: '이론 퀴즈'
  };

  function normalizePitchClass(noteOrPitch) {
    if (noteOrPitch === null || noteOrPitch === undefined) return '';
    const raw = String(noteOrPitch).trim().replace(/♯/g, '#').replace(/♭/g, 'b');
    if (!raw) return '';
    const kr = raw.match(/^(도#?|레#?|미|파#?|솔#?|라#?|시)/);
    if (kr) return KR_TO_PITCH[kr[1]] || '';

    const normalized = raw.toUpperCase();
    const match = normalized.match(/^([A-G])([#B]?)/);
    if (!match) return '';
    const base = match[1];
    const accidental = match[2] || '';
    if (accidental === '#') return PITCH_CLASSES[(BASE_TO_SEMITONE[base] + 1) % 12];
    if (accidental === 'B') return PITCH_CLASSES[(BASE_TO_SEMITONE[base] + 11) % 12];
    return base;
  }

  function pitchClassFromMidi(midi) {
    if (!Number.isFinite(Number(midi))) return '';
    return PITCH_CLASSES[((Math.round(Number(midi)) % 12) + 12) % 12];
  }

  function octaveFromMidi(midi) {
    if (!Number.isFinite(Number(midi))) return null;
    return Math.floor(Math.round(Number(midi)) / 12) - 1;
  }

  function midiToNote(midi) {
    const pitch = pitchClassFromMidi(midi);
    const octave = octaveFromMidi(midi);
    return pitch && octave !== null ? `${pitch}${octave}` : '';
  }

  function noteToMidi(note) {
    if (!note) return null;
    const raw = String(note).trim().replace(/♯/g, '#');
    const krMatch = raw.match(/^(도#?|레#?|미|파#?|솔#?|라#?|시)(-?\d)$/);
    if (krMatch) {
      const pitch = KR_TO_PITCH[krMatch[1]];
      const octave = Number(krMatch[2]);
      return (octave + 1) * 12 + PITCH_CLASSES.indexOf(pitch);
    }
    const match = raw.toUpperCase().match(/^([A-G])(#?)(-?\d)$/);
    if (!match) return null;
    const pitch = normalizePitchClass(match[1] + match[2]);
    const octave = Number(match[3]);
    const index = PITCH_CLASSES.indexOf(pitch);
    return index < 0 ? null : (octave + 1) * 12 + index;
  }

  function frequencyFromMidi(midi) {
    if (!Number.isFinite(Number(midi))) return 0;
    return Math.round(440 * Math.pow(2, (Number(midi) - 69) / 12) * 100) / 100;
  }

  function koreanNoteName(noteOrPitch) {
    const pitch = normalizePitchClass(noteOrPitch);
    return PITCH_TO_KR[pitch] || String(noteOrPitch || '');
  }

  function prettyNote(noteOrPitch) {
    const pitch = normalizePitchClass(noteOrPitch);
    const octaveMatch = String(noteOrPitch || '').match(/(-?\d)$/);
    return `${PITCH_TO_KR[pitch] || noteOrPitch}${octaveMatch ? octaveMatch[1] : ''}`;
  }

  function noteGroupHint(noteOrPitch) {
    const pitch = normalizePitchClass(noteOrPitch);
    const hints = {
      C: '도는 검은 건반 2개 묶음의 바로 왼쪽 흰 건반이에요.',
      D: '레는 검은 건반 2개 묶음 사이에 있어요.',
      E: '미는 검은 건반 2개 묶음의 바로 오른쪽 흰 건반이에요.',
      F: '파는 검은 건반 3개 묶음의 바로 왼쪽 흰 건반이에요.',
      G: '솔은 검은 건반 3개 묶음에서 첫 번째와 두 번째 검은 건반 사이 아래예요.',
      A: '라는 검은 건반 3개 묶음에서 두 번째와 세 번째 검은 건반 사이 아래예요.',
      B: '시는 검은 건반 3개 묶음의 바로 오른쪽 흰 건반이에요.',
      'C#': '도#은 도 바로 오른쪽의 검은 건반이에요.',
      'D#': '레#은 레 바로 오른쪽의 검은 건반이에요.',
      'F#': '파#은 파 바로 오른쪽의 검은 건반이에요.',
      'G#': '솔#은 솔 바로 오른쪽의 검은 건반이에요.',
      'A#': '라#은 라 바로 오른쪽의 검은 건반이에요.'
    };
    return hints[pitch] || '검은 건반 묶음을 먼저 보면 훨씬 쉬워요.';
  }

  function isBlackPitch(pitchClass) {
    return String(pitchClass || '').includes('#');
  }

  function generateKeyboard(startMidi = 60, endMidi = 83) {
    const keys = [];
    for (let midi = startMidi; midi <= endMidi; midi += 1) {
      const pitchClass = pitchClassFromMidi(midi);
      const note = midiToNote(midi);
      keys.push({
        midi,
        note,
        pitchClass,
        octave: octaveFromMidi(midi),
        label: koreanNoteName(pitchClass),
        isBlack: isBlackPitch(pitchClass)
      });
    }
    return keys;
  }

  function isCorrectAnswer(mission, answer) {
    if (!mission) return false;
    if (mission.type === 'quiz') {
      const selected = typeof answer === 'object' && answer ? answer.value : answer;
      return String(selected) === String(mission.correctAnswer);
    }
    if (mission.type === 'rhythm_tap') {
      if (!Array.isArray(answer) || !Array.isArray(mission.pattern)) return false;
      return answer.length === mission.pattern.length && answer.every((value, index) => value === mission.pattern[index]);
    }

    const answerNote = typeof answer === 'object' && answer ? answer.note : String(answer || '');
    const answerPitch = normalizePitchClass(typeof answer === 'object' && answer ? answer.pitchClass || answer.note : answerNote);
    if (!answerPitch) return false;

    if (mission.targetPitch) return normalizePitchClass(mission.targetPitch) === answerPitch;
    if (mission.targetNote && mission.acceptAnyOctave) return normalizePitchClass(mission.targetNote) === answerPitch;
    if (mission.targetNote) return String(answerNote).toUpperCase() === String(mission.targetNote).toUpperCase();
    if (mission.correctAnswer) return normalizePitchClass(mission.correctAnswer) === answerPitch;
    return false;
  }

  function calculateReward({ correct, streak = 0, attempts = 1, base = 10 } = {}) {
    if (!correct) return 0;
    const streakBonus = Math.min(Math.max(Number(streak) || 0, 0), 5) * 2;
    const attemptPenalty = Math.max(0, (Number(attempts) || 1) - 1) * 2;
    return Math.max(5, Math.round(base + streakBonus - attemptPenalty));
  }

  function updateConceptStats(stats, concept, correct) {
    const copy = JSON.parse(JSON.stringify(stats || {}));
    const key = concept || 'general';
    if (!copy[key]) copy[key] = { correct: 0, wrong: 0 };
    if (correct) copy[key].correct += 1;
    else copy[key].wrong += 1;
    return copy;
  }

  function conceptAccuracy(record) {
    const total = (record?.correct || 0) + (record?.wrong || 0);
    return total === 0 ? null : Math.round(((record.correct || 0) / total) * 100);
  }

  function summarizeConcepts(stats) {
    return Object.entries(stats || {}).map(([concept, record]) => ({
      concept,
      label: CONCEPT_LABELS[concept] || concept,
      correct: record.correct || 0,
      wrong: record.wrong || 0,
      attempts: (record.correct || 0) + (record.wrong || 0),
      accuracy: conceptAccuracy(record)
    })).sort((a, b) => {
      if (a.accuracy === null) return 1;
      if (b.accuracy === null) return -1;
      return a.accuracy - b.accuracy;
    });
  }

  function nextReviewConcept(stats) {
    const candidates = summarizeConcepts(stats).filter(item => item.attempts > 0);
    if (!candidates.length) return { concept: 'note_position', label: CONCEPT_LABELS.note_position, accuracy: null, attempts: 0 };
    return candidates[0];
  }

  function makeStudentSummary(stats, studentName = '학생') {
    const review = nextReviewConcept(stats);
    if (review.accuracy === null) {
      return `${studentName}은 아직 기록이 적어요. 오늘은 도 찾기와 검은 건반 2개 묶음부터 시작하면 좋아요.`;
    }
    if (review.accuracy >= 85) {
      return `${studentName}은 전반적으로 잘하고 있어요. 다음에는 오선지와 듣기 미션을 조금 더 섞어도 좋아요.`;
    }
    return `${studentName}은 ${review.label} 정확도가 ${review.accuracy}%예요. 다음 숙제는 이 개념을 3분만 반복해 주세요.`;
  }

  function makeHomeworkText(stats, studentName = '학생') {
    const review = nextReviewConcept(stats);
    if (review.accuracy === null) {
      return `${studentName} 숙제: 피아노 탐험대에서 '도 찾기' 미션을 하루 3분 해오기. 두 검은 건반 왼쪽을 먼저 찾아보세요.`;
    }
    return `${studentName} 숙제: 피아노 탐험대에서 '${review.label}' 미션을 하루 3분 해오기. 틀려도 괜찮으니 힌트를 보고 다시 시도하세요.`;
  }

  function createReport(state) {
    const name = state?.profile?.studentName || '학생';
    const concepts = summarizeConcepts(state?.conceptStats || {});
    const conceptText = concepts.length
      ? concepts.map(item => `- ${item.label}: ${item.accuracy}% (${item.correct}/${item.attempts})`).join('\n')
      : '- 아직 풀이 기록 없음';
    return [
      `피아노 탐험대 학습 리포트 - ${name}`,
      `XP: ${state?.xp || 0}`,
      `연속 정답: ${state?.streak || 0}`,
      `완료 미션: ${Object.keys(state?.completedMissions || {}).length}개`,
      '',
      '개념별 기록',
      conceptText,
      '',
      makeStudentSummary(state?.conceptStats || {}, name),
      makeHomeworkText(state?.conceptStats || {}, name)
    ].join('\n');
  }

  const api = {
    PITCH_CLASSES,
    KR_TO_PITCH,
    PITCH_TO_KR,
    CONCEPT_LABELS,
    normalizePitchClass,
    pitchClassFromMidi,
    octaveFromMidi,
    midiToNote,
    noteToMidi,
    frequencyFromMidi,
    koreanNoteName,
    prettyNote,
    noteGroupHint,
    isBlackPitch,
    generateKeyboard,
    isCorrectAnswer,
    calculateReward,
    updateConceptStats,
    conceptAccuracy,
    summarizeConcepts,
    nextReviewConcept,
    makeStudentSummary,
    makeHomeworkText,
    createReport
  };

  global.PianoPWALogic = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
