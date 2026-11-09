const levels = [
  { name: 'Primii pași', description: 'O putere este o înmulțire repetată. Hai să exersăm!', make: basicQuestion },
  { name: 'Baze speciale', description: 'Descoperă trucurile pentru exponentul 0, exponentul 1 și baza 10.', make: specialQuestion },
  { name: 'Regula înmulțirii', description: 'Aceeași bază la înmulțire? Păstreaz-o și adună exponenții.', make: multiplyQuestion },
  { name: 'Regula împărțirii', description: 'Aceeași bază la împărțire? Păstreaz-o și scade exponenții.', make: divideQuestion },
  { name: 'Maestrul puterilor', description: 'Combină regulile și rezolvă provocări de campion!', make: masterQuestion }
];
const TARGET = 5;
const STORAGE_KEY = 'puteri-in-joaca-v1';
const $ = (id) => document.getElementById(id);
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const power = (base, exponent) => base ** exponent;

function basicQuestion() {
  const base = random(2, 9), exponent = random(2, 5), answer = power(base, exponent);
  return { html: `${base}<sup>${exponent}</sup>`, answer, tip: `Înmulțește baza ${base} cu ea însăși de ${exponent} ori.`, explanation: `${base}<sup>${exponent}</sup> = ${Array(exponent).fill(base).join(' × ')} = <b>${answer}</b>.` };
}
function specialQuestion() {
  const kind = random(1, 4), base = random(2, 20);
  if (kind === 1) return { html: `${base}<sup>0</sup>`, answer: 1, tip: 'Orice număr nenul la puterea 0 este 1.', explanation: `${base}<sup>0</sup> = <b>1</b>.` };
  if (kind === 2) return { html: `${base}<sup>1</sup>`, answer: base, tip: 'Un număr la puterea 1 rămâne același număr.', explanation: `${base}<sup>1</sup> = <b>${base}</b>.` };
  if (kind === 3) { const exponent = random(2, 4), answer = power(10, exponent); return { html: `10<sup>${exponent}</sup>`, answer, tip: `Scrie 1 urmat de ${exponent} zerouri.`, explanation: `10<sup>${exponent}</sup> = <b>${answer}</b>.` }; }
  const exponent = random(2, 5);
  return { html: `1<sup>${exponent}</sup>`, answer: 1, tip: 'Unu înmulțit cu el însuși rămâne unu.', explanation: `1<sup>${exponent}</sup> = <b>1</b>.` };
}
function multiplyQuestion() {
  const base = random(2, 6), m = random(1, 4), n = random(1, 4), answer = power(base, m + n);
  return { html: `${base}<sup>${m}</sup> × ${base}<sup>${n}</sup>`, answer, tip: `Păstrează baza ${base} și adună exponenții: ${m} + ${n}.`, explanation: `${base}<sup>${m}</sup> × ${base}<sup>${n}</sup> = ${base}<sup>${m + n}</sup> = <b>${answer}</b>.` };
}
function divideQuestion() {
  const base = random(2, 8), denominator = random(1, 3), resultExponent = random(1, 3), numerator = denominator + resultExponent, answer = power(base, resultExponent);
  return { html: `${base}<sup>${numerator}</sup> ÷ ${base}<sup>${denominator}</sup>`, answer, tip: `Păstrează baza ${base} și scade exponenții: ${numerator} − ${denominator}.`, explanation: `${base}<sup>${numerator}</sup> ÷ ${base}<sup>${denominator}</sup> = ${base}<sup>${resultExponent}</sup> = <b>${answer}</b>.` };
}
function masterQuestion() {
  const kind = random(1, 3);
  if (kind === 1) {
    const base = random(2, 4), m = random(2, 3), n = random(2, 3), answer = power(base, m * n);
    return { html: `(${base}<sup>${m}</sup>)<sup>${n}</sup>`, answer, tip: 'La o putere ridicată la altă putere, înmulțește exponenții.', explanation: `(${base}<sup>${m}</sup>)<sup>${n}</sup> = ${base}<sup>${m}×${n}</sup> = <b>${answer}</b>.` };
  }
  if (kind === 2) {
    const base = random(2, 4), m = random(2, 4), n = random(1, m - 1), answer = power(base, m);
    return { html: `(${base}<sup>${m}</sup> × ${base}<sup>${n}</sup>) ÷ ${base}<sup>${n}</sup>`, answer, tip: 'Adună exponenții la înmulțire, apoi scade la împărțire.', explanation: `Adunăm exponenții și apoi îi scădem: rezultatul este ${base}<sup>${m}</sup> = <b>${answer}</b>.` };
  }
  const a = random(2, 5), b = random(2, 5), exponent = random(2, 3), answer = power(a * b, exponent);
  return { html: `${a}<sup>${exponent}</sup> × ${b}<sup>${exponent}</sup>`, answer, tip: 'Același exponent? Înmulțește bazele și păstrează exponentul.', explanation: `${a}<sup>${exponent}</sup> × ${b}<sup>${exponent}</sup> = (${a} × ${b})<sup>${exponent}</sup> = <b>${answer}</b>.` };
}
function defaultState() { return { unlocked: 0, current: 0, score: 0, streak: 0, correct: [0, 0, 0, 0, 0] }; }
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return defaultState();
    return { ...defaultState(), ...saved, unlocked: Math.max(0, Math.min(4, Number(saved.unlocked) || 0)), current: Math.max(0, Math.min(4, Number(saved.current) || 0)), score: Math.max(0, Number(saved.score) || 0), streak: Math.max(0, Number(saved.streak) || 0), correct: Array.from({ length: 5 }, (_, i) => Math.max(0, Number(saved.correct?.[i]) || 0)) };
  } catch { return defaultState(); }
}
let state = loadState(), question, answered = false;
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Local storage is optional. */ } }
function render() {
  $('score').textContent = state.score;
  $('streak').textContent = state.streak;
  $('progress-label').textContent = `Nivelul ${state.current + 1} din 5`;
  $('level-tag').textContent = `NIVELUL ${state.current + 1}`;
  $('level-description').textContent = levels[state.current].description;
  const progress = Math.min(TARGET, state.correct[state.current]);
  $('question-count').textContent = `${progress} / ${TARGET} corecte`;
  $('progress-fill').style.width = `${progress / TARGET * 100}%`;
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', progress);
  $('level-list').innerHTML = levels.map((level, i) => {
    const locked = i > state.unlocked;
    return `<button class="level-button ${i === state.current ? 'active' : ''}" type="button" data-level="${i}" ${locked ? 'disabled' : ''} aria-current="${i === state.current ? 'step' : 'false'}"><span class="level-num">${locked ? 'ÎNCUIAT' : `NIVELUL ${i + 1} · ${state.correct[i]}/${TARGET}`}</span><span class="level-name">${level.name}</span></button>`;
  }).join('');
  document.querySelectorAll('.level-button:not(:disabled)').forEach(button => button.addEventListener('click', () => selectLevel(Number(button.dataset.level))));
}
function selectLevel(index) { if (index > state.unlocked) return; state.current = index; saveState(); render(); newQuestion(); }
function newQuestion() {
  question = levels[state.current].make(); answered = false;
  $('question').innerHTML = question.html;
  $('answer').value = ''; $('answer').disabled = false; $('check-button').disabled = false;
  $('next-button').hidden = true; $('feedback').hidden = true; $('hint-box').hidden = true; $('hint-button').hidden = false;
  $('answer-form').classList.remove('shake'); $('answer').focus({ preventScroll: true });
}
function celebrate() {
  const colors = ['#6548e8', '#ffbf47', '#ff6f91', '#38bd91', '#63a6f5'], container = $('celebration');
  container.replaceChildren();
  for (let i = 0; i < 32; i++) {
    const piece = document.createElement('i'); piece.className = 'confetti'; piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length]; piece.style.animationDelay = `${Math.random() * .5}s`; container.appendChild(piece);
  }
  setTimeout(() => container.replaceChildren(), 2200);
}
$('answer-form').addEventListener('submit', event => {
  event.preventDefault();
  if (answered || $('answer').value.trim() === '') return;
  const value = Number($('answer').value);
  if (!Number.isFinite(value)) return;
  answered = true; $('answer').disabled = true; $('check-button').disabled = true; $('hint-button').hidden = true;
  const feedback = $('feedback'); feedback.hidden = false;
  if (value === question.answer) {
    state.streak++; state.score += 10 + Math.min(state.streak - 1, 5) * 2; state.correct[state.current]++;
    feedback.className = 'feedback good'; feedback.innerHTML = `<strong>Bravo! Răspuns corect! 🎉</strong>${question.explanation}`;
    $('question-area').classList.add('pop'); setTimeout(() => $('question-area').classList.remove('pop'), 450); celebrate();
    if (state.correct[state.current] >= TARGET && state.current < 4) {
      state.unlocked = Math.max(state.unlocked, state.current + 1);
      feedback.innerHTML += `<br><b>Nivel nou deblocat: ${levels[state.current + 1].name}! 🚀</b>`;
    }
  } else {
    state.streak = 0; feedback.className = 'feedback try';
    feedback.innerHTML = `<strong>Nu chiar — e în regulă, mai exersăm! 💪</strong>${question.explanation}`;
    $('answer-form').classList.remove('shake'); void $('answer-form').offsetWidth; $('answer-form').classList.add('shake');
  }
  saveState(); render(); $('next-button').hidden = false;
  $('next-button').innerHTML = state.correct[state.current] >= TARGET && state.current < 4 ? `Continuă la nivelul ${state.current + 2} →` : 'Următoarea provocare →';
});
$('next-button').addEventListener('click', () => state.correct[state.current] >= TARGET && state.current < 4 ? selectLevel(state.current + 1) : newQuestion());
$('hint-button').addEventListener('click', () => { $('hint-box').textContent = `💡 ${question.tip}`; $('hint-box').hidden = false; });
render(); newQuestion();
