/* Piano Quest / 피아노 탐험대 - free bilingual PWA UI */
(function () {
  'use strict';

  const L = window.PianoPWALogic;
  const C = window.PianoPWAContent;
  const STORAGE_KEY = 'pianopwa-free-state-v2-bilingual';
  const LEGACY_STORAGE_KEY = 'pianopwa-free-state-v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const APP_VERSION = 'bilingual-1-keyboard-fix-4';

  const I18N = {
    ko: {
      appTitle: '피아노 탐험대',
      subtitle: '무료 PWA · 한/영 전환 · 건반 수정 v4',
      noscript: '이 앱은 JavaScript가 켜져 있어야 사용할 수 있어요.',
      learningStatus: '학습 상태',
      completed: '완료',
      checking: '확인 중',
      online: '온라인',
      offline: '오프라인',
      studentName: '학생 이름',
      teacherName: '선생님 이름',
      install: '📲 설치',
      demoScale: '🎵 도레미',
      listenScale: '도레미 듣기',
      todayIsland: '오늘의 섬',
      teacherPick: '선생님이 고르기',
      mission: '미션',
      nextMission: '다음 미션',
      aiTeacher: 'AI 선생님 · 무료 규칙 모드',
      hint: '힌트',
      explain: '왜 그런지',
      listenSound: '🔊 소리 듣기',
      pianoKeyboard: '피아노 건반',
      midiButton: '🎛️ MIDI',
      keyboardNote: '흰 건반/검은 건반 모두 좌표로 판정해요.',
      keyboardAria: 'C4부터 B5까지 피아노 건반',
      earTitle: '소리를 먼저 들어요',
      earPrompt: '들은 소리와 같은 이름의 건반을 눌러봐요. 여러 번 들어도 괜찮아요.',
      findTreasureTitle: '{note} 보물을 찾아요',
      findTreasurePrompt: '검은 건반 묶음을 먼저 보고, 화면 건반에서 눌러봐요.',
      staffFind: '{note}를 건반에서 찾아봐',
      targetRhythm: '목표 리듬',
      myOrder: '내가 누른 순서',
      clearRhythm: '다시 누르기',
      teacherDashboard: '선생님 대시보드',
      savedOnDevice: '기기 안에만 저장',
      report: '리포트',
      noRecords: '아직 기록이 없어요. 아이가 문제를 풀면 여기에 약한 개념이 보여요.',
      correctCount: '{correct}/{attempts} 정답',
      copyHomework: '숙제 문장 복사',
      copyReport: '리포트 복사',
      exportProgress: '진도 파일 저장',
      importProgress: '진도 파일 불러오기',
      reset: '초기화',
      zeroCostMode: '0원 유지 모드',
      zeroCost1: '서버 없음',
      zeroCost2: 'DB 없음',
      zeroCost3: '실제 AI API 없음',
      zeroCost4: '기록은 이 기기 localStorage에 저장',
      zeroCost5: 'GitHub Pages에 올리면 무료 호스팅',
      midiBefore: 'MIDI 연결 전',
      midiUnsupported: '이 브라우저는 Web MIDI를 지원하지 않아요',
      midiNotAllowed: 'MIDI 권한이 허용되지 않았어요',
      midiNotFound: 'MIDI 장치를 찾지 못했어요',
      midiConnected: 'MIDI {count}개 연결됨',
      screenKeyboardFirst: '화면 건반으로 먼저 테스트해요',
      installCheck: '설치 안내를 확인해 주세요',
      installManual: '브라우저 메뉴에서 “홈 화면에 추가”를 선택해 주세요',
      copiedHomework: '숙제 문장을 복사했어요',
      copiedReport: '리포트를 복사했어요',
      savedProgress: '진도 파일을 저장했어요',
      importedProgress: '진도 파일을 불러왔어요',
      importFailed: '진도 파일을 읽지 못했어요',
      resetConfirm: 'XP와 학습 기록을 이 기기에서 초기화할까요?',
      resetDone: '초기화했어요',
      correctToast: '정답! +{reward} XP',
      tryAgainToast: '아까워! 힌트를 보고 다시 해봐요',
      nextMissionToast: '다음 미션 버튼을 눌러 계속해요 ✨',
      solveFirstToast: '먼저 현재 미션을 풀어봐요',
      nextLessonToast: '{lesson}로 이동했어요!',
      rhythmNextToast: '다음 미션으로 가볼까요?',
      rhythmProgress: '{count}번째 박자까지 좋아요. 다음 카드를 눌러봐!',
      rhythmRestart: '좋아, 리듬을 처음부터 다시 눌러보자.',
      wrongHeartsReset: '하트가 잠깐 쉬어가요. 괜찮아! 선생님과 천천히 다시 해보자. 하트를 다시 채웠어요.',
      keySoundOtherMission: '{note} 소리 좋아! 지금 미션은 {missionType}로 풀어봐.',
      missionTypeRhythm: '리듬 버튼',
      missionTypeQuiz: '퀴즈 선택지',
      introRhythm: '리듬은 맞히는 것보다 일정하게 느끼는 게 먼저야. 카드 순서대로 천천히 눌러봐.',
      introStaff: '악보를 지도처럼 보고, 건반에서 같은 이름을 찾아보자.',
      introEar: '소리를 먼저 듣고, 같은 이름의 건반을 찾아봐. 헷갈리면 여러 번 들어도 괜찮아.',
      introQuiz: '짧게 생각하고 골라봐. 틀리면 내가 힌트를 줄게.',
      introDefault: '검은 건반 묶음을 먼저 보면 음 이름을 더 쉽게 찾을 수 있어!',
      defaultExplain: '음악 이론은 외우기보다 귀, 눈, 손으로 같이 느끼면 오래 기억나요.',
      correctWords: ['멋져!', '좋아!', '정확해!', '보물 발견!', '손이 기억했네!'],
      correctFeedback: '{word} {title} 성공이야. +{reward} XP! 이제 다음 미션으로 가볼까?',
      wrongQuiz: '괜찮아, 아직 배우는 중이야. 힌트: {hint}',
      wrongRhythm: '리듬 순서가 조금 달랐어. {hint}',
      wrongNote: '아까워! {note}를 다시 찾아보자. {hint}',
      languageChanged: '한국어로 바꿨어요.',
      ko: '한국어',
      en: 'English'
    },
    en: {
      appTitle: 'Piano Quest',
      subtitle: 'Free PWA · Korean/English toggle · keyboard fix v4',
      noscript: 'This app needs JavaScript enabled.',
      learningStatus: 'Learning status',
      completed: 'done',
      checking: 'Checking',
      online: 'Online',
      offline: 'Offline',
      studentName: 'Student name',
      teacherName: 'Teacher name',
      install: '📲 Install',
      demoScale: '🎵 C-D-E',
      listenScale: 'Hear C-D-E',
      todayIsland: 'Today’s island',
      teacherPick: 'Teacher picks',
      mission: 'Mission',
      nextMission: 'Next mission',
      aiTeacher: 'AI Teacher · free rule mode',
      hint: 'Hint',
      explain: 'Why?',
      listenSound: '🔊 Listen',
      pianoKeyboard: 'Piano Keyboard',
      midiButton: '🎛️ MIDI',
      keyboardNote: 'White and black keys are detected by tap position.',
      keyboardAria: 'Piano keyboard from C4 to B5',
      earTitle: 'Listen first',
      earPrompt: 'Press the key with the same note name as the sound. You can listen again.',
      findTreasureTitle: 'Find the {note} treasure',
      findTreasurePrompt: 'Look for the black-key groups first, then press the key on the screen.',
      staffFind: 'Find {note} on the keyboard',
      targetRhythm: 'Target rhythm',
      myOrder: 'My order',
      clearRhythm: 'Start over',
      teacherDashboard: 'Teacher Dashboard',
      savedOnDevice: 'Saved only on this device',
      report: 'report',
      noRecords: 'No records yet. When the child solves missions, weak concepts will appear here.',
      correctCount: '{correct}/{attempts} correct',
      copyHomework: 'Copy homework text',
      copyReport: 'Copy report',
      exportProgress: 'Save progress file',
      importProgress: 'Load progress file',
      reset: 'Reset',
      zeroCostMode: 'Zero-cost mode',
      zeroCost1: 'No server',
      zeroCost2: 'No database',
      zeroCost3: 'No real AI API',
      zeroCost4: 'Progress is saved in this device’s localStorage',
      zeroCost5: 'Free hosting with GitHub Pages',
      midiBefore: 'MIDI not connected yet',
      midiUnsupported: 'This browser does not support Web MIDI',
      midiNotAllowed: 'MIDI permission was not allowed',
      midiNotFound: 'No MIDI device found',
      midiConnected: '{count} MIDI input(s) connected',
      screenKeyboardFirst: 'Try the on-screen keyboard first',
      installCheck: 'Please check the install prompt',
      installManual: 'Use your browser menu and choose “Add to Home Screen”',
      copiedHomework: 'Homework text copied',
      copiedReport: 'Report copied',
      savedProgress: 'Progress file saved',
      importedProgress: 'Progress file loaded',
      importFailed: 'Could not read the progress file',
      resetConfirm: 'Reset XP and practice records on this device?',
      resetDone: 'Progress reset',
      correctToast: 'Correct! +{reward} XP',
      tryAgainToast: 'So close! Use the hint and try again',
      nextMissionToast: 'Press Next mission to keep going ✨',
      solveFirstToast: 'Solve the current mission first',
      nextLessonToast: 'Moved to {lesson}!',
      rhythmNextToast: 'Ready for the next mission?',
      rhythmProgress: 'Nice! You finished beat {count}. Tap the next card.',
      rhythmRestart: 'Good, let’s restart the rhythm from the beginning.',
      wrongHeartsReset: 'Hearts are taking a short break. It is okay! Let’s try again slowly. Hearts are refilled.',
      keySoundOtherMission: 'Nice {note} sound! This mission uses the {missionType}.',
      missionTypeRhythm: 'rhythm buttons',
      missionTypeQuiz: 'quiz choices',
      introRhythm: 'For rhythm, feeling a steady beat comes first. Tap the cards slowly in order.',
      introStaff: 'Look at the staff like a map, then find the same note name on the keyboard.',
      introEar: 'Listen first, then find the key with the same note name. You can listen again anytime.',
      introQuiz: 'Think quickly and choose one. If you miss it, I will give you a hint.',
      introDefault: 'Look for the black-key groups first. They make note names easier to find!',
      defaultExplain: 'Music theory sticks better when your ears, eyes, and hands learn together.',
      correctWords: ['Great!', 'Nice!', 'Exactly!', 'Treasure found!', 'Your fingers remembered!'],
      correctFeedback: '{word} You completed “{title}.” +{reward} XP! Ready for the next mission?',
      wrongQuiz: 'That is okay. You are still learning. Hint: {hint}',
      wrongRhythm: 'The rhythm order was a little different. {hint}',
      wrongNote: 'So close! Let’s find {note} again. {hint}',
      languageChanged: 'Switched to English.',
      ko: '한국어',
      en: 'English'
    }
  };

  const defaultState = {
    language: 'ko',
    profile: {
      studentName: '우리 아이',
      teacherName: '피아노 선생님'
    },
    xp: 0,
    hearts: 5,
    streak: 0,
    totalCorrect: 0,
    totalWrong: 0,
    currentLessonId: 'black-key-island',
    missionIndexByLesson: {},
    completedMissions: {},
    conceptStats: {},
    feedback: '',
    activeMissionId: null,
    attempts: 0,
    readyForNext: false,
    rhythmAttempt: [],
    showTargetHint: false,
    lastPressedMidi: null,
    midiStatus: '',
    installDismissed: false
  };

  let state = loadState();
  let audioContext = null;
  let toastTimer = null;
  let deferredInstallPrompt = null;
  let midiAccess = null;
  let lastPointerKeyAt = 0;

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('online', () => updateNetworkStatus(true));
  window.addEventListener('offline', () => updateNetworkStatus(false));
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    render();
  });

  function init() {
    normalizeLanguageState();
    if (!state.midiStatus) state.midiStatus = ui('midiBefore');
    if (!state.feedback) state.feedback = introFeedback(currentMission());
    saveState();
    render();
    document.addEventListener('pointerdown', handlePointerDown, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('click', handleClick);
    document.addEventListener('change', handleChange);
    document.addEventListener('keydown', handleKeyboardShortcut);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) return clone(defaultState);
      return deepMerge(clone(defaultState), JSON.parse(raw));
    } catch (error) {
      console.warn('Could not load learning state:', error);
      return clone(defaultState);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Could not save learning state:', error);
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function deepMerge(base, patch) {
    const output = { ...base };
    Object.keys(patch || {}).forEach(key => {
      if (patch[key] && typeof patch[key] === 'object' && !Array.isArray(patch[key])) {
        output[key] = deepMerge(base[key] || {}, patch[key]);
      } else {
        output[key] = patch[key];
      }
    });
    return output;
  }

  function normalizeLanguageState() {
    if (state.language !== 'en') state.language = 'ko';
    document.documentElement.lang = state.language;
    document.title = ui('appTitle');
  }

  function currentLanguage() {
    return state.language === 'en' ? 'en' : 'ko';
  }

  function ui(key, params = {}) {
    const language = currentLanguage();
    let value = I18N[language][key] ?? I18N.ko[key] ?? key;
    if (Array.isArray(value)) return value;
    return String(value).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '');
  }

  function text(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value[currentLanguage()] ?? value.ko ?? value.en ?? '';
    }
    return value ?? '';
  }

  function textList(value) {
    const result = text(value);
    return Array.isArray(result) ? result : [];
  }

  function currentLesson() {
    return C.LESSONS.find(lesson => lesson.id === state.currentLessonId) || C.LESSONS[0];
  }

  function currentMission() {
    const lesson = currentLesson();
    const index = state.missionIndexByLesson[lesson.id] || 0;
    return lesson.missions[index] || lesson.missions[0];
  }

  function currentMissionNumber() {
    return (state.missionIndexByLesson[currentLesson().id] || 0) + 1;
  }

  function ensureMissionState() {
    const mission = currentMission();
    if (state.activeMissionId !== mission.id) {
      state.activeMissionId = mission.id;
      state.attempts = 0;
      state.readyForNext = false;
      state.rhythmAttempt = [];
      state.showTargetHint = false;
      state.feedback = introFeedback(mission);
      saveState();
    }
  }

  function render() {
    normalizeLanguageState();
    ensureMissionState();
    const app = $('#app');
    app.innerHTML = `
      ${renderHeader()}
      <div class="layout-grid">
        <aside class="left-panel">${renderProfileCard()}${renderLessonList()}</aside>
        <main class="main-panel">${renderMissionCard()}${renderKeyboard()}</main>
        <aside class="right-panel">${renderTeacherPanel()}${renderFreeModeCard()}</aside>
      </div>
      <input id="import-file" class="hidden-file" type="file" accept="application/json" aria-hidden="true" />
    `;
    updateNetworkStatus(navigator.onLine);
  }

  function renderHeader() {
    const level = Math.max(1, Math.floor(state.xp / 80) + 1);
    const completedCount = Object.keys(state.completedMissions || {}).length;
    const totalMissions = C.LESSONS.reduce((sum, lesson) => sum + lesson.missions.length, 0);
    return `
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true">🎹</div>
          <div>
            <h1>${escapeHtml(ui('appTitle'))}</h1>
            <p>${escapeHtml(ui('subtitle'))}</p>
          </div>
        </div>
        <div class="top-stats" aria-label="${escapeHtml(ui('learningStatus'))}">
          ${renderLanguageToggle()}
          <span class="pill">Lv.${level}</span>
          <span class="pill">${state.xp} XP</span>
          <span class="pill">${'💜'.repeat(state.hearts)}</span>
          <span class="pill">🔥 ${state.streak}</span>
          <span class="pill">${completedCount}/${totalMissions} ${escapeHtml(ui('completed'))}</span>
          <span id="network-status" class="pill muted">${escapeHtml(ui('checking'))}</span>
        </div>
      </header>
    `;
  }

  function renderLanguageToggle() {
    return `
      <div class="language-toggle" role="group" aria-label="Language">
        <button class="${currentLanguage() === 'ko' ? 'active' : ''}" data-action="set-language" data-language="ko" type="button">한국어</button>
        <button class="${currentLanguage() === 'en' ? 'active' : ''}" data-action="set-language" data-language="en" type="button">English</button>
      </div>
    `;
  }

  function renderProfileCard() {
    const name = escapeHtml(state.profile.studentName || defaultStudentName());
    const teacher = escapeHtml(state.profile.teacherName || defaultTeacherName());
    return `
      <section class="card profile-card">
        <div class="profile-avatar" aria-hidden="true">🦊</div>
        <label>${escapeHtml(ui('studentName'))}
          <input data-field="studentName" value="${name}" maxlength="18" />
        </label>
        <label>${escapeHtml(ui('teacherName'))}
          <input data-field="teacherName" value="${teacher}" maxlength="18" />
        </label>
        <div class="button-row">
          <button class="secondary" data-action="install-pwa">${escapeHtml(ui('install'))}</button>
          <button class="secondary" data-action="demo-scale">${escapeHtml(ui('demoScale'))}</button>
        </div>
      </section>
    `;
  }

  function renderLessonList() {
    const buttons = C.LESSONS.map(lesson => {
      const completed = Object.keys(state.completedMissions || {}).filter(key => key.startsWith(`${lesson.id}:`)).length;
      const percent = Math.round((completed / lesson.missions.length) * 100);
      const active = lesson.id === state.currentLessonId;
      return `
        <button class="lesson-button ${active ? 'active' : ''}" data-action="select-lesson" data-lesson-id="${lesson.id}">
          <span class="lesson-emoji">${lesson.emoji}</span>
          <span class="lesson-copy">
            <strong>${escapeHtml(text(lesson.title))}</strong>
            <small>${escapeHtml(text(lesson.short))} · ${completed}/${lesson.missions.length}</small>
            <span class="mini-progress"><span style="width:${percent}%"></span></span>
          </span>
        </button>
      `;
    }).join('');

    return `
      <section class="card lesson-card">
        <div class="section-heading">
          <h2>${escapeHtml(ui('todayIsland'))}</h2>
          <span>${escapeHtml(ui('teacherPick'))}</span>
        </div>
        <div class="lesson-list">${buttons}</div>
      </section>
    `;
  }

  function renderMissionCard() {
    const lesson = currentLesson();
    const mission = currentMission();
    return `
      <section class="card mission-card">
        <div class="mission-top">
          <div>
            <span class="badge">${lesson.emoji} ${escapeHtml(text(lesson.title))} · ${escapeHtml(ui('mission'))} ${currentMissionNumber()}/${lesson.missions.length}</span>
            <h2>${escapeHtml(text(mission.title))}</h2>
          </div>
          <button class="primary" data-action="next-mission" ${state.readyForNext ? '' : 'disabled'}>${escapeHtml(ui('nextMission'))}</button>
        </div>
        <p class="mission-prompt">${escapeHtml(text(mission.prompt))}</p>
        <div class="visual-stage">${renderMissionVisual(mission)}</div>
        <div class="tutor-box">
          <div class="tutor-face" aria-hidden="true">🤖</div>
          <div>
            <strong>${escapeHtml(ui('aiTeacher'))}</strong>
            <p>${escapeHtml(state.feedback)}</p>
            <div class="button-row">
              <button class="secondary" data-action="hint">${escapeHtml(ui('hint'))}</button>
              <button class="secondary" data-action="explain">${escapeHtml(ui('explain'))}</button>
              ${mission.type === 'ear_match' ? `<button class="primary" data-action="play-target">${escapeHtml(ui('listenSound'))}</button>` : ''}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderMissionVisual(mission) {
    if (mission.type === 'staff_note') return renderStaff(mission.targetNote || `${mission.targetPitch || 'C'}4`);
    if (mission.type === 'rhythm_tap') return renderRhythmMission(mission);
    if (mission.type === 'quiz') return renderQuizMission(mission);
    if (mission.type === 'ear_match') {
      return `
        <div class="ear-stage">
          <button class="big-sound" data-action="play-target">🔊</button>
          <div>
            <h3>${escapeHtml(ui('earTitle'))}</h3>
            <p>${escapeHtml(ui('earPrompt'))}</p>
          </div>
        </div>
      `;
    }

    const target = L.noteName(mission.targetPitch || mission.targetNote, currentLanguage());
    return `
      <div class="note-target">
        <div class="target-orb">${escapeHtml(target)}</div>
        <div>
          <h3>${escapeHtml(ui('findTreasureTitle', { note: target }))}</h3>
          <p>${escapeHtml(ui('findTreasurePrompt'))}</p>
        </div>
      </div>
    `;
  }

  function renderStaff(note) {
    const y = staffY(note);
    const label = L.prettyNote(note, currentLanguage());
    const ledger = y > 125;
    return `
      <div class="staff-wrap">
        <svg class="staff-svg" viewBox="0 0 560 190" role="img" aria-label="Staff ${label}">
          <rect x="0" y="0" width="560" height="190" rx="24" fill="#fffaf0" />
          <text x="40" y="132" font-size="84" fill="#58466d">𝄞</text>
          ${[50, 68, 86, 104, 122].map(lineY => `<line x1="126" x2="500" y1="${lineY}" y2="${lineY}" stroke="#6c5a7c" stroke-width="2" />`).join('')}
          ${ledger ? '<line x1="278" x2="356" y1="140" y2="140" stroke="#6c5a7c" stroke-width="2" />' : ''}
          <ellipse cx="318" cy="${y}" rx="24" ry="17" fill="#6d5dfc" transform="rotate(-18 318 ${y})" />
          <line x1="340" x2="340" y1="${y - 1}" y2="${Math.max(34, y - 72)}" stroke="#6d5dfc" stroke-width="6" stroke-linecap="round" />
          <text x="220" y="172" font-size="20" fill="#7b6c8e">${escapeHtml(ui('staffFind', { note: label }))}</text>
        </svg>
      </div>
    `;
  }

  function staffY(note) {
    const order = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
    const raw = String(note || 'C4').toUpperCase();
    const match = raw.match(/^([A-G])#?(\d)$/);
    const pitch = match ? match[1] : 'C';
    const octave = match ? Number(match[2]) : 4;
    const c4Step = 4 * 7 + order.C;
    const step = octave * 7 + order[pitch];
    return Math.max(38, Math.min(140, 140 - (step - c4Step) * 9));
  }

  function renderRhythmMission(mission) {
    const pattern = mission.pattern.map(rhythmCard).join('');
    const attempt = mission.pattern.map((_, index) => state.rhythmAttempt[index] ? rhythmCard(state.rhythmAttempt[index]) : `<div class="rhythm-card empty"><span>?</span><small>${index + 1}</small></div>`).join('');
    const choices = Object.entries(C.RHYTHM_LABELS).map(([key, item]) => `
      <button class="rhythm-choice" data-action="rhythm" data-rhythm="${key}">
        <span>${item.icon}</span><strong>${escapeHtml(text(item.label))}</strong><small>${escapeHtml(text(item.description))}</small>
      </button>
    `).join('');
    return `
      <div class="rhythm-stage">
        <div>
          <strong>${escapeHtml(ui('targetRhythm'))}</strong>
          <div class="rhythm-row">${pattern}</div>
        </div>
        <div>
          <strong>${escapeHtml(ui('myOrder'))}</strong>
          <div class="rhythm-row">${attempt}</div>
        </div>
        <div class="rhythm-choices">${choices}<button class="secondary" data-action="clear-rhythm">${escapeHtml(ui('clearRhythm'))}</button></div>
      </div>
    `;
  }

  function rhythmCard(key) {
    const item = C.RHYTHM_LABELS[key] || { label: key, icon: '♪', description: '' };
    return `<div class="rhythm-card"><span>${item.icon}</span><small>${escapeHtml(text(item.label))}</small></div>`;
  }

  function renderQuizMission(mission) {
    const options = textList(mission.options);
    return `
      <div class="quiz-options">
        ${options.map((option, index) => `<button class="quiz-option" data-action="quiz" data-option-index="${index}">${escapeHtml(option)}</button>`).join('')}
      </div>
    `;
  }

  function renderKeyboard() {
    const whites = C.KEYBOARD.filter(key => !key.isBlack);
    const blacks = C.KEYBOARD.filter(key => key.isBlack);
    const whiteWidth = 100 / whites.length;
    const blackWidth = whiteWidth * 0.62;

    const whiteKeys = whites.map((key, index) => {
      const left = index * whiteWidth;
      return renderKey(key, 'white', `left:${left}%;width:calc(${whiteWidth}% - 4px);`);
    }).join('');

    const blackKeys = blacks.map(key => {
      const previousWhites = whites.filter(white => white.midi < key.midi).length;
      const left = previousWhites * whiteWidth - blackWidth / 2;
      return renderKey(key, 'black', `left:${left}%;width:${blackWidth}%;`);
    }).join('');

    return `
      <section class="card keyboard-card">
        <div class="keyboard-head">
          <div>
            <h2>${escapeHtml(ui('pianoKeyboard'))}</h2>
            <p>${escapeHtml(state.midiStatus || ui('midiBefore'))} · ${escapeHtml(ui('keyboardNote'))} (${APP_VERSION})</p>
          </div>
          <div class="button-row">
            <button class="secondary" data-action="connect-midi">${escapeHtml(ui('midiButton'))}</button>
            <button class="secondary" data-action="demo-scale">${escapeHtml(ui('listenScale'))}</button>
          </div>
        </div>
        <div class="keyboard" aria-label="${escapeHtml(ui('keyboardAria'))}" data-keyboard-version="${APP_VERSION}">
          <div class="keyboard-inner">${whiteKeys}${blackKeys}</div>
        </div>
      </section>
    `;
  }

  function renderKey(key, color, style = '') {
    const mission = currentMission();
    const targetPitch = L.normalizePitchClass(mission.targetPitch || mission.targetNote || '');
    const reveal = state.showTargetHint && targetPitch && key.pitchClass === targetPitch;
    const pressed = state.lastPressedMidi === key.midi;
    const primary = L.noteName(key.pitchClass, currentLanguage());
    const secondary = currentLanguage() === 'en' ? `${L.koreanNoteName(key.pitchClass)} · ${key.note}` : key.note;
    return `
      <button type="button" class="piano-key ${color} ${reveal ? 'target' : ''} ${pressed ? 'pressed' : ''}" style="${style}" data-action="key" data-midi="${key.midi}" aria-label="${escapeHtml(primary)} ${key.note}">
        <span class="kr">${escapeHtml(primary)}</span>
        <span class="en">${escapeHtml(secondary)}</span>
      </button>
    `;
  }

  function renderTeacherPanel() {
    const name = state.profile.studentName || defaultStudentName();
    const concepts = L.summarizeConcepts(state.conceptStats, currentLanguage());
    const rows = concepts.length ? concepts.map(item => {
      const accuracy = item.accuracy ?? 0;
      return `
        <div class="concept-row">
          <div><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(ui('correctCount', { correct: item.correct, attempts: item.attempts }))}</small></div>
          <span>${item.accuracy ?? '-'}%</span>
          <div class="concept-bar"><span style="width:${accuracy}%"></span></div>
        </div>
      `;
    }).join('') : `<p class="muted-text">${escapeHtml(ui('noRecords'))}</p>`;

    return `
      <section class="card teacher-card">
        <div class="section-heading">
          <h2>${escapeHtml(ui('teacherDashboard'))}</h2>
          <span>${escapeHtml(ui('savedOnDevice'))}</span>
        </div>
        <div class="summary-box">
          <strong>${escapeHtml(name)} ${escapeHtml(ui('report'))}</strong>
          <p>${escapeHtml(L.makeStudentSummary(state.conceptStats, name, currentLanguage()))}</p>
        </div>
        <div class="concept-list">${rows}</div>
        <div class="button-stack">
          <button class="primary" data-action="copy-homework">${escapeHtml(ui('copyHomework'))}</button>
          <button class="secondary" data-action="copy-report">${escapeHtml(ui('copyReport'))}</button>
          <button class="secondary" data-action="export-progress">${escapeHtml(ui('exportProgress'))}</button>
          <button class="secondary" data-action="import-trigger">${escapeHtml(ui('importProgress'))}</button>
          <button class="danger" data-action="reset-progress">${escapeHtml(ui('reset'))}</button>
        </div>
      </section>
    `;
  }

  function renderFreeModeCard() {
    return `
      <section class="card free-card">
        <h2>${escapeHtml(ui('zeroCostMode'))}</h2>
        <ul>
          <li>${escapeHtml(ui('zeroCost1'))}</li>
          <li>${escapeHtml(ui('zeroCost2'))}</li>
          <li>${escapeHtml(ui('zeroCost3'))}</li>
          <li>${escapeHtml(ui('zeroCost4'))}</li>
          <li>${escapeHtml(ui('zeroCost5'))}</li>
        </ul>
      </section>
    `;
  }

  function handlePointerDown(event) {
    const keyboard = event.target.closest('.keyboard');
    if (!keyboard) return;

    const midi = resolveKeyboardMidiFromPoint(event.clientX, event.clientY, keyboard);
    if (!midi) return;

    event.preventDefault();
    lastPointerKeyAt = Date.now();
    handleKeyPress(midi, 'screen');
  }

  function handleTouchStart(event) {
    if (Date.now() - lastPointerKeyAt < 120) return;
    const touch = event.changedTouches && event.changedTouches[0];
    if (!touch) return;
    const target = document.elementFromPoint(touch.clientX, touch.clientY) || event.target;
    const keyboard = target.closest ? target.closest('.keyboard') : null;
    if (!keyboard) return;

    const midi = resolveKeyboardMidiFromPoint(touch.clientX, touch.clientY, keyboard);
    if (!midi) return;

    event.preventDefault();
    lastPointerKeyAt = Date.now();
    handleKeyPress(midi, 'screen');
  }

  function handleMouseDown(event) {
    if (Date.now() - lastPointerKeyAt < 120) return;
    const keyboard = event.target.closest('.keyboard');
    if (!keyboard) return;

    const midi = resolveKeyboardMidiFromPoint(event.clientX, event.clientY, keyboard);
    if (!midi) return;

    event.preventDefault();
    lastPointerKeyAt = Date.now();
    handleKeyPress(midi, 'screen');
  }

  function resolveKeyboardMidiFromPoint(clientX, clientY, keyboard) {
    if (!keyboard) return null;
    const inner = keyboard.querySelector('.keyboard-inner') || keyboard;
    const rect = inner.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;

    const whites = C.KEYBOARD.filter(key => !key.isBlack);
    const blacks = C.KEYBOARD.filter(key => key.isBlack);
    const whiteWidth = rect.width / whites.length;
    const blackWidth = whiteWidth * 0.62;
    const blackHeight = rect.height * 0.62;

    if (y <= blackHeight) {
      for (const black of blacks) {
        const previousWhites = whites.filter(white => white.midi < black.midi).length;
        const left = previousWhites * whiteWidth - blackWidth / 2;
        const right = left + blackWidth;
        if (x >= left && x <= right) return black.midi;
      }
    }

    const whiteIndex = Math.max(0, Math.min(whites.length - 1, Math.floor(x / whiteWidth)));
    return whites[whiteIndex]?.midi || null;
  }

  function handleClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'set-language') return setLanguage(button.dataset.language);
    if (action === 'select-lesson') return selectLesson(button.dataset.lessonId);
    if (action === 'key') {
      if (Date.now() - lastPointerKeyAt < 700) return;
      return handleKeyPress(Number(button.dataset.midi), 'screen');
    }
    if (action === 'hint') return showHint();
    if (action === 'explain') return showExplanation();
    if (action === 'next-mission') return nextMission();
    if (action === 'play-target') return playTarget();
    if (action === 'rhythm') return handleRhythm(button.dataset.rhythm);
    if (action === 'clear-rhythm') return clearRhythm();
    if (action === 'quiz') return handleQuiz(Number(button.dataset.optionIndex));
    if (action === 'demo-scale') return playScale();
    if (action === 'connect-midi') return connectMidi();
    if (action === 'install-pwa') return installPWA();
    if (action === 'copy-homework') return copyHomework();
    if (action === 'copy-report') return copyReport();
    if (action === 'export-progress') return exportProgress();
    if (action === 'import-trigger') return $('#import-file')?.click();
    if (action === 'reset-progress') return resetProgress();
  }

  function handleChange(event) {
    if (event.target.matches('[data-field]')) {
      const field = event.target.dataset.field;
      state.profile[field] = event.target.value.trim() || defaultProfileValue(field);
      saveState();
      render();
      return;
    }
    if (event.target.id === 'import-file' && event.target.files?.[0]) {
      importProgress(event.target.files[0]);
    }
  }

  function handleKeyboardShortcut(event) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
    const mapping = {
      a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66, g: 67, y: 68, h: 69, u: 70, j: 71,
      k: 72, o: 73, l: 74, p: 75, ';': 76, "'": 77
    };
    const midi = mapping[event.key.toLowerCase()] || mapping[event.key];
    if (midi) handleKeyPress(midi, 'computer');
  }

  function setLanguage(nextLanguage) {
    const normalized = nextLanguage === 'en' ? 'en' : 'ko';
    if (state.language === normalized) return;
    const oldLang = currentLanguage();
    state.language = normalized;
    if (state.profile.studentName === defaultStudentName(oldLang)) state.profile.studentName = defaultStudentName(normalized);
    if (state.profile.teacherName === defaultTeacherName(oldLang)) state.profile.teacherName = defaultTeacherName(normalized);
    state.midiStatus = ui('midiBefore');
    state.feedback = introFeedback(currentMission());
    saveState();
    render();
    showToast(ui('languageChanged'));
  }

  function defaultStudentName(language = currentLanguage()) {
    return language === 'en' ? 'My Student' : '우리 아이';
  }

  function defaultTeacherName(language = currentLanguage()) {
    return language === 'en' ? 'Piano Teacher' : '피아노 선생님';
  }

  function defaultProfileValue(field) {
    return field === 'teacherName' ? defaultTeacherName() : defaultStudentName();
  }

  function selectLesson(lessonId) {
    if (!C.LESSONS.some(lesson => lesson.id === lessonId)) return;
    state.currentLessonId = lessonId;
    state.activeMissionId = null;
    saveState();
    render();
  }

  function handleKeyPress(midi, source) {
    const key = C.KEYBOARD.find(item => item.midi === midi);
    if (!key) return;
    state.lastPressedMidi = midi;
    playMidi(midi, 0.32);
    const mission = currentMission();
    if (['note_find', 'staff_note', 'ear_match'].includes(mission.type)) {
      handleAnswer({ note: key.note, pitchClass: key.pitchClass, source });
      return;
    }
    const note = L.noteName(key.pitchClass, currentLanguage());
    const missionType = mission.type === 'rhythm_tap' ? ui('missionTypeRhythm') : ui('missionTypeQuiz');
    state.feedback = ui('keySoundOtherMission', { note, missionType });
    saveState();
    render();
  }

  function handleQuiz(optionIndex) {
    const mission = currentMission();
    if (mission.type !== 'quiz') return;
    const options = textList(mission.options);
    const value = options[optionIndex];
    handleAnswer({ value, index: optionIndex });
  }

  function handleRhythm(value) {
    const mission = currentMission();
    if (mission.type !== 'rhythm_tap') return;
    if (state.readyForNext) return showToast(ui('rhythmNextToast'));
    state.rhythmAttempt = [...state.rhythmAttempt, value].slice(0, mission.pattern.length);
    playRhythmSound(value);
    if (state.rhythmAttempt.length === mission.pattern.length) {
      handleAnswer(state.rhythmAttempt);
    } else {
      state.feedback = ui('rhythmProgress', { count: state.rhythmAttempt.length });
      saveState();
      render();
    }
  }

  function clearRhythm() {
    state.rhythmAttempt = [];
    state.feedback = ui('rhythmRestart');
    saveState();
    render();
  }

  function handleAnswer(answer) {
    if (state.readyForNext) {
      showToast(ui('nextMissionToast'));
      return;
    }
    const mission = currentMission();
    state.attempts += 1;
    const correct = L.isCorrectAnswer(mission, answer);
    state.conceptStats = L.updateConceptStats(state.conceptStats, mission.concept, correct);

    if (correct) {
      const reward = L.calculateReward({ correct: true, streak: state.streak, attempts: state.attempts, base: mission.baseReward || 10 });
      state.xp += reward;
      state.streak += 1;
      state.totalCorrect += 1;
      state.readyForNext = true;
      state.hearts = Math.min(5, state.hearts + (state.streak % 4 === 0 ? 1 : 0));
      state.feedback = correctFeedback(mission, reward);
      markMissionComplete(mission.id);
      saveState();
      showToast(ui('correctToast', { reward }));
      burstStars();
    } else {
      state.streak = 0;
      state.totalWrong += 1;
      state.hearts = Math.max(0, state.hearts - 1);
      state.showTargetHint = state.attempts >= 2;
      state.feedback = wrongFeedback(mission);
      if (state.hearts === 0) {
        state.hearts = 5;
        state.feedback = ui('wrongHeartsReset');
      }
      saveState();
      showToast(ui('tryAgainToast'));
    }
    render();
  }

  function markMissionComplete(missionId) {
    const lessonId = currentLesson().id;
    state.completedMissions[`${lessonId}:${missionId}`] = true;
  }

  function nextMission() {
    if (!state.readyForNext) return showToast(ui('solveFirstToast'));
    const lesson = currentLesson();
    const currentIndex = state.missionIndexByLesson[lesson.id] || 0;
    if (currentIndex + 1 < lesson.missions.length) {
      state.missionIndexByLesson[lesson.id] = currentIndex + 1;
    } else {
      const lessonIndex = C.LESSONS.findIndex(item => item.id === lesson.id);
      const nextLesson = C.LESSONS[(lessonIndex + 1) % C.LESSONS.length];
      state.currentLessonId = nextLesson.id;
      state.missionIndexByLesson[nextLesson.id] = state.missionIndexByLesson[nextLesson.id] || 0;
      showToast(ui('nextLessonToast', { lesson: text(nextLesson.title) }));
    }
    state.activeMissionId = null;
    saveState();
    render();
  }

  function showHint() {
    const mission = currentMission();
    state.showTargetHint = true;
    state.feedback = text(mission.hint) || L.noteGroupHint(mission.targetPitch || mission.targetNote, currentLanguage());
    saveState();
    render();
  }

  function showExplanation() {
    const mission = currentMission();
    state.feedback = text(mission.explain) || ui('defaultExplain');
    saveState();
    render();
  }

  function introFeedback(mission) {
    if (mission.type === 'rhythm_tap') return ui('introRhythm');
    if (mission.type === 'staff_note') return ui('introStaff');
    if (mission.type === 'ear_match') return ui('introEar');
    if (mission.type === 'quiz') return ui('introQuiz');
    return ui('introDefault');
  }

  function correctFeedback(mission, reward) {
    const words = ui('correctWords');
    const word = words[Math.floor(Math.random() * words.length)];
    return ui('correctFeedback', { word, title: text(mission.title), reward });
  }

  function wrongFeedback(mission) {
    const hint = text(mission.hint) || L.noteGroupHint(mission.targetPitch || mission.targetNote, currentLanguage());
    if (mission.type === 'quiz') return ui('wrongQuiz', { hint });
    if (mission.type === 'rhythm_tap') return ui('wrongRhythm', { hint });
    const target = mission.targetPitch || mission.targetNote;
    return ui('wrongNote', { note: L.noteName(target, currentLanguage()), hint });
  }

  function playTarget() {
    const mission = currentMission();
    const midi = L.noteToMidi(mission.targetNote || `${mission.targetPitch || 'C'}4`);
    if (midi !== null) playMidi(midi, 0.72);
  }

  function playScale() {
    const scale = [60, 62, 64, 65, 67, 69, 71, 72];
    scale.forEach((midi, index) => setTimeout(() => playMidi(midi, 0.24), index * 230));
  }

  function ensureAudio() {
    if (!audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
    }
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }

  function playMidi(midi, duration = 0.35) {
    try {
      const ctx = ensureAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = L.frequencyFromMidi(midi);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.03);
    } catch (error) {
      console.warn('Sound failed:', error);
    }
  }

  function playRhythmSound(value) {
    if (value === 'rest') return;
    if (value === 'hold') return playMidi(48, 0.5);
    if (value === 'ti_ti') {
      playMidi(72, 0.09);
      setTimeout(() => playMidi(72, 0.09), 120);
      return;
    }
    playMidi(72, 0.12);
  }

  async function connectMidi() {
    if (!navigator.requestMIDIAccess) {
      state.midiStatus = ui('midiUnsupported');
      saveState();
      render();
      return showToast(ui('screenKeyboardFirst'));
    }
    try {
      midiAccess = await navigator.requestMIDIAccess();
      wireMidiInputs();
      midiAccess.onstatechange = wireMidiInputs;
      saveState();
      render();
    } catch (error) {
      state.midiStatus = ui('midiNotAllowed');
      saveState();
      render();
    }
  }

  function wireMidiInputs() {
    const inputs = Array.from(midiAccess?.inputs?.values?.() || []);
    inputs.forEach(input => {
      input.onmidimessage = event => {
        const [status, note, velocity] = event.data;
        const command = status & 0xf0;
        if (command === 0x90 && velocity > 0) handleKeyPress(note, 'midi');
      };
    });
    state.midiStatus = inputs.length ? ui('midiConnected', { count: inputs.length }) : ui('midiNotFound');
  }

  async function installPWA() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice.catch(() => null);
      deferredInstallPrompt = null;
      showToast(ui('installCheck'));
      return;
    }
    showToast(ui('installManual'));
  }

  function copyHomework() {
    const textToCopy = L.makeHomeworkText(state.conceptStats, state.profile.studentName || defaultStudentName(), currentLanguage());
    copyText(textToCopy, ui('copiedHomework'));
  }

  function copyReport() {
    copyText(L.createReport(state, currentLanguage()), ui('copiedReport'));
  }

  function copyText(textToCopy, message) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => showToast(message)).catch(() => fallbackCopy(textToCopy, message));
    } else {
      fallbackCopy(textToCopy, message);
    }
  }

  function fallbackCopy(textToCopy, message) {
    const area = document.createElement('textarea');
    area.value = textToCopy;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    showToast(message);
  }

  function exportProgress() {
    const fileName = `piano-progress-${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast(ui('savedProgress'));
  }

  function importProgress(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        state = deepMerge(clone(defaultState), imported);
        normalizeLanguageState();
        saveState();
        render();
        showToast(ui('importedProgress'));
      } catch (error) {
        showToast(ui('importFailed'));
      }
    };
    reader.readAsText(file);
  }

  function resetProgress() {
    if (!confirm(ui('resetConfirm'))) return;
    const language = currentLanguage();
    state = clone(defaultState);
    state.language = language;
    state.profile.studentName = defaultStudentName(language);
    state.profile.teacherName = defaultTeacherName(language);
    state.midiStatus = ui('midiBefore');
    state.feedback = introFeedback(currentMission());
    saveState();
    render();
    showToast(ui('resetDone'));
  }

  function updateNetworkStatus(isOnline) {
    const el = $('#network-status');
    if (!el) return;
    el.textContent = isOnline ? ui('online') : ui('offline');
    el.className = `pill ${isOnline ? 'online' : 'offline'}`;
  }

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }

  function burstStars() {
    const app = $('#app');
    for (let index = 0; index < 10; index += 1) {
      const star = document.createElement('span');
      star.className = 'star-burst';
      star.textContent = ['⭐', '✨', '🎵'][index % 3];
      star.style.left = `${20 + Math.random() * 60}%`;
      star.style.top = `${20 + Math.random() * 36}%`;
      star.style.animationDelay = `${Math.random() * 0.12}s`;
      app.appendChild(star);
      setTimeout(() => star.remove(), 950);
    }
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
