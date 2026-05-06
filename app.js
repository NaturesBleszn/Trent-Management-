/* ============================
TRENT MANAGEMENT — app.js
ADHD-Friendly Interactions
============================ */

(function () {
  'use strict';

  /* ===== DARK MODE TOGGLE ===== */
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const html = document.documentElement;
  let currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  html.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', currentTheme);
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    themeToggle.innerHTML = currentTheme === 'dark' ? '☀' : '☾';
    themeToggle.setAttribute(
      'aria-label',
      'Switch to ' + (currentTheme === 'dark' ? 'light' : 'dark') + ' mode'
    );
  }

  /* ===== SCROLL PROGRESS BAR ===== */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener(
      'scroll',
      () => {
        const total = document.body.scrollHeight - window.innerHeight;
        progressBar.style.width =
          (total > 0 ? (window.scrollY / total) * 100 : 0).toFixed(2) + '%';
      },
      { passive: true }
    );
  }

  /* ===== STICKY HEADER SHADOW ===== */
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener(
      'scroll',
      () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
      },
      { passive: true }
    );
  }

  /* ===== MOBILE NAV ===== */
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('navMobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.querySelectorAll('.nav-mobile-link').forEach((link) => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  /* ===== AUDIENCE TABS (services filter) ===== */
  const audienceTabs = document.querySelectorAll('.audience-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  if (audienceTabs.length && tabContents.length) {
    audienceTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        audienceTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        tabContents.forEach((content) => {
          content.classList.remove('active');
        });

        const targetContent = document.getElementById('content-' + target);
        if (targetContent) {
          targetContent.classList.add('active');
          targetContent.style.animation = 'fadeIn 0.3s ease';
        }

        const servicesSection = document.getElementById('services');
        if (servicesSection) {
          const rect = servicesSection.getBoundingClientRect();
          if (rect.top < 0 || rect.top > window.innerHeight) {
            servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  /* ===== ANIMATED NUMBER COUNTERS ===== */
  function animateCounter(el, target, duration = 1800) {
    let start = null;
    const startVal = 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(startVal + eased * (target - startVal));
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length) {
    let countersStarted = false;

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            statNumbers.forEach((el, i) => {
              const target = parseInt(el.dataset.target, 10);
              if (!isNaN(target)) {
                setTimeout(() => animateCounter(el, target), i * 150);
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);
  }

  /* ===== SCROLL REVEAL ===== */
  const revealEls = document.querySelectorAll(
    '.service-card, .step-card, .testimonial-card, .why-metric-card, .why-feature'
  );

  if (revealEls.length) {
    revealEls.forEach((el, i) => {
      el.classList.add('reveal');
      if (i % 3 === 1) el.classList.add('reveal-delay-1');
      if (i % 3 === 2) el.classList.add('reveal-delay-2');
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ===== HERO CTA — AUDIENCE SYNC ===== */
  const audienceButtons = document.querySelectorAll('.audience-btn');
  if (audienceButtons.length) {
    audienceButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const aud = btn.dataset.audience;
        if (!aud) return;
        const matchingTab = document.querySelector(`.audience-tab[data-tab="${aud}"]`);
        if (matchingTab) matchingTab.click();
      });
    });
  }

  /* ===== CONTACT FORM TABS ===== */
  const formTabs = document.querySelectorAll('.form-tab');
  const ownerFields = document.getElementById('ownerFields');

  if (formTabs.length) {
    formTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        formTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        if (ownerFields) {
          ownerFields.style.display =
            tab.dataset.formTab === 'owner' ? 'flex' : 'none';
        }
      });
    });
  }

  /* ===== CONTACT FORM SUBMIT (MOCK) ===== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        contactForm.hidden = true;
        formSuccess.hidden = false;
        formSuccess.style.animation = 'fadeIn 0.5s ease';
      }, 1200);
    });
  }

  /* ===== COMPARE TABLE — HIGHLIGHT ON HOVER ===== */
  const compareRows = document.querySelectorAll('.compare-table tbody tr');
  if (compareRows.length) {
    compareRows.forEach((row) => {
      row.addEventListener('mouseenter', () => {
        row.style.background = 'var(--color-gold-light)';
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = '';
      });
    });
  }

  /* ===== SMOOTH ANCHOR SCROLL ===== */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  if (anchorLinks.length) {
    anchorLinks.forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ===== CSS FADE ANIMATION (INJECTED) ===== */
  const fadeStyle = document.createElement('style');
  fadeStyle.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(fadeStyle);
})();
