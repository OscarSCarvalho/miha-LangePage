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
