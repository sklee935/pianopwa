const assert = require('node:assert/strict');
const L = require('../src/logic.js');

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

test('normalizes English and Korean note names', () => {
  assert.equal(L.normalizePitchClass('C4'), 'C');
  assert.equal(L.normalizePitchClass('도4'), 'C');
  assert.equal(L.normalizePitchClass('Bb3'), 'A#');
  assert.equal(L.normalizePitchClass('파#'), 'F#');
});

test('converts midi and note names', () => {
  assert.equal(L.midiToNote(60), 'C4');
  assert.equal(L.noteToMidi('C4'), 60);
  assert.equal(L.noteToMidi('도4'), 60);
  assert.equal(L.koreanNoteName('G#4'), '솔#');
});

test('checks note missions with any octave', () => {
  const mission = { type: 'note_find', targetPitch: 'C', acceptAnyOctave: true };
  assert.equal(L.isCorrectAnswer(mission, { note: 'C5', pitchClass: 'C' }), true);
  assert.equal(L.isCorrectAnswer(mission, { note: 'D4', pitchClass: 'D' }), false);
});

test('checks exact note mission when any octave is false', () => {
  const mission = { type: 'staff_note', targetNote: 'E4', acceptAnyOctave: false };
  assert.equal(L.isCorrectAnswer(mission, { note: 'E4', pitchClass: 'E' }), true);
  assert.equal(L.isCorrectAnswer(mission, { note: 'E5', pitchClass: 'E' }), false);
});

test('checks rhythm and quiz missions', () => {
  assert.equal(L.isCorrectAnswer({ type: 'rhythm_tap', pattern: ['ta', 'rest'] }, ['ta', 'rest']), true);
  assert.equal(L.isCorrectAnswer({ type: 'rhythm_tap', pattern: ['ta', 'rest'] }, ['rest', 'ta']), false);
  assert.equal(L.isCorrectAnswer({ type: 'quiz', correctAnswer: '두 박' }, { value: '두 박' }), true);
});

test('updates reward and concept stats', () => {
  assert.equal(L.calculateReward({ correct: true, streak: 3, attempts: 1, base: 10 }), 16);
  assert.equal(L.calculateReward({ correct: false, streak: 3, attempts: 1, base: 10 }), 0);
  const stats = L.updateConceptStats({}, 'rhythm', false);
  const stats2 = L.updateConceptStats(stats, 'rhythm', true);
  assert.deepEqual(stats2.rhythm, { correct: 1, wrong: 1 });
  assert.equal(L.conceptAccuracy(stats2.rhythm), 50);
});


test('supports English labels and reports', () => {
  assert.equal(L.noteName('G#4', 'en'), 'G#');
  assert.match(L.noteGroupHint('C', 'en'), /two black keys/);
  assert.equal(L.conceptLabel('rhythm', 'en'), 'Rhythm reading');
  const summary = L.makeStudentSummary({}, 'Mina', 'en');
  assert.match(summary, /Mina/);
});

test('checks bilingual quiz missions by option index', () => {
  const mission = { type: 'quiz', correctOptionIndex: 1 };
  assert.equal(L.isCorrectAnswer(mission, { index: 1, value: 'Two beats' }), true);
  assert.equal(L.isCorrectAnswer(mission, { index: 0, value: 'One beat' }), false);
});

console.log('All tests passed');
