// ── DATA ──────────────────────────────────────────────────────────────────────
const LETTER =
  'Eu sei que errei, e me arrependo de verdade. Não existe palavra que apague o que aconteceu — mas existe um coração que te ama com tudo, que pensou em você desde que acordou, e que queria tanto ter agido diferente. Você merece o melhor de mim, e é isso que prometo entregar todos os dias.';

const REASONS = [
  { icon: '✨', title: 'Você ilumina tudo',    text: 'Com você, até os dias mais cinzas viram cor. Sua presença transforma tudo ao redor.' },
  { icon: '🤝', title: 'Minha companheira',    text: 'Minha melhor amiga, meu lar. A pessoa com quem quero dividir cada momento da vida.' },
  { icon: '😂', title: 'Aquele riso',          text: 'O seu riso é literalmente a coisa mais bonita que já ouvi. Faço tudo pra ouvir de novo.' },
  { icon: '🌙', title: 'Em todo momento',      text: 'Amo você de manhã, de tarde, de noite — especialmente nos momentos difíceis como este.' },
];

const PROMISES = [
  { icon: '👂', title: 'Escutar mais',        desc: 'Vou ouvir de verdade, sem me defender primeiro. Sua voz importa mais do que aparento.' },
  { icon: '🫂', title: 'Estar presente',      desc: 'Presente de corpo e alma — não só fisicamente. Emocionalmente também.' },
  { icon: '💬', title: 'Comunicar sempre',    desc: 'Nunca mais deixar o silêncio falar por mim. Você merece clareza e honestidade.' },
  { icon: '🌹', title: 'Não te decepcionar', desc: 'Esse erro não vai se repetir. Isso é compromisso, não promessa vazia.' },
];

const R  = (a, b) => Math.random() * (b - a) + a;
const RI = (a, b) => Math.floor(R(a, b));

// ── INTRO ─────────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const intro = document.getElementById('intro');
    intro.classList.add('out');
    setTimeout(() => intro.remove(), 1000);
    // reveal hero after intro fades
    const hero = document.querySelector('.hero.js-reveal');
    if (hero) hero.classList.add('visible');
    startBgHearts();
  }, 2500);
});

// ── BG FLOATING HEARTS ────────────────────────────────────────────────────────
function startBgHearts() {
  const container = document.getElementById('bg-hearts');
  if (!container) return;
  const symbols = ['♡', '♥', '❤', '💕'];
  setInterval(() => {
    const el = document.createElement('span');
    el.className = 'bgheart';
    el.textContent = symbols[RI(0, symbols.length)];
    el.style.cssText = `
      left: ${R(3, 97)}vw;
      bottom: -20px;
      font-size: ${R(11, 20)}px;
      animation-duration: ${R(9, 18)}s;
      animation-delay: 0s;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 19000);
  }, 1400);
}

// ── PETAL CANVAS ──────────────────────────────────────────────────────────────
function initPetals() {
  const canvas = document.getElementById('petals');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const petals = Array.from({ length: 26 }, () => ({
    x:    R(0, window.innerWidth),
    y:    R(-300, window.innerHeight),
    size: R(4, 10),
    vy:   R(0.5, 1.5),
    vx:   R(-0.3, 0.3),
    rot:  R(0, Math.PI * 2),
    rotV: R(-0.016, 0.016),
    alpha:R(0.07, 0.22),
    w:    R(0, Math.PI * 2),
    wv:   R(0.01, 0.025),
  }));

  (function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.w  += p.wv;
      p.x  += p.vx + Math.sin(p.w) * 0.5;
      p.y  += p.vy;
      p.rot += p.rotV;
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = R(0, canvas.width);
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = `hsl(${R(338, 358)}, 65%, 60%)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(tick);
  })();
}

// ── TYPEWRITER ────────────────────────────────────────────────────────────────
let typeStarted = false;

function startTypewriter() {
  if (typeStarted) return;
  typeStarted = true;

  const el  = document.getElementById('typed-text');
  const cur = document.getElementById('cursor');
  if (!el || !cur) return;

  let i = 0;
  function type() {
    if (i < LETTER.length) {
      el.textContent += LETTER[i++];
      setTimeout(type, R(20, 50));
    } else {
      cur.classList.add('gone');
    }
  }
  setTimeout(type, 500);
}

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');

      // stagger reason cards with delay
      el.querySelectorAll('.reason-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), 120 + i * 130);
      });

      // stagger promise items with delay
      el.querySelectorAll('.promise-item').forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), 100 + i * 150);
      });

      // start typewriter when letter section is visible
      if (el.querySelector('#typed-text')) startTypewriter();

      obs.unobserve(el); // only trigger once
    });
  }, { threshold: 0.25 }); // needs 25% visible before triggering

  document.querySelectorAll('.js-reveal').forEach(el => obs.observe(el));
}

// ── BUILD REASONS ─────────────────────────────────────────────────────────────
function buildReasons() {
  const grid = document.getElementById('reasons-grid');
  if (!grid) return;
  REASONS.forEach(({ icon, title, text }) => {
    const div = document.createElement('div');
    div.className = 'reason-card';
    div.innerHTML = `
      <span class="reason-icon">${icon}</span>
      <div class="reason-title">${title}</div>
      <div class="reason-text">${text}</div>
    `;
    grid.appendChild(div);
  });
}

// ── BUILD PROMISES ────────────────────────────────────────────────────────────
function buildPromises() {
  const ul = document.getElementById('promise-list');
  if (!ul) return;
  PROMISES.forEach(({ icon, title, desc }) => {
    const li = document.createElement('li');
    li.className = 'promise-item';
    li.innerHTML = `
      <div class="promise-dot">${icon}</div>
      <div class="promise-content">
        <div class="promise-title">${title}</div>
        <div class="promise-desc">${desc}</div>
      </div>
    `;
    ul.appendChild(li);
  });
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function openModal() {
  const ov = document.getElementById('overlay');
  if (!ov) return;
  ov.classList.add('show');
  ov.setAttribute('aria-hidden', 'false');
  launchConfetti();
  burstHearts();
}

function closeModal() {
  const ov = document.getElementById('overlay');
  if (!ov) return;
  ov.classList.remove('show');
  ov.setAttribute('aria-hidden', 'true');
}

function burstHearts() {
  const emojis = ['💖', '💗', '💓', '🌹', '✨', '🎉', '💝', '🌸', '💫'];
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const span = document.createElement('span');
      // Evita “bug” visual: anima só uma vez (sem alternar transform/opacity em cadeia complexa)
      const startY = R(15, 80);
      const endY = startY - R(40, 95);
      span.style.cssText = `
        position: fixed;
        left: ${R(10, 90)}vw;
        top: ${startY}vh;
        font-size: ${R(20, 44)}px;
        pointer-events: none;
        z-index: 520;
        opacity: 1;
        will-change: transform, opacity;
        transform: translateY(0) scale(1);
        transition: opacity 900ms ease, transform 900ms ease;
      `;
      span.textContent = emojis[RI(0, emojis.length)];
      document.body.appendChild(span);

      // dispara a transição UMA VEZ no próximo frame
      requestAnimationFrame(() => {
        span.style.opacity = '0';
        span.style.transform = `translateY(${-(startY - endY)}px) scale(0.35)`;
      });

      setTimeout(() => span.remove(), 1200);
    }, i * 60);
  }
}

// ── CONFETTI ──────────────────────────────────────────────────────────────────
function launchConfetti() {
  const colors = ['#f9c5c5', '#c0292a', '#ff8080', '#ffd6d6', '#fff', '#ffb3b3'];
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-bit';

    const size = R(6, 13);
    const circle = Math.random() > 0.5;
    const dur = R(1.3, 2.6);
    const delay = R(0, 1.0);

    // use uma rotação + deslocamento em X (melhora “queda” percebida)
    const xDrift = R(-30, 30);
    const spin = R(0, 360);

    c.style.cssText = `
      left: ${R(0, 100)}vw;
      top: 0;
      width: ${circle ? size : size * 2}px;
      height: ${size}px;
      background: ${colors[RI(0, colors.length)]};
      border-radius: ${circle ? '50%' : '2px'};
      transform: rotate(${spin}deg) translateX(0);
      animation: confettiFall ${dur}s ease-in forwards ${delay}s;
      --xdrift: ${xDrift}px;
    `;

    document.body.appendChild(c);
    setTimeout(() => c.remove(), (dur + delay + 0.6) * 1000);
  }
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildReasons();
  buildPromises();
  initReveal();
  initPetals();

  document.getElementById('btn-perdoa')
    ?.addEventListener('click', openModal);
  document.getElementById('btn-close')
    ?.addEventListener('click', closeModal);

  const overlay = document.getElementById('overlay');
  overlay?.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});