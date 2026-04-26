/* =============================================
   Ingino Logistics — main.js
   ============================================= */

(function () {
  'use strict';

  /* ===================================
     HAMBURGER MENU
     =================================== */
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close menu when a nav link is clicked */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Close menu on outside click */
    document.addEventListener('click', function (e) {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    /* Close menu on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  /* ===================================
     HEADER — elevated shadow on scroll
     =================================== */
  var header = document.querySelector('.header');

  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) {
        header.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.28)';
      } else {
        header.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.2)';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===================================
     SCROLL REVEAL
     Fades + slides elements into view
     =================================== */
  var revealEls = document.querySelectorAll(
    '.why-card, .service-card, .stat-card, .haul-item, ' +
    '.testimonial-card, .about-img-wrap, .team-card, ' +
    '.service-overview-card, .hero-stat'
  );

  if ('IntersectionObserver' in window && revealEls.length) {
    /* Set initial hidden state */
    revealEls.forEach(function (el, i) {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(20px)';
      el.style.transition =
        'opacity 0.5s ease ' + (i % 4) * 80 + 'ms, ' +
        'transform 0.5s ease ' + (i % 4) * 80 + 'ms';
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    /* Fallback — just show everything */
    revealEls.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* ===================================
     SMOOTH SCROLL for anchor links
     =================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===================================
     ACTIVE NAV LINK
     Highlights the current page link
     =================================== */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  /* ===================================
     STATS — count-up animation
     Runs when stats section scrolls in
     =================================== */
  var statCards = document.querySelectorAll('.stat-card h3');

  if ('IntersectionObserver' in window && statCards.length) {
    var statsObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);

          var el       = entry.target;
          var raw      = el.textContent.trim();
          /* Extract numeric part, keep prefix/suffix */
          var prefix   = raw.match(/^[^\d]*/)[0]  || '';
          var suffix   = raw.match(/[^\d]*$/)[0]  || '';
          var numStr   = raw.replace(/[^\d]/g, '');
          var target   = parseInt(numStr, 10);

          if (!target || target > 9999) return; /* skip non-numeric or huge values */

          var start    = 0;
          var duration = 1400;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            /* Ease out cubic */
            var ease = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(ease * target);
            el.textContent = prefix + current + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }

          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );

    statCards.forEach(function (el) { statsObserver.observe(el); });
  }

  /* ===================================
     FORM — contact.html extra UX
     Show a "Sending…" state while
     the native POST is in progress
     (validation is in contact.html)
     =================================== */
  var contactForm = document.getElementById('contact-form');
  var submitBtn   = document.getElementById('submit-btn');

  if (contactForm && submitBtn) {
    /* Re-enable button if user navigates back (bfcache) */
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Quote Request →';
      }
    });
  }

  /* ===================================
     BACK-TO-TOP (optional utility)
     Appears after scrolling 400px
     =================================== */
  var bttBtn = document.createElement('button');
  bttBtn.setAttribute('aria-label', 'Back to top');
  bttBtn.innerHTML = '↑';
  bttBtn.style.cssText = [
    'position:fixed',
    'bottom:1.5rem',
    'right:1.5rem',
    'z-index:200',
    'width:44px',
    'height:44px',
    'border-radius:50%',
    'background:#1e3a5f',
    'color:#fff',
    'font-size:1.1rem',
    'font-weight:700',
    'border:none',
    'cursor:pointer',
    'box-shadow:0 4px 16px rgba(0,0,0,0.22)',
    'opacity:0',
    'transform:translateY(8px)',
    'transition:opacity 0.3s ease,transform 0.3s ease',
    'pointer-events:none'
  ].join(';');

  document.body.appendChild(bttBtn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      bttBtn.style.opacity       = '1';
      bttBtn.style.transform     = 'translateY(0)';
      bttBtn.style.pointerEvents = 'auto';
    } else {
      bttBtn.style.opacity       = '0';
      bttBtn.style.transform     = 'translateY(8px)';
      bttBtn.style.pointerEvents = 'none';
    }
  }, { passive: true });

  bttBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();