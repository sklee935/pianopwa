/* 피아노 탐험대 - 무료 PWA 앱 UI */
(function () {
  'use strict';

  const L = window.PianoPWALogic;
  const C = window.PianoPWAContent;
  const STORAGE_KEY = 'pianopwa-free-state-v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const APP_VERSION = 'keyboard-fix-4';

  const defaultState = {
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
    feedback: '안녕! 오늘은 피아노 보물을 같이 찾아보자. 틀려도 괜찮아. 힌트를 하나씩 줄게.',
    activeMissionId: null,
    attempts: 0,
    readyForNext: false,
    rhythmAttempt: [],
    showTargetHint: false,
    lastPressedMidi: null,
    midiStatus: 'MIDI 연결 전',
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
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(defaultState);
      return deepMerge(clone(defaultState), JSON.parse(raw));
    } catch (error) {
      console.warn('학습 기록을 불러오지 못했어요:', error);
      return clone(defaultState);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('학습 기록 저장 실패:', error);
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
            <h1>피아노 탐험대</h1>
            <p>무료 PWA · 건반 수정 v4</p>
          </div>
        </div>
        <div class="top-stats" aria-label="학습 상태">
          <span class="pill">Lv.${level}</span>
          <span class="pill">${state.xp} XP</span>
          <span class="pill">${'💜'.repeat(state.hearts)}</span>
          <span class="pill">🔥 ${state.streak}</span>
          <span class="pill">${completedCount}/${totalMissions} 완료</span>
          <span id="network-status" class="pill muted">확인 중</span>
        </div>
      </header>
    `;
  }

  function renderProfileCard() {
    const name = escapeHtml(state.profile.studentName || '우리 아이');
    const teacher = escapeHtml(state.profile.teacherName || '피아노 선생님');
    return `
      <section class="card profile-card">
        <div class="profile-avatar" aria-hidden="true">🦊</div>
        <label>학생 이름
          <input data-field="studentName" value="${name}" maxlength="18" />
        </label>
        <label>선생님 이름
          <input data-field="teacherName" value="${teacher}" maxlength="18" />
        </label>
        <div class="button-row">
          <button class="secondary" data-action="install-pwa">📲 설치</button>
          <button class="secondary" data-action="demo-scale">🎵 도레미</button>
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
            <strong>${escapeHtml(lesson.title)}</strong>
            <small>${escapeHtml(lesson.short)} · ${completed}/${lesson.missions.length}</small>
            <span class="mini-progress"><span style="width:${percent}%"></span></span>
          </span>
        </button>
      `;
    }).join('');

    return `
      <section class="card lesson-card">
        <div class="section-heading">
          <h2>오늘의 섬</h2>
          <span>선생님이 고르기</span>
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
            <span class="badge">${lesson.emoji} ${escapeHtml(lesson.title)} · 미션 ${currentMissionNumber()}/${lesson.missions.length}</span>
            <h2>${escapeHtml(mission.title)}</h2>
          </div>
          <button class="primary" data-action="next-mission" ${state.readyForNext ? '' : 'disabled'}>다음 미션</button>
        </div>
        <p class="mission-prompt">${escapeHtml(mission.prompt)}</p>
        <div class="visual-stage">${renderMissionVisual(mission)}</div>
        <div class="tutor-box">
          <div class="tutor-face" aria-hidden="true">🤖</div>
          <div>
            <strong>AI 선생님 · 무료 규칙 모드</strong>
            <p>${escapeHtml(state.feedback)}</p>
            <div class="button-row">
              <button class="secondary" data-action="hint">힌트</button>
              <button class="secondary" data-action="explain">왜 그런지</button>
              ${mission.type === 'ear_match' ? '<button class="primary" data-action="play-target">🔊 소리 듣기</button>' : ''}
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
            <h3>소리를 먼저 들어요</h3>
            <p>들은 소리와 같은 이름의 건반을 눌러봐요. 여러 번 들어도 괜찮아요.</p>
          </div>
        </div>
      `;
    }

    const target = L.koreanNoteName(mission.targetPitch || mission.targetNote);
    return `
      <div class="note-target">
        <div class="target-orb">${target}</div>
        <div>
          <h3>${target} 보물을 찾아요</h3>
          <p>검은 건반 묶음을 먼저 보고, 화면 건반에서 눌러봐요.</p>
        </div>
      </div>
    `;
  }

  function renderStaff(note) {
    const y = staffY(note);
    const label = L.prettyNote(note);
    const ledger = y > 125;
    return `
      <div class="staff-wrap">
        <svg class="staff-svg" viewBox="0 0 560 190" role="img" aria-label="오선지 ${label}">
          <rect x="0" y="0" width="560" height="190" rx="24" fill="#fffaf0" />
          <text x="40" y="132" font-size="84" fill="#58466d">𝄞</text>
          ${[50, 68, 86, 104, 122].map(lineY => `<line x1="126" x2="500" y1="${lineY}" y2="${lineY}" stroke="#6c5a7c" stroke-width="2" />`).join('')}
          ${ledger ? '<line x1="278" x2="356" y1="140" y2="140" stroke="#6c5a7c" stroke-width="2" />' : ''}
          <ellipse cx="318" cy="${y}" rx="24" ry="17" fill="#6d5dfc" transform="rotate(-18 318 ${y})" />
          <line x1="340" x2="340" y1="${y - 1}" y2="${Math.max(34, y - 72)}" stroke="#6d5dfc" stroke-width="6" stroke-linecap="round" />
          <text x="220" y="172" font-size="20" fill="#7b6c8e">${label}를 건반에서 찾아봐</text>
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
        <span>${item.icon}</span><strong>${item.label}</strong><small>${item.description}</small>
      </button>
    `).join('');
    return `
      <div class="rhythm-stage">
        <div>
          <strong>목표 리듬</strong>
          <div class="rhythm-row">${pattern}</div>
        </div>
        <div>
          <strong>내가 누른 순서</strong>
          <div class="rhythm-row">${attempt}</div>
        </div>
        <div class="rhythm-choices">${choices}<button class="secondary" data-action="clear-rhythm">다시 누르기</button></div>
      </div>
    `;
  }

  function rhythmCard(key) {
    const item = C.RHYTHM_LABELS[key] || { label: key, icon: '♪', description: '' };
    return `<div class="rhythm-card"><span>${item.icon}</span><small>${item.label}</small></div>`;
  }

  function renderQuizMission(mission) {
    return `
      <div class="quiz-options">
        ${mission.options.map((option, index) => `<button class="quiz-option" data-action="quiz" data-option-index="${index}">${escapeHtml(option)}</button>`).join('')}
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
            <h2>피아노 건반</h2>
            <p>${escapeHtml(state.midiStatus)} · 흰 건반/검은 건반 모두 좌표로 판정해요. (${APP_VERSION})</p>
          </div>
          <div class="button-row">
            <button class="secondary" data-action="connect-midi">🎛️ MIDI</button>
            <button class="secondary" data-action="demo-scale">도레미 듣기</button>
          </div>
        </div>
        <div class="keyboard" aria-label="C4부터 B5까지 피아노 건반" data-keyboard-version="${APP_VERSION}">
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
    return `
      <button type="button" class="piano-key ${color} ${reveal ? 'target' : ''} ${pressed ? 'pressed' : ''}" style="${style}" data-action="key" data-midi="${key.midi}" aria-label="${key.label} ${key.note}">
        <span class="kr">${key.label}</span>
        <span class="en">${key.note}</span>
      </button>
    `;
  }

  function renderTeacherPanel() {
    const name = state.profile.studentName || '학생';
    const concepts = L.summarizeConcepts(state.conceptStats);
    const rows = concepts.length ? concepts.map(item => {
      const accuracy = item.accuracy ?? 0;
      return `
        <div class="concept-row">
          <div><strong>${escapeHtml(item.label)}</strong><small>${item.correct}/${item.attempts} 정답</small></div>
          <span>${item.accuracy ?? '-'}%</span>
          <div class="concept-bar"><span style="width:${accuracy}%"></span></div>
        </div>
      `;
    }).join('') : '<p class="muted-text">아직 기록이 없어요. 아이가 문제를 풀면 여기에 약한 개념이 보여요.</p>';

    return `
      <section class="card teacher-card">
        <div class="section-heading">
          <h2>선생님 대시보드</h2>
          <span>기기 안에만 저장</span>
        </div>
        <div class="summary-box">
          <strong>${escapeHtml(name)} 리포트</strong>
          <p>${escapeHtml(L.makeStudentSummary(state.conceptStats, name))}</p>
        </div>
        <div class="concept-list">${rows}</div>
        <div class="button-stack">
          <button class="primary" data-action="copy-homework">숙제 문장 복사</button>
          <button class="secondary" data-action="copy-report">리포트 복사</button>
          <button class="secondary" data-action="export-progress">진도 파일 저장</button>
          <button class="secondary" data-action="import-trigger">진도 파일 불러오기</button>
          <button class="danger" data-action="reset-progress">초기화</button>
        </div>
      </section>
    `;
  }

  function renderFreeModeCard() {
    return `
      <section class="card free-card">
        <h2>0원 유지 모드</h2>
        <ul>
          <li>서버 없음</li>
          <li>DB 없음</li>
          <li>실제 AI API 없음</li>
          <li>기록은 이 기기 localStorage에 저장</li>
          <li>GitHub Pages에 올리면 무료 호스팅</li>
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
    // Fallback for older mobile browsers. Modern browsers use pointerdown above.
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
    // Fallback for browsers without PointerEvent. Avoid double-running after pointerdown.
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

    // 1) 검은 건반 영역을 먼저 검사한다. 검은 건반 사이의 빈 공간은 흰 건반으로 내려간다.
    if (y <= blackHeight) {
      for (const black of blacks) {
        const previousWhites = whites.filter(white => white.midi < black.midi).length;
        const left = previousWhites * whiteWidth - blackWidth / 2;
        const right = left + blackWidth;
        if (x >= left && x <= right) return black.midi;
      }
    }

    // 2) 그 외 모든 위치는 흰 건반으로 판정한다.
    const whiteIndex = Math.max(0, Math.min(whites.length - 1, Math.floor(x / whiteWidth)));
    return whites[whiteIndex]?.midi || null;
  }

  function handleClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
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
      state.profile[field] = event.target.value.trim() || defaultState.profile[field];
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
    state.feedback = `${key.label} 소리 좋아! 지금 미션은 ${mission.type === 'rhythm_tap' ? '리듬 버튼' : '퀴즈 선택지'}로 풀어봐.`;
    saveState();
    render();
  }

  function handleQuiz(optionIndex) {
    const mission = currentMission();
    if (mission.type !== 'quiz') return;
    const value = mission.options[optionIndex];
    handleAnswer({ value });
  }

  function handleRhythm(value) {
    const mission = currentMission();
    if (mission.type !== 'rhythm_tap') return;
    if (state.readyForNext) return showToast('다음 미션으로 가볼까요?');
    state.rhythmAttempt = [...state.rhythmAttempt, value].slice(0, mission.pattern.length);
    playRhythmSound(value);
    if (state.rhythmAttempt.length === mission.pattern.length) {
      handleAnswer(state.rhythmAttempt);
    } else {
      state.feedback = `${state.rhythmAttempt.length}번째 박자까지 좋아요. 다음 카드를 눌러봐!`;
      saveState();
      render();
    }
  }

  function clearRhythm() {
    state.rhythmAttempt = [];
    state.feedback = '좋아, 리듬을 처음부터 다시 눌러보자.';
    saveState();
    render();
  }

  function handleAnswer(answer) {
    if (state.readyForNext) {
      showToast('다음 미션 버튼을 눌러 계속해요 ✨');
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
      showToast(`정답! +${reward} XP`);
      burstStars();
    } else {
      state.streak = 0;
      state.totalWrong += 1;
      state.hearts = Math.max(0, state.hearts - 1);
      state.showTargetHint = state.attempts >= 2;
      state.feedback = wrongFeedback(mission);
      if (state.hearts === 0) {
        state.hearts = 5;
        state.feedback = '하트가 잠깐 쉬어가요. 괜찮아! 선생님과 천천히 다시 해보자. 하트를 다시 채웠어요.';
      }
      saveState();
      showToast('아까워! 힌트를 보고 다시 해봐요');
    }
    render();
  }

  function markMissionComplete(missionId) {
    const lessonId = currentLesson().id;
    state.completedMissions[`${lessonId}:${missionId}`] = true;
  }

  function nextMission() {
    if (!state.readyForNext) return showToast('먼저 현재 미션을 풀어봐요');
    const lesson = currentLesson();
    const currentIndex = state.missionIndexByLesson[lesson.id] || 0;
    if (currentIndex + 1 < lesson.missions.length) {
      state.missionIndexByLesson[lesson.id] = currentIndex + 1;
    } else {
      const lessonIndex = C.LESSONS.findIndex(item => item.id === lesson.id);
      const nextLesson = C.LESSONS[(lessonIndex + 1) % C.LESSONS.length];
      state.currentLessonId = nextLesson.id;
      state.missionIndexByLesson[nextLesson.id] = state.missionIndexByLesson[nextLesson.id] || 0;
      showToast(`${nextLesson.title}로 이동했어요!`);
    }
    state.activeMissionId = null;
    saveState();
    render();
  }

  function showHint() {
    const mission = currentMission();
    state.showTargetHint = true;
    state.feedback = mission.hint || L.noteGroupHint(mission.targetPitch || mission.targetNote);
    saveState();
    render();
  }

  function showExplanation() {
    const mission = currentMission();
    state.feedback = mission.explain || '음악 이론은 외우기보다 귀, 눈, 손으로 같이 느끼면 오래 기억나요.';
    saveState();
    render();
  }

  function introFeedback(mission) {
    if (mission.type === 'rhythm_tap') return '리듬은 맞히는 것보다 일정하게 느끼는 게 먼저야. 카드 순서대로 천천히 눌러봐.';
    if (mission.type === 'staff_note') return '악보를 지도처럼 보고, 건반에서 같은 이름을 찾아보자.';
    if (mission.type === 'ear_match') return '소리를 먼저 듣고, 같은 이름의 건반을 찾아봐. 헷갈리면 여러 번 들어도 괜찮아.';
    if (mission.type === 'quiz') return '짧게 생각하고 골라봐. 틀리면 내가 힌트를 줄게.';
    return '검은 건반 묶음을 먼저 보면 음 이름을 더 쉽게 찾을 수 있어!';
  }

  function correctFeedback(mission, reward) {
    const words = ['멋져!', '좋아!', '정확해!', '보물 발견!', '손이 기억했네!'];
    const word = words[Math.floor(Math.random() * words.length)];
    return `${word} ${mission.title} 성공이야. +${reward} XP! 이제 다음 미션으로 가볼까?`;
  }

  function wrongFeedback(mission) {
    if (mission.type === 'quiz') return `괜찮아, 아직 배우는 중이야. 힌트: ${mission.hint}`;
    if (mission.type === 'rhythm_tap') return `리듬 순서가 조금 달랐어. ${mission.hint}`;
    const target = mission.targetPitch || mission.targetNote;
    return `아까워! ${L.koreanNoteName(target)}를 다시 찾아보자. ${mission.hint || L.noteGroupHint(target)}`;
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
      console.warn('소리 재생 실패:', error);
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
      state.midiStatus = '이 브라우저는 Web MIDI를 지원하지 않아요';
      saveState();
      render();
      return showToast('화면 건반으로 먼저 테스트해요');
    }
    try {
      midiAccess = await navigator.requestMIDIAccess();
      wireMidiInputs();
      midiAccess.onstatechange = wireMidiInputs;
      saveState();
      render();
    } catch (error) {
      state.midiStatus = 'MIDI 권한이 허용되지 않았어요';
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
    state.midiStatus = inputs.length ? `MIDI ${inputs.length}개 연결됨` : 'MIDI 장치를 찾지 못했어요';
  }

  async function installPWA() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice.catch(() => null);
      deferredInstallPrompt = null;
      showToast('설치 안내를 확인해 주세요');
      return;
    }
    showToast('브라우저 메뉴에서 “홈 화면에 추가”를 선택해 주세요');
  }

  function copyHomework() {
    const text = L.makeHomeworkText(state.conceptStats, state.profile.studentName || '학생');
    copyText(text, '숙제 문장을 복사했어요');
  }

  function copyReport() {
    copyText(L.createReport(state), '리포트를 복사했어요');
  }

  function copyText(text, message) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast(message)).catch(() => fallbackCopy(text, message));
    } else {
      fallbackCopy(text, message);
    }
  }

  function fallbackCopy(text, message) {
    const area = document.createElement('textarea');
    area.value = text;
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
    showToast('진도 파일을 저장했어요');
  }

  function importProgress(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        state = deepMerge(clone(defaultState), imported);
        saveState();
        render();
        showToast('진도 파일을 불러왔어요');
      } catch (error) {
        showToast('진도 파일을 읽지 못했어요');
      }
    };
    reader.readAsText(file);
  }

  function resetProgress() {
    if (!confirm('XP와 학습 기록을 이 기기에서 초기화할까요?')) return;
    state = clone(defaultState);
    saveState();
    render();
    showToast('초기화했어요');
  }

  function updateNetworkStatus(isOnline) {
    const el = $('#network-status');
    if (!el) return;
    el.textContent = isOnline ? '온라인' : '오프라인';
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
