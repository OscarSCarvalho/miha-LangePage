'use strict';

const nav = document.querySelector('.nav');
const progressBar = document.getElementById('reading-progress');
const floatBtn = document.getElementById('float-whatsapp');
const heroSection = document.getElementById('hero');

// Scroll: progress bar + nav + botão flutuante
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progressBar.style.width = pct + '%';
  nav.classList.toggle('scrolled', scrollTop > 80);

  // Mostra botão flutuante após sair do hero
  const heroBoundary = heroSection ? heroSection.offsetHeight * 0.8 : 600;
  if (scrollTop > heroBoundary) {
    floatBtn.removeAttribute('hidden');
  } else {
    floatBtn.setAttribute('hidden', '');
  }
}, { passive: true });

// Menu hamburger
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Fade-in via IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// WhatsApp — todos os botões com data-whatsapp
function openWhatsApp(number) {
  const phone = '55' + number.replace(/\D/g, '');
  const msg = encodeURIComponent('Olá Oscar! Vi sua história e quero levar sua palestra ao meu evento. Podemos conversar?');
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank', 'noopener,noreferrer');
}

document.querySelectorAll('[data-whatsapp]').forEach(btn => {
  btn.addEventListener('click', () => openWhatsApp(btn.dataset.whatsapp));
});

// Scroll suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Contador animado nos cards "Hoje"
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  let current = 0;
  const duration = 1200;
  const step = Math.ceil(duration / target);
  const timer = setInterval(() => {
    current++;
    el.textContent = current;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// Carrossel da Família — botões de navegação
const famTrack = document.querySelector('.fam-track');
document.querySelectorAll('.fam-nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!famTrack) return;
    const card = famTrack.querySelector('.fam-card');
    const step = card ? card.getBoundingClientRect().width + 20 : 300;
    famTrack.scrollBy({ left: step * Number(btn.dataset.dir), behavior: 'smooth' });
  });
});

// ============================================================
// A Jornada — motion em canvas (loop de 10s)
// Uma figura sobe uma escadaria 3D: da escuridão (vida perdida)
// até a luz do sol nascente (conquista).
// ============================================================
(function jornada() {
  const section = document.getElementById('jornada');
  const canvas = section && section.querySelector('.jornada-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const words = section.querySelectorAll('.jw');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LOOP = 10000;
  const N = 12;
  let W = 0, H = 0, running = false, raf = 0, start = performance.now(), lastWord = -1;

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const mix = (c1, c2, t) => `rgb(${Math.round(lerp(c1[0], c2[0], t))},${Math.round(lerp(c1[1], c2[1], t))},${Math.round(lerp(c1[2], c2[2], t))})`;

  const particles = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + 0.4, s: Math.random() * 0.5 + 0.5, w: Math.random() * Math.PI * 2 }));

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = section.clientWidth; H = section.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame(p, dt) {
    const light = ease(clamp((p - 0.15) / 0.75));         // 0 = escuro, 1 = luz plena
    const mobile = W < 700;

    // Céu
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, mix([4, 4, 6], [38, 30, 22], light));
    sky.addColorStop(0.55, mix([10, 10, 12], [196, 150, 92], light));
    sky.addColorStop(1, mix([14, 14, 16], [245, 232, 205], light));
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

    // Sol nascente
    const sunX = W * (mobile ? 0.78 : 0.8), sunR = Math.min(W, H) * 0.16;
    const sunY = lerp(H * 0.95, H * 0.3, ease(clamp((p - 0.2) / 0.7)));
    const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 4.5);
    glow.addColorStop(0, `rgba(255,236,190,${0.85 * light})`);
    glow.addColorStop(0.25, `rgba(255,205,130,${0.35 * light})`);
    glow.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    // raios girando
    if (light > 0.05) {
      ctx.save(); ctx.translate(sunX, sunY); ctx.rotate(p * 0.8);
      ctx.fillStyle = `rgba(255,240,205,${0.12 * light})`;
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(sunR * 6, -sunR * 0.35); ctx.lineTo(sunR * 6, sunR * 0.35); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,244,220,${light})`; ctx.fill();

    // Partículas: cinzas caindo no início, centelhas douradas subindo no fim
    const vy = lerp(0.04, -0.07, light);
    particles.forEach(pt => {
      pt.y += vy * pt.s * dt; pt.w += dt * 1.5;
      if (pt.y > 1.05) pt.y = -0.05; if (pt.y < -0.05) pt.y = 1.05;
      const x = (pt.x + Math.sin(pt.w) * 0.01) * W, y = pt.y * H;
      ctx.beginPath(); ctx.arc(x, y, pt.r * lerp(1, 1.6, light), 0, Math.PI * 2);
      ctx.fillStyle = light < 0.5 ? `rgba(150,150,150,${0.35 * (1 - light)})` : `rgba(255,${Math.round(lerp(200, 225, light))},140,${0.8 * light})`;
      ctx.fill();
    });

    // Escadaria isométrica 3D
    const x0 = W * (mobile ? 0.04 : 0.1), x1 = W * (mobile ? 0.86 : 0.74);
    const dx = (x1 - x0) / N, dy = (H * (mobile ? 0.42 : 0.5)) / N;
    const y0 = H * 0.92, ox = dx * 0.55, oy = dx * 0.32;
    for (let i = 0; i < N; i++) {
      const X = x0 + i * dx, Y = y0 - (i + 1) * dy;
      const lit = clamp(light * 1.15 - (1 - i / N) * 0.35);
      const top = mix([30, 30, 32], [252, 244, 228], lit);
      const front = mix([16, 16, 18], [176, 150, 118], lit);
      const riser = mix([22, 22, 24], [214, 190, 152], lit);
      // face frontal (bloco até o chão)
      ctx.fillStyle = front; ctx.fillRect(X, Y, dx + 0.5, H - Y);
      // espelho do degrau (face lateral em profundidade)
      ctx.fillStyle = riser;
      ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X + ox, Y - oy); ctx.lineTo(X + ox, Y - oy + dy); ctx.lineTo(X, Y + dy); ctx.closePath(); ctx.fill();
      // piso do degrau
      ctx.fillStyle = top;
      ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X + dx, Y); ctx.lineTo(X + dx + ox, Y - oy); ctx.lineTo(X + ox, Y - oy); ctx.closePath(); ctx.fill();
    }

    // Figura subindo
    const climb = clamp((p - 0.06) / 0.8);
    const sPos = climb * (N - 0.6);
    const step = Math.floor(sPos), frac = sPos - step;
    const fx = x0 + sPos * dx + ox * 0.5 + dx * 0.3;
    const floorY = k => y0 - (Math.min(k, N - 1) + 1) * dy - oy * 0.5;
    const up = clamp((frac - 0.35) / 0.35);
    const hop = Math.sin(frac * Math.PI) * dy * 0.35;
    const footY = lerp(floorY(step), floorY(step + 1), up * up * (3 - 2 * up)) - hop;
    const size = Math.max(dy * 3.4, 46);
    const arrived = clamp((p - 0.86) / 0.05);
    const hunch = lerp(0.35, 0, clamp(light * 1.3));          // curvado no início, ereto no fim
    const walk = arrived < 1 ? Math.sin(sPos * Math.PI * 2) : 0;
    const ink = mix([110, 110, 115], [20, 16, 12], light);
    ctx.save(); ctx.translate(fx, footY);
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = Math.max(3.5, size * 0.09); ctx.lineCap = 'round';
    const hipY = -size * 0.45, neckY = -size * 0.86;
    const neckX = size * hunch * 0.5;
    // pernas
    ctx.beginPath(); ctx.moveTo(0, hipY); ctx.lineTo(walk * size * 0.18, 0); ctx.moveTo(0, hipY); ctx.lineTo(-walk * size * 0.18, 0); ctx.stroke();
    // tronco
    ctx.beginPath(); ctx.moveTo(0, hipY); ctx.lineTo(neckX, neckY); ctx.stroke();
    // braços: balançando → erguidos na conquista
    const armA = lerp(walk * 0.6, -2.4, arrived), armB = lerp(-walk * 0.6, -0.75, arrived);
    const al = size * 0.32, sh = neckY + size * 0.06;
    ctx.beginPath();
    ctx.moveTo(neckX, sh); ctx.lineTo(neckX + Math.sin(armA) * al, sh + Math.cos(armA) * al);
    ctx.moveTo(neckX, sh); ctx.lineTo(neckX - Math.sin(armB) * al, sh + Math.cos(armB) * al);
    ctx.stroke();
    // cabeça
    ctx.beginPath(); ctx.arc(neckX + size * hunch * 0.2, neckY - size * 0.11, size * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // Fade de entrada/saída do loop
    const fade = Math.max(clamp(1 - p / 0.05), clamp((p - 0.95) / 0.05));
    if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }

    // Palavras + cor do texto
    const wi = p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3;
    if (wi !== lastWord) { words.forEach((w, i) => w.classList.toggle('is-active', i === wi)); lastWord = wi; }
    section.style.setProperty('--jornada-text', light > 0.55 ? '#14100c' : '#ffffff');
    section.style.setProperty('--jornada-ink', light > 0.55 ? 'rgba(20,16,12,0.7)' : '#999999');
  }

  let prev = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    frame(((now - start) % LOOP) / LOOP, dt);
    if (running) raf = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', () => { resize(); if (reduce) frame(0.9, 0); });
  if (reduce) { frame(0.9, 0); return; }
  frame(0, 0);
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; prev = performance.now(); raf = requestAnimationFrame(loop); }
    else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
  }).observe(section);
})();
