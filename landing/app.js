/* ═══════════════════════════════════════════════════════════════
   RELIO LANDING PAGE — JavaScript
   Intersection Observer animations, nav scroll, mobile menu, 
   smooth scroll, FAQ accordion
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Intersection Observer for scroll animations ────────────
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });

  // ─── Nav scroll effect ──────────────────────────────────────
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // initial check

  // ─── Mobile menu toggle ─────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    navMenu.querySelectorAll('.nav__link, .nav__cta').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // ─── Staggered animation for cards ──────────────────────────
  function staggerChildren(parentSelector, childSelector) {
    document.querySelectorAll(parentSelector).forEach((parent) => {
      parent.querySelectorAll(childSelector).forEach((child, i) => {
        child.style.transitionDelay = `${i * 80}ms`;
      });
    });
  }

  staggerChildren('.problem__cards', '.problem__card');
  staggerChildren('.stages__grid', '.stages__card');
  staggerChildren('.pricing__grid', '.pricing__card');
  staggerChildren('.testimonials__grid', '.testimonials__card');
  staggerChildren('.faq__list', '.faq__item');

  // ─── Smooth scroll for anchor links ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ─── Waitlist Form Handler ──────────────────────────────────
// Global so the inline onsubmit can call it
function handleWaitlist(e) {
  e.preventDefault();
  const email = document.getElementById('waitlist-email').value;
  const btn = document.getElementById('waitlist-btn');
  const originalHTML = btn.innerHTML;

  if (!email) return false;

  btn.innerHTML = 'Joining...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Store in localStorage as backup (in case no backend yet)
  try {
    const waitlist = JSON.parse(localStorage.getItem('relio_waitlist') || '[]');
    waitlist.push({ email, timestamp: new Date().toISOString() });
    localStorage.setItem('relio_waitlist', JSON.stringify(waitlist));
  } catch (err) { /* ignore */ }

  // Simulate API call (replace with real endpoint when ready)
  setTimeout(function() {
    btn.innerHTML = '✓ You\'re on the list!';
    btn.style.background = '#2A9D8F';
    btn.style.opacity = '1';
    document.getElementById('waitlist-email').value = '';
    document.getElementById('waitlist-email').placeholder = 'We\'ll notify you at launch!';
    document.getElementById('waitlist-email').disabled = true;

    // Show success message
    var note = document.querySelector('.cta__form-note');
    if (note) {
      note.innerHTML = '🎉 <strong>You\'re in!</strong> We\'ll send you an invite when Relio launches.';
      note.style.color = '#2A9D8F';
    }
  }, 800);

  return false;
}
