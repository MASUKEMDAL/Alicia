/* ===== SCRIPT.JS ===== */

// ──────────────────────────────────────────
// SPLASH
// ──────────────────────────────────────────
const splash    = document.getElementById('splash');
const splashBtn = document.getElementById('splashBtn');
const site      = document.getElementById('site');

(function createParticles() {
  const wrap = document.getElementById('splashParticles');
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'sp';
    const size = 2 + Math.random() * 4;
    p.style.cssText = `
      left:${Math.random()*100}%;
      width:${size}px; height:${size}px;
      animation-duration:${4 + Math.random()*7}s;
      animation-delay:${Math.random()*7}s;
    `;
    wrap.appendChild(p);
  }
})();

splashBtn.addEventListener('click', () => {
  splash.classList.add('gone');
  site.classList.add('show');
  loadYT();
});

// ──────────────────────────────────────────
// NAV SCROLL
// ──────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 55);
}, { passive: true });

// ──────────────────────────────────────────
// COUNTER
// ──────────────────────────────────────────
const START = new Date('2023-01-01T00:00:00');

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const now  = new Date();
  const diff = now - START;
  const totalSec = Math.floor(diff / 1000);
  const totalMin = Math.floor(totalSec / 60);
  const totalHr  = Math.floor(totalMin / 60);
  const totalDay = Math.floor(totalHr  / 24);

  const years  = Math.floor(totalDay / 365);
  const months = Math.floor((totalDay % 365) / 30);
  const days   = (totalDay % 365) % 30;
  const hours  = totalHr  % 24;
  const mins   = totalMin % 60;
  const secs   = totalSec % 60;

  set('cY',   years);
  set('cM',   months);
  set('cD',   days);
  set('cH',   pad(hours));
  set('cMin', pad(mins));
  set('cS',   pad(secs));
  set('navCounter', `${years}a ${months}m ${days}d juntos`);
  set('heroYears',  years);
}

function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

tick();
setInterval(tick, 1000);

// ──────────────────────────────────────────
// YOUTUBE PLAYER
// ──────────────────────────────────────────
let yt       = null;
let playing  = false;
let progTmr  = null;

function loadYT() {
  const frame = document.getElementById('ytFrame');
  frame.src = frame.dataset.src;

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function () {
  yt = new YT.Player('ytFrame', {
    events: {
      onReady:       onReady,
      onStateChange: onState,
    }
  });
};

function onReady() {
  const vol = document.getElementById('volSlider');
  if (vol) yt.setVolume(+vol.value);
}

function onState(e) {
  if (e.data === YT.PlayerState.PLAYING) {
    setPlay(true);
    progTmr = setInterval(updateProg, 500);
  } else if (e.data === YT.PlayerState.PAUSED) {
    setPlay(false);
    clearInterval(progTmr);
  } else if (e.data === YT.PlayerState.ENDED) {
    yt.seekTo(0); yt.playVideo();
  }
}

function setPlay(on) {
  playing = on;
  document.querySelector('.ico-play').style.display  = on ? 'none'  : 'block';
  document.querySelector('.ico-pause').style.display = on ? 'block' : 'none';
  document.getElementById('vinyl').classList.toggle('spin', on);
  document.getElementById('npDot').classList.toggle('pulse', on);
}

function fmt(s) {
  const m = Math.floor(s / 60);
  return `${m}:${pad(Math.floor(s % 60))}`;
}

function updateProg() {
  if (!yt || typeof yt.getCurrentTime !== 'function') return;
  const cur = yt.getCurrentTime() || 0;
  const dur = yt.getDuration()    || 0;
  const pct = dur > 0 ? (cur / dur) * 100 : 0;

  const fill  = document.getElementById('progFill');
  const thumb = document.getElementById('progThumb');
  if (fill)  fill.style.width = pct + '%';
  if (thumb) thumb.style.left = pct + '%';
  set('tCur', fmt(cur));
  set('tTot', fmt(dur));
}

// controls
document.getElementById('btnPlay').addEventListener('click', () => {
  if (!yt) return;
  playing ? yt.pauseVideo() : yt.playVideo();
});

document.getElementById('btnPrev').addEventListener('click', () => {
  if (!yt) return;
  yt.seekTo(Math.max(0, (yt.getCurrentTime() || 0) - 10));
});

document.getElementById('btnNext').addEventListener('click', () => {
  if (!yt) return;
  yt.seekTo(0); yt.playVideo();
});

document.getElementById('btnShuffle').addEventListener('click', function () {
  this.classList.toggle('active');
});

document.getElementById('btnHeart').addEventListener('click', function () {
  this.classList.toggle('active');
  this.style.transform = 'scale(1.4)';
  setTimeout(() => this.style.transform = '', 220);
});

document.getElementById('volSlider').addEventListener('input', function () {
  if (!yt || typeof yt.setVolume !== 'function') return;
  const v = +this.value;
  yt.setVolume(v);
  v === 0 ? yt.mute() : yt.unMute();
});

document.getElementById('progBar').addEventListener('click', function (e) {
  if (!yt || typeof yt.getDuration !== 'function') return;
  const pct = (e.clientX - this.getBoundingClientRect().left) / this.offsetWidth;
  yt.seekTo(pct * (yt.getDuration() || 0));
});

// ──────────────────────────────────────────
// LIGHTBOX
// ──────────────────────────────────────────
const IMGS = Array.from({ length: 19 }, (_, i) => `imagens/${i + 1}.jpeg`);
let lbIdx  = 0;

const lb     = document.getElementById('lb');
const lbImg  = document.getElementById('lbImg');
lbImg.style.transition = 'opacity .15s ease';

function openLb(i) {
  lbIdx = i;
  lbImg.src = IMGS[i];
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}
function navLb(i) {
  lbIdx = (i + IMGS.length) % IMGS.length;
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = IMGS[lbIdx];
    lbImg.style.opacity = '1';
  }, 150);
}

document.getElementById('lbClose').addEventListener('click', closeLb);
document.getElementById('lbPrev').addEventListener('click', () => navLb(lbIdx - 1));
document.getElementById('lbNext').addEventListener('click', () => navLb(lbIdx + 1));
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLb();
  if (e.key === 'ArrowLeft')   navLb(lbIdx - 1);
  if (e.key === 'ArrowRight')  navLb(lbIdx + 1);
});

document.querySelectorAll('[data-li]').forEach(el => {
  el.addEventListener('click', () => openLb(+el.dataset.li));
});

// ──────────────────────────────────────────
// SCROLL FADE ANIMATIONS
// ──────────────────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
  });
}, { threshold: 0.1 });

function addFade(sel, stagger) {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('fade');
    if (stagger) el.style.transitionDelay = (i * 0.08) + 's';
    io.observe(el);
  });
}

addFade('.player-card');
addFade('.counter-card');
addFade('.msg-card');
addFade('.tl-item', true);
addFade('.gal-top');
addFade('.gal-strip', true);
addFade('.sec-header');
addFade('.footer');
