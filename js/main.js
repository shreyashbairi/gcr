/* ==========================================================================
   GCR CONSULTING — MAIN JAVASCRIPT
   ==========================================================================
   Dependency-free vanilla JS for site interactivity.

   QUICK EDIT (Designer: most-changed items)
   ──────────────────────────────────────────
   1. Quiz questions        → QUIZ_DATA array (line ~300)
   2. Generic email domains  → GENERIC_DOMAINS array (line ~500)
   3. Redirect mappings      → loaded from /redirects.json
   4. Sticky CTA threshold   → STICKY_CTA_THRESHOLD (line ~35)
   5. Slider auto-play speed → SLIDER_INTERVAL (line ~30)

   ========================================================================== */

(function () {
  'use strict';

  /* ── Configuration ── */
  const HEADER_HEIGHT = 80;           /* Must match --header-height in CSS */
  const SLIDER_INTERVAL = 5000;       /* Auto-play speed for sliders (ms) */
  const STICKY_CTA_THRESHOLD = 0.4;   /* Show sticky CTA after 40% scroll */

  /* ── Wait for DOM ── */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initPreloader();
    initLenisScroll();
    initMobileMenu();
    initActiveNav();
    initSmoothScroll();
    initTabs();
    initContactTabs();
    initRedirectHelper();
    initSlider();
    initStickyCTA();
    initCookieBanner();
    initQuiz();
    initContactForm();
    initMorphCards();
    initReadinessProgress();
    initFancyNav();
    initLeaderCarousel();
    initGlassHeader();
    initScrollRevealAnimations();
    initHeroAnimations();
    initCounterAnimations();
    initHeroCursorGlow();
    initFooterReveals();
  }


  /* ======================================================================
     0b. FROSTED GLASS HEADER SCROLL
     Add/remove .scrolled class for denser frost on scroll.
     ====================================================================== */

  function initGlassHeader() {
    var header = document.querySelector('.header-new');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }


  /* ======================================================================
     1. MOBILE MENU
     Toggle hamburger menu, lock body scroll, close on ESC / outside click.
     ====================================================================== */

  function initMobileMenu() {
    /* Support both old (.header__burger) and new (.header-new__burger) header */
    var burger = document.querySelector('.header-new__burger') || document.querySelector('.header__burger');
    var nav = document.querySelector('.header-new__nav');
    var menu = document.querySelector('.header__mobile-menu');

    if (burger && nav) {
      /* New header: toggle nav visibility on mobile */
      burger.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('is-open');
        burger.classList.toggle('is-active');
        burger.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('menu-open', isOpen);
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          burger.classList.remove('is-active');
          burger.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('menu-open');
        }
      });

      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('is-open');
          burger.classList.remove('is-active');
          burger.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('menu-open');
        });
      });
    } else if (burger && menu) {
      /* Legacy header */
      burger.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('is-open');
        burger.classList.toggle('is-active');
        burger.setAttribute('aria-expanded', String(isOpen));
        menu.setAttribute('aria-hidden', String(!isOpen));
        document.body.classList.toggle('menu-open', isOpen);
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
          closeMenu(burger, menu);
        }
      });

      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          closeMenu(burger, menu);
        });
      });
    }
  }

  function closeMenu(burger, menu) {
    menu.classList.remove('is-open');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }


  /* ======================================================================
     2. ACTIVE NAVIGATION
     Detect current page and add .is-active to matching nav link.
     ====================================================================== */

  function initActiveNav() {
    var currentPath = window.location.pathname;
    var currentPage = currentPath.split('/').pop() || 'index.html';

    /* Handle root "/" as index.html */
    if (currentPage === '' || currentPage === '/') {
      currentPage = 'index.html';
    }

    /* Mark all nav links (both old and new header) */
    var selectors = '.header__nav-link, .header__mobile-link, .header-new__nav-link';
    document.querySelectorAll(selectors).forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('is-active');
      }
    });
  }


  /* ======================================================================
     3. SMOOTH SCROLL
     Intercept anchor links and scroll with header offset.
     ====================================================================== */

  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var offsetTop = target.getBoundingClientRect().top + window.pageYOffset - HEADER_HEIGHT;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  }


  /* ======================================================================
     4. TAB SWITCHER (Reusable)
     Works with any [data-tabs] container. Buttons use [data-tab-target],
     panels use [data-tab-id].
     ====================================================================== */

  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (tabGroup) {
      var buttons = tabGroup.querySelectorAll('[data-tab-target]');
      var panels = tabGroup.querySelectorAll('[data-tab-id]');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-tab-target');

          /* Deactivate all */
          buttons.forEach(function (b) {
            b.classList.remove('is-active');
            b.setAttribute('aria-selected', 'false');
          });
          panels.forEach(function (p) {
            p.classList.remove('is-active');
            p.setAttribute('aria-hidden', 'true');
          });

          /* Activate selected */
          btn.classList.add('is-active');
          btn.setAttribute('aria-selected', 'true');
          var activePanel = tabGroup.querySelector('[data-tab-id="' + target + '"]');
          if (activePanel) {
            activePanel.classList.add('is-active');
            activePanel.setAttribute('aria-hidden', 'false');
          }
        });
      });
    });
  }


  /* ======================================================================
     5. REDIRECT HELPER
     Fetches /redirects.json and redirects if current path matches.
     Fails silently if file is missing.
     ====================================================================== */

  function initRedirectHelper() {
    fetch('redirects.json')
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.redirects) return;
        var currentPath = window.location.pathname;
        var match = data.redirects.find(function (r) {
          return r.from === currentPath;
        });
        if (match) {
          window.location.replace(match.to);
        }
      })
      .catch(function () {
        /* redirects.json not found — that's OK */
      });
  }


  /* ======================================================================
     6. SLIDER (Expert Materials Feed)
     Simple fade slider for .expert-feed__slider.
     ====================================================================== */

  function initSlider() {
    var slider = document.querySelector('.expert-feed__slider');
    if (!slider) return;

    var slides = slider.querySelectorAll('.expert-feed__slide');
    var dots = slider.querySelectorAll('.expert-feed__dot');
    if (slides.length < 2) return;

    var currentSlide = 0;

    function showSlide(index) {
      slides.forEach(function (s) { s.classList.remove('is-active'); });
      dots.forEach(function (d) { d.classList.remove('is-active'); });
      slides[index].classList.add('is-active');
      if (dots[index]) dots[index].classList.add('is-active');
      currentSlide = index;
    }

    /* Dot click */
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });

    /* Auto-play */
    setInterval(function () {
      var next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }, SLIDER_INTERVAL);
  }


  /* ======================================================================
     7. STICKY CTA BAR
     Show after user scrolls past threshold, hide near footer.
     ====================================================================== */

  function initStickyCTA() {
    var stickyCta = document.querySelector('.sticky-cta');
    if (!stickyCta) return;

    var footer = document.querySelector('.footer');

    window.addEventListener('scroll', function () {
      var scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      var nearFooter = false;

      if (footer) {
        var footerTop = footer.getBoundingClientRect().top;
        nearFooter = footerTop < window.innerHeight + 100;
      }

      if (scrollPercent > STICKY_CTA_THRESHOLD && !nearFooter) {
        stickyCta.classList.add('is-visible');
      } else {
        stickyCta.classList.remove('is-visible');
      }
    }, { passive: true });
  }


  /* ======================================================================
     8. COOKIE BANNER
     Check localStorage, show banner if no preference set.
     ====================================================================== */

  function initCookieBanner() {
    var banner = document.getElementById('cookieBanner');
    if (!banner) return;

    var consent = localStorage.getItem('cookieConsent');
    if (consent) return; /* User already chose */

    banner.removeAttribute('hidden');

    var acceptBtn = document.getElementById('cookieAccept');
    var declineBtn = document.getElementById('cookieDecline');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.setAttribute('hidden', '');
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        localStorage.setItem('cookieConsent', 'declined');
        banner.setAttribute('hidden', '');
      });
    }
  }


  /* ======================================================================
     9. READINESS CHECK QUIZ
     Multi-step quiz with scoring. Data-driven — edit QUIZ_DATA to change
     questions. Results show a readiness tier and recommendation.
     ====================================================================== */

  /* ── Quiz Question Data ──
     Designer / content editor: change questions and options here.
     Each option has a score (0–3). Higher = more ready. */

  var QUIZ_DATA = [
    {
      id: 1,
      question: 'Has your organization previously operated in the Greater Caspian Region or CIS markets?',
      options: [
        { text: 'Yes, we have active operations in the region', score: 3 },
        { text: 'We have explored the region but not established operations', score: 2 },
        { text: 'We have operated in similar emerging markets', score: 1 },
        { text: 'No, this would be our first emerging market entry', score: 0 }
      ]
    },
    {
      id: 2,
      question: 'How familiar is your team with the regulatory environments across GCR jurisdictions?',
      options: [
        { text: 'We have in-house regulatory expertise for the GCR', score: 3 },
        { text: 'We have general knowledge but lack jurisdiction-specific expertise', score: 2 },
        { text: 'We rely on external advisors for regulatory guidance', score: 1 },
        { text: 'We have limited awareness of GCR regulations', score: 0 }
      ]
    },
    {
      id: 3,
      question: 'Do you have established local partnerships or stakeholder relationships in the GCR?',
      options: [
        { text: 'Yes, we have vetted, long-term local partners', score: 3 },
        { text: 'We have some initial contacts but no formal partnerships', score: 2 },
        { text: 'We are actively seeking local partners', score: 1 },
        { text: 'No, we would need to build our network from scratch', score: 0 }
      ]
    },
    {
      id: 4,
      question: 'What is your allocated budget range for GCR market entry?',
      options: [
        { text: '$1M+ with board-approved expansion budget', score: 3 },
        { text: '$250K–$1M earmarked for exploratory phase', score: 2 },
        { text: 'Under $250K — testing the waters', score: 1 },
        { text: 'Budget has not yet been defined', score: 0 }
      ]
    },
    {
      id: 5,
      question: 'What is your target timeline for establishing GCR operations?',
      options: [
        { text: 'Within 3 months — we need to move quickly', score: 3 },
        { text: '3–6 months — structured but timely approach', score: 2 },
        { text: '6–12 months — methodical long-term planning', score: 1 },
        { text: 'No firm timeline — still in research phase', score: 0 }
      ]
    },
    {
      id: 6,
      question: 'Does your organization have international compliance infrastructure (FCPA, UK Bribery Act, ESG)?',
      options: [
        { text: 'Yes, robust compliance program with dedicated team', score: 3 },
        { text: 'Basic compliance policies in place', score: 2 },
        { text: 'We rely on group-level compliance guidelines', score: 1 },
        { text: 'Compliance infrastructure is minimal or non-existent', score: 0 }
      ]
    },
    {
      id: 7,
      question: 'What best describes your risk tolerance for emerging market entry?',
      options: [
        { text: 'Calculated risk-taker with emerging market experience', score: 3 },
        { text: 'Open to risk with proper mitigation strategies', score: 2 },
        { text: 'Conservative — need strong guarantees before proceeding', score: 1 },
        { text: 'Very risk-averse — require near-certainty of returns', score: 0 }
      ]
    },
    {
      id: 8,
      question: 'Which sector best describes your primary business interest in the GCR?',
      options: [
        { text: 'Energy, Oil & Gas, or Critical Minerals', score: 3 },
        { text: 'Logistics, Supply Chain, or Infrastructure', score: 2 },
        { text: 'Technology, Fintech, or Digital Services', score: 2 },
        { text: 'FMCG, Retail, or Manufacturing', score: 1 }
      ]
    },
    {
      id: 9,
      question: 'Does your organization have experience with Production Sharing Agreements (PSAs) or government concessions?',
      options: [
        { text: 'Yes, we actively manage PSAs or concession agreements', score: 3 },
        { text: 'We have some exposure through partnerships', score: 2 },
        { text: 'We understand the concept but have no direct experience', score: 1 },
        { text: 'This is unfamiliar territory for us', score: 0 }
      ]
    },
    {
      id: 10,
      question: 'How would you describe your organization\'s strategic objective in the GCR?',
      options: [
        { text: 'Full market entry with physical presence and local entity', score: 3 },
        { text: 'Joint venture or strategic partnership with local player', score: 2 },
        { text: 'Export / distribution through local channels', score: 1 },
        { text: 'Feasibility study or market intelligence gathering', score: 0 }
      ]
    }
  ];

  /* ── Quiz Result Tiers ── */
  var QUIZ_TIERS = [
    {
      min: 0, max: 10,
      label: 'Early Stage',
      color: '#C62828',
      recommendation: 'Your organization is at the beginning of its GCR journey. We recommend starting with a Strategic Market Entry consultation to build a solid foundation, conduct proper due diligence, and develop a phased entry roadmap before committing capital.'
    },
    {
      min: 11, max: 20,
      label: 'Developing Readiness',
      color: '#F57C00',
      recommendation: 'You have some building blocks in place, but gaps remain in regulatory readiness, local networks, or operational infrastructure. An Operational Sprint engagement can help you close these gaps efficiently while testing market demand through our GCR Deployment Teams.'
    },
    {
      min: 21, max: 30,
      label: 'High Readiness',
      color: '#2E7D32',
      recommendation: 'Your organization demonstrates strong readiness for GCR expansion. You have the compliance infrastructure, risk appetite, and strategic clarity to move quickly. We recommend a direct Executive Briefing to align on deployment timelines and governance frameworks.'
    }
  ];

  function initQuiz() {
    var quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;

    var state = {
      currentStep: 0,
      answers: {}
    };

    renderQuizStep(quizContainer, state);
  }

  function renderQuizStep(container, state) {
    var total = QUIZ_DATA.length;
    var step = state.currentStep;
    var q = QUIZ_DATA[step];
    var progress = ((step) / total) * 100;

    var html = '';
    html += '<div class="quiz__progress"><div class="quiz__progress-bar" style="width: ' + progress + '%"></div></div>';
    html += '<p class="quiz__step-indicator">Question ' + (step + 1) + ' of ' + total + '</p>';
    html += '<h3 class="quiz__question">' + q.question + '</h3>';
    html += '<div class="quiz__options">';

    q.options.forEach(function (opt, i) {
      var selected = state.answers[q.id] === i ? 'is-selected' : '';
      var checked = state.answers[q.id] === i ? 'checked' : '';
      html += '<label class="quiz__option ' + selected + '">';
      html += '<input type="radio" name="q' + q.id + '" value="' + i + '" ' + checked + '>';
      html += '<span class="quiz__option-text">' + opt.text + '</span>';
      html += '</label>';
    });

    html += '</div>';
    html += '<div class="quiz__nav">';

    if (step > 0) {
      html += '<button class="btn btn--secondary" data-quiz-prev>Previous</button>';
    } else {
      html += '<span></span>';
    }

    if (step < total - 1) {
      html += '<button class="btn btn--primary" data-quiz-next>Next</button>';
    } else {
      html += '<button class="btn btn--primary" data-quiz-submit>See Results</button>';
    }

    html += '</div>';

    container.innerHTML = html;

    /* Bind events */
    container.querySelectorAll('.quiz__option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        var radio = opt.querySelector('input[type="radio"]');
        radio.checked = true;
        state.answers[q.id] = parseInt(radio.value);
        /* Update selected state */
        container.querySelectorAll('.quiz__option').forEach(function (o) {
          o.classList.remove('is-selected');
        });
        opt.classList.add('is-selected');
      });
    });

    var prevBtn = container.querySelector('[data-quiz-prev]');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        state.currentStep--;
        renderQuizStep(container, state);
      });
    }

    var nextBtn = container.querySelector('[data-quiz-next]');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (state.answers[q.id] === undefined) {
          alert('Please select an answer before continuing.');
          return;
        }
        state.currentStep++;
        renderQuizStep(container, state);
      });
    }

    var submitBtn = container.querySelector('[data-quiz-submit]');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        if (state.answers[q.id] === undefined) {
          alert('Please select an answer before continuing.');
          return;
        }
        renderQuizResult(container, state);
      });
    }
  }

  function renderQuizResult(container, state) {
    /* Calculate total score */
    var totalScore = 0;
    Object.keys(state.answers).forEach(function (qId) {
      var question = QUIZ_DATA.find(function (q) { return q.id === parseInt(qId); });
      if (question) {
        totalScore += question.options[state.answers[qId]].score;
      }
    });

    var maxScore = QUIZ_DATA.length * 3;
    var percentage = Math.round((totalScore / maxScore) * 100);

    /* Find tier */
    var tier = QUIZ_TIERS.find(function (t) {
      return totalScore >= t.min && totalScore <= t.max;
    }) || QUIZ_TIERS[0];

    var html = '';
    html += '<div class="quiz__result" aria-live="polite">';
    html += '<h3>Your GCR Readiness Score</h3>';
    html += '<p class="quiz__score-label" style="color: ' + tier.color + '">' + percentage + '%</p>';
    html += '<div class="quiz__score-bar"><div class="quiz__score-fill" style="width: ' + percentage + '%; background-color: ' + tier.color + '"></div></div>';
    html += '<p class="text-lg font-bold mt-lg" style="color: ' + tier.color + '">' + tier.label + '</p>';
    html += '<p class="quiz__recommendation">' + tier.recommendation + '</p>';
    html += '<div class="mt-2xl">';
    html += '<a href="page-08.html" class="btn btn--primary btn--lg">Schedule a Consultation</a>';
    html += '</div>';
    html += '<button class="btn btn--secondary mt-lg" data-quiz-restart>Retake Assessment</button>';
    html += '</div>';

    container.innerHTML = html;

    /* Trigger score bar animation */
    setTimeout(function () {
      var fill = container.querySelector('.quiz__score-fill');
      if (fill) fill.style.width = percentage + '%';
    }, 100);

    /* Restart */
    var restartBtn = container.querySelector('[data-quiz-restart]');
    if (restartBtn) {
      restartBtn.addEventListener('click', function () {
        var newState = { currentStep: 0, answers: {} };
        renderQuizStep(container, newState);
      });
    }
  }


  /* ======================================================================
     10. CONTACT FORM VALIDATION
     Client-side only. Shows success message on valid submit.
     ====================================================================== */

  /* Generic email domains that trigger a warning */
  var GENERIC_DOMAINS = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
    'yandex.com', 'mail.ru'
  ];

  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = validateContactForm(form);
      if (isValid) {
        /* Hide form, show success */
        form.style.display = 'none';
        var success = document.getElementById('formSuccess');
        if (success) {
          success.classList.add('is-visible');
        }
      }
    });
  }

  function validateContactForm(form) {
    var isValid = true;

    /* Clear previous errors */
    form.querySelectorAll('.form-error').forEach(function (err) {
      err.classList.remove('is-visible');
    });
    form.querySelectorAll('.is-invalid').forEach(function (field) {
      field.classList.remove('is-invalid');
    });

    /* Required text fields */
    var requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(function (field) {
      if (field.type === 'checkbox') {
        if (!field.checked) {
          showFieldError(field, 'This field is required.');
          isValid = false;
        }
      } else if (!field.value.trim()) {
        showFieldError(field, 'This field is required.');
        isValid = false;
      }
    });

    /* Email validation */
    var emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value.trim()) {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address.');
        isValid = false;
      } else {
        /* Check for generic domain */
        var domain = emailField.value.split('@')[1].toLowerCase();
        if (GENERIC_DOMAINS.indexOf(domain) !== -1) {
          showFieldError(emailField, 'Please use a corporate email address. Generic domains (Gmail, Yahoo) are not accepted for initial inquiries.');
          isValid = false;
        }
      }
    }

    return isValid;
  }

  function showFieldError(field, message) {
    field.classList.add('is-invalid');
    /* Find the associated error element */
    var errorId = field.getAttribute('aria-describedby');
    var errorEl = errorId ? document.getElementById(errorId) : null;
    if (!errorEl) {
      /* Fallback: find next .form-error sibling */
      errorEl = field.parentElement.querySelector('.form-error');
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('is-visible');
    }
  }


  /* ======================================================================
     11. CONTACT PAGE TABS (standalone, no [data-tabs] wrapper)
     For the contact form tabs that use .contact-form__tab and .tabs__panel.
     ====================================================================== */

  function initContactTabs() {
    var tabButtons = document.querySelectorAll('.contact-form__tab');
    if (tabButtons.length === 0) return;

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab-target');

        /* Deactivate all tabs and panels */
        tabButtons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tabs__panel').forEach(function (p) {
          p.classList.remove('is-active');
          p.setAttribute('aria-hidden', 'true');
        });

        /* Activate selected */
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        var activePanel = document.querySelector('[data-tab-id="' + target + '"]');
        if (activePanel) {
          activePanel.classList.add('is-active');
          activePanel.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }


  /* ======================================================================
     12. MORPHING PROFILE CARDS — Touch support for mobile
     On mobile (no hover), tap to expand the card info.
     ====================================================================== */

  function initMorphCards() {
    var cards = document.querySelectorAll('.morph-card');
    if (cards.length === 0) return;

    /* Only add tap behavior on touch devices */
    if (!('ontouchstart' in window)) return;

    cards.forEach(function (card) {
      card.addEventListener('touchstart', function (e) {
        /* If card is not expanded, expand it; otherwise follow the link */
        if (!card.classList.contains('is-touched')) {
          e.preventDefault();
          /* Close all other cards */
          cards.forEach(function (c) { c.classList.remove('is-touched'); });
          card.classList.add('is-touched');
        }
        /* If already touched, let the default link behavior happen */
      }, { passive: false });
    });

    /* Close cards when tapping outside */
    document.addEventListener('touchstart', function (e) {
      if (!e.target.closest('.morph-card')) {
        cards.forEach(function (c) { c.classList.remove('is-touched'); });
      }
    });
  }


  /* ======================================================================
     13. READINESS PROGRESS BAR
     Updates the progress bar on the readiness page as quiz progresses.
     ====================================================================== */

  function initReadinessProgress() {
    var progressBar = document.getElementById('readinessProgress');
    if (!progressBar) return;

    /* Watch for quiz progress changes via MutationObserver on quiz container */
    var quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;

    var observer = new MutationObserver(function () {
      var stepIndicator = quizContainer.querySelector('.quiz__step-indicator');
      if (stepIndicator) {
        var match = stepIndicator.textContent.match(/(\d+)\s+of\s+(\d+)/);
        if (match) {
          var current = parseInt(match[1]);
          var total = parseInt(match[2]);
          progressBar.style.width = ((current / total) * 100) + '%';
        }
      }
      /* If result is showing, set to 100% */
      if (quizContainer.querySelector('.quiz__result')) {
        progressBar.style.width = '100%';
      }
    });

    observer.observe(quizContainer, { childList: true, subtree: true });
  }



  /* ======================================================================
     14. EXPANDING SPLIT-SCREEN NAV (Case Studies)
     ====================================================================== */

  function initFancyNav() {
    var fancyItemList = document.querySelector('.fancy-nav__list');
    if (!fancyItemList) return;

    var fancyItems = fancyItemList.querySelectorAll('.fancy-nav__item');
    var fancyTabList = document.querySelector('.fancy-nav__tabs');
    var fancyTabs = fancyTabList ? fancyTabList.querySelectorAll('.fancy-nav__tab') : [];
    var fancyImgs = document.querySelectorAll('.fancy-nav__img');

    function changeMainImage(index) {
      fancyImgs.forEach(function (img, i) {
        img.style.opacity = i === index ? 1 : 0;
      });
    }

    function openTab(index) {
      fancyTabList.classList.add('is-visible');
      var tab = fancyTabs[index];
      tab.classList.add('is-visible');
      var closeBtn = tab.querySelector('.fancy-nav__close-btn');
      var tabImg = tab.querySelector('.fancy-nav__tab-img');
      var tabDescr = tab.querySelector('.fancy-nav__tab-description');
      if (closeBtn) closeBtn.classList.add('is-visible');
      if (tabImg) tabImg.classList.add('is-visible');
      if (tabDescr) tabDescr.classList.add('is-visible');
    }

    function closeTab(index) {
      fancyTabList.classList.remove('is-visible');
      var tab = fancyTabs[index];
      tab.classList.remove('is-visible');
      var closeBtn = tab.querySelector('.fancy-nav__close-btn');
      var tabImg = tab.querySelector('.fancy-nav__tab-img');
      var tabDescr = tab.querySelector('.fancy-nav__tab-description');
      if (closeBtn) closeBtn.classList.remove('is-visible');
      if (tabImg) tabImg.classList.remove('is-visible');
      if (tabDescr) tabDescr.classList.remove('is-visible');
    }

    fancyItemList.addEventListener('mouseover', function (e) {
      var item = e.target.closest('.fancy-nav__item');
      if (item) {
        var idx = Array.from(fancyItems).indexOf(item);
        changeMainImage(idx);
      }
    });

    fancyItemList.addEventListener('click', function (e) {
      var item = e.target.closest('.fancy-nav__item');
      if (item) {
        var idx = Array.from(fancyItems).indexOf(item);
        openTab(idx);
      }
    });

    if (fancyTabList) {
      fancyTabList.addEventListener('click', function (e) {
        var closeBtn = e.target.closest('.fancy-nav__close-btn');
        if (closeBtn) {
          var tab = closeBtn.closest('.fancy-nav__tab');
          var idx = Array.from(fancyTabs).indexOf(tab);
          closeTab(idx);
        }
      });
    }
  }


  /* ======================================================================
     15. LEADERSHIP CAROUSEL
     ====================================================================== */

  function initLeaderCarousel() {
    var carousel = document.querySelector('.leader-carousel');
    if (!carousel) return;

    var track = carousel.querySelector('.leader-carousel__track');
    var slides = carousel.querySelectorAll('.leader-carousel__slide');
    var prevBtn = carousel.querySelector('[data-carousel-prev]');
    var nextBtn = carousel.querySelector('[data-carousel-next]');
    var dots = carousel.querySelectorAll('.leader-carousel__dot');
    var current = 0;
    var total = slides.length;

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    /* Auto-advance every 6s */
    setInterval(function () { goTo(current + 1); }, 6000);
  }



  /* ======================================================================
     16. PRELOADER
     Progress bar animation, then reveal page content.
     ====================================================================== */

  function initPreloader() {
    var preloader = document.getElementById('preloader');
    var fill = document.getElementById('preloaderFill');
    if (!preloader) return;

    var progress = 0;
    var interval = setInterval(function () {
      progress += Math.random() * 15 + 5;
      if (progress > 90) progress = 90;
      if (fill) fill.style.width = progress + '%';
    }, 150);

    function finishPreloader() {
      clearInterval(interval);
      if (fill) fill.style.width = '100%';
      setTimeout(function () {
        preloader.classList.add('is-done');
        document.body.classList.remove('is-loading');
        /* Add page reveal animation to main content */
        var main = document.getElementById('main-content');
        if (main) main.classList.add('page-reveal');
      }, 400);
    }

    /* Wait for fonts + window load */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        window.addEventListener('load', finishPreloader);
        /* Fallback if load already fired */
        if (document.readyState === 'complete') finishPreloader();
      });
    } else {
      window.addEventListener('load', finishPreloader);
      if (document.readyState === 'complete') finishPreloader();
    }
  }


  /* ======================================================================
     17. LENIS SMOOTH SCROLL
     Silky smooth scrolling via Lenis library.
     ====================================================================== */

  function initLenisScroll() {
    if (typeof Lenis === 'undefined') return;

    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false
    });

    /* Connect Lenis to GSAP ScrollTrigger */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    /* Store on window for access in other functions */
    window.__lenis = lenis;
  }


  /* ======================================================================
     18. HERO ANIMATIONS
     Staggered reveal of hero headline, subhead, and CTA.
     ====================================================================== */

  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    var heroElements = document.querySelectorAll('[data-hero-anim]');
    if (heroElements.length === 0) return;

    /* Delay until preloader finishes */
    setTimeout(function () {
      gsap.to(heroElements, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }, 800);
  }


  /* ======================================================================
     19. SCROLL-TRIGGERED REVEAL ANIMATIONS
     Fade-up sections, staggered cards, and other scroll reveals.
     ====================================================================== */

  function initScrollRevealAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    /* ── Reveal each section's heading & intro ── */
    var sectionIntros = document.querySelectorAll('.section-intro');
    sectionIntros.forEach(function (intro) {
      gsap.from(intro, {
        scrollTrigger: {
          trigger: intro,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    /* ── Staggered service cards ── */
    var serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
      gsap.from(serviceCards, {
        scrollTrigger: {
          trigger: '.service-cards',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out'
      });
    }

    /* ── Staggered metrics ── */
    var metricsItems = document.querySelectorAll('.metrics__item');
    if (metricsItems.length > 0) {
      gsap.from(metricsItems, {
        scrollTrigger: {
          trigger: '.metrics',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }

    /* ── Stats row ── */
    var statsItems = document.querySelectorAll('.stats-row__item');
    if (statsItems.length > 0) {
      gsap.from(statsItems, {
        scrollTrigger: {
          trigger: '.stats-row',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }

    /* ── Sector morph cards ── */
    var sectorCards = document.querySelectorAll('.sector-morph-card');
    if (sectorCards.length > 0) {
      gsap.from(sectorCards, {
        scrollTrigger: {
          trigger: '.sector-morph-cards',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }

    /* ── Leader carousel ── */
    var leaderCarousel = document.querySelector('.leader-carousel');
    if (leaderCarousel) {
      gsap.from(leaderCarousel, {
        scrollTrigger: {
          trigger: leaderCarousel,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    /* ── Fancy nav (case studies) ── */
    var fancyNav = document.querySelector('.fancy-nav');
    if (fancyNav) {
      gsap.from(fancyNav, {
        scrollTrigger: {
          trigger: fancyNav,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    /* ── Readiness CTA section ── */
    var readinessCTA = document.querySelector('.readiness-btn');
    if (readinessCTA) {
      gsap.from(readinessCTA, {
        scrollTrigger: {
          trigger: readinessCTA,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: 'back.out(1.7)'
      });
    }

    /* ── Footer CTA ── */
    var footerCTA = document.querySelector('.footer-cta__content');
    if (footerCTA) {
      gsap.from(footerCTA, {
        scrollTrigger: {
          trigger: '.footer-cta',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out'
      });
    }

    var footerImg = document.querySelector('.footer-cta__image');
    if (footerImg) {
      gsap.from(footerImg, {
        scrollTrigger: {
          trigger: '.footer-cta',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: 40,
        duration: 0.7,
        delay: 0.2,
        ease: 'power3.out'
      });
    }

    /* ── General sections fade-in ── */
    var sections = document.querySelectorAll('.section');
    sections.forEach(function (section) {
      var children = section.querySelectorAll('h2, > .container > p');
      if (children.length === 0) return;
      gsap.from(children, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 25,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out'
      });
    });

    /* ── Trust bar surtitle ── */
    var trustSurtitle = document.querySelector('.trust-bar__surtitle');
    if (trustSurtitle) {
      gsap.from(trustSurtitle, {
        scrollTrigger: {
          trigger: trustSurtitle,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 15,
        duration: 0.5,
        ease: 'power2.out'
      });
    }

    /* ── Generic card stagger within grids ── */
    var grids = document.querySelectorAll('.grid');
    grids.forEach(function (grid) {
      var cards = grid.querySelectorAll('.card, .card--case');
      if (cards.length === 0) return;
      gsap.from(cards, {
        scrollTrigger: {
          trigger: grid,
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.09,
        ease: 'power3.out'
      });
    });

    /* ── Timeline phases ── */
    var timelinePhases = document.querySelectorAll('.timeline__phase');
    if (timelinePhases.length > 0) {
      gsap.from(timelinePhases, {
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }

    /* ── Partner notes ── */
    var partnerNotes = document.querySelectorAll('.partner-note');
    partnerNotes.forEach(function (note) {
      gsap.from(note, {
        scrollTrigger: {
          trigger: note,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -30,
        duration: 0.7,
        ease: 'power3.out'
      });
    });

    /* ── Case study grid cards ── */
    var caseCards = document.querySelectorAll('.case-study-grid__card');
    if (caseCards.length > 0) {
      gsap.from(caseCards, {
        scrollTrigger: {
          trigger: '.case-study-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        scale: 0.97,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out'
      });
    }

    /* ── Case filter buttons ── */
    var caseFilters = document.querySelectorAll('.case-filter__btn');
    if (caseFilters.length > 0) {
      gsap.from(caseFilters, {
        scrollTrigger: {
          trigger: '.case-filter',
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 15,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out'
      });
    }

    /* ── Featured case ── */
    var featuredCase = document.querySelector('.featured-case');
    if (featuredCase) {
      gsap.from(featuredCase, {
        scrollTrigger: {
          trigger: featuredCase,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    /* ── Morph cards (leadership page) ── */
    var morphCards = document.querySelectorAll('.morph-card');
    if (morphCards.length > 0) {
      gsap.from(morphCards, {
        scrollTrigger: {
          trigger: '.morph-cards',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out'
      });
    }

    /* ── News grid cards ── */
    var newsCards = document.querySelectorAll('.news-grid__card');
    if (newsCards.length > 0) {
      gsap.from(newsCards, {
        scrollTrigger: {
          trigger: '.news-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out'
      });
    }

    /* ── Methodology flow steps ── */
    var methodSteps = document.querySelectorAll('.methodology-flow__step');
    if (methodSteps.length > 0) {
      gsap.from(methodSteps, {
        scrollTrigger: {
          trigger: '.methodology-flow',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 35,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }

    /* ── Deliver phases (service pages) ── */
    var deliverPhases = document.querySelectorAll('.deliver-phase');
    deliverPhases.forEach(function (phase) {
      var items = phase.querySelectorAll('.grid > div');
      if (items.length === 0) return;
      gsap.from(items, {
        scrollTrigger: {
          trigger: phase,
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 35,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
    });

    /* ── Spotlight cards ── */
    var spotlightCards = document.querySelectorAll('.spotlight-card');
    if (spotlightCards.length > 0) {
      gsap.from(spotlightCards, {
        scrollTrigger: {
          trigger: spotlightCards[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }

    /* ── Insight cards ── */
    var insightCards = document.querySelectorAll('.insight-card');
    if (insightCards.length > 0) {
      gsap.from(insightCards, {
        scrollTrigger: {
          trigger: '.insights-grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }

    /* ── Next step cards ── */
    var nextStepCards = document.querySelectorAll('.next-step-card');
    if (nextStepCards.length > 0) {
      gsap.from(nextStepCards, {
        scrollTrigger: {
          trigger: '.next-steps',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }

    /* ── Leader hero (leader pages) ── */
    var leaderPhoto = document.querySelector('.leader-hero__photo');
    var leaderDetails = document.querySelector('.leader-hero__details');
    if (leaderPhoto) {
      gsap.from(leaderPhoto, {
        opacity: 0,
        x: -40,
        duration: 0.9,
        delay: 0.8,
        ease: 'power3.out'
      });
    }
    if (leaderDetails) {
      gsap.from(leaderDetails, {
        opacity: 0,
        x: 40,
        duration: 0.9,
        delay: 1,
        ease: 'power3.out'
      });
    }

    /* ── Leader sidebar & bio ── */
    var leaderSidebar = document.querySelector('.leader-sidebar');
    var leaderBio = document.querySelector('.leader-bio');
    if (leaderSidebar) {
      gsap.from(leaderSidebar, {
        scrollTrigger: {
          trigger: '.leader-content',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -30,
        duration: 0.7,
        ease: 'power3.out'
      });
    }
    if (leaderBio) {
      gsap.from(leaderBio, {
        scrollTrigger: {
          trigger: '.leader-content',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        delay: 0.15,
        ease: 'power3.out'
      });
    }

    /* ── Blog article ── */
    var blogTitle = document.querySelector('.blog-article__title');
    if (blogTitle) {
      gsap.from(blogTitle, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.6,
        ease: 'power3.out'
      });
    }
    var blogBody = document.querySelector('.blog-article__body');
    if (blogBody) {
      gsap.from(blogBody, {
        scrollTrigger: {
          trigger: blogBody,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 25,
        duration: 0.7,
        ease: 'power3.out'
      });
    }

    /* ── Blog related cards ── */
    var blogRelated = document.querySelectorAll('.blog-related-card');
    if (blogRelated.length > 0) {
      gsap.from(blogRelated, {
        scrollTrigger: {
          trigger: '.blog-related__grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 35,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out'
      });
    }

    /* ── Blockquotes ── */
    var quotes = document.querySelectorAll('blockquote');
    quotes.forEach(function (q) {
      gsap.from(q, {
        scrollTrigger: {
          trigger: q,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -20,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    /* ── Landscape bullets ── */
    var landscapeBullets = document.querySelectorAll('.landscape-bullets li');
    if (landscapeBullets.length > 0) {
      gsap.from(landscapeBullets, {
        scrollTrigger: {
          trigger: '.landscape-bullets',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -20,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out'
      });
    }

    /* ── Contact form tabs ── */
    var contactTabs = document.querySelector('.contact-form__tabs');
    if (contactTabs) {
      gsap.from(contactTabs, {
        scrollTrigger: {
          trigger: contactTabs,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power3.out'
      });
    }

    /* ── Featured case metrics ── */
    var featuredMetrics = document.querySelectorAll('.featured-case__metric');
    if (featuredMetrics.length > 0) {
      gsap.from(featuredMetrics, {
        scrollTrigger: {
          trigger: '.featured-case__metrics',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        scale: 0.9,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      });
    }

    /* ── Section images (parallax-lite) ── */
    var sectionImages = document.querySelectorAll('.section img, .section .ratio-16-9');
    sectionImages.forEach(function (img) {
      gsap.from(img, {
        scrollTrigger: {
          trigger: img,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        scale: 0.96,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
  }


  /* ======================================================================
     20. COUNTER ANIMATIONS
     Animate stats numbers when they scroll into view.
     ====================================================================== */

  function initCounterAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    /* ── Animate stat numbers ── */
    var statNumbers = document.querySelectorAll('.stats-row__number');
    statNumbers.forEach(function (el) {
      var text = el.textContent.trim();
      var match = text.match(/^([+$]?)([\d,.]+)([A-Za-z%+]*)/);
      if (!match) return; /* Skip non-numeric like "Energy" */

      var prefix = match[1];
      var numStr = match[2].replace(/,/g, '');
      var suffix = match[3];
      var targetNum = parseFloat(numStr);
      if (isNaN(targetNum)) return;

      var isDecimal = numStr.indexOf('.') !== -1;
      var decimals = isDecimal ? (numStr.split('.')[1] || '').length : 0;

      el.textContent = prefix + '0' + suffix;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          el.classList.add('is-counting');
          gsap.to({ val: 0 }, {
            val: targetNum,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: function () {
              var current = this.targets()[0].val;
              var formatted = isDecimal ? current.toFixed(decimals) : Math.round(current).toLocaleString();
              el.textContent = prefix + formatted + suffix;
            }
          });
        }
      });
    });

    /* ── Animate metric values ── */
    var metricValues = document.querySelectorAll('.metrics__value');
    metricValues.forEach(function (el) {
      var text = el.textContent.trim();
      var match = text.match(/^([+$]?)([\d,.]+)([A-Za-z%+]*)/);
      if (!match) return;

      var prefix = match[1];
      var numStr = match[2].replace(/,/g, '');
      var suffix = match[3];
      var targetNum = parseFloat(numStr);
      if (isNaN(targetNum)) return;

      el.textContent = prefix + '0' + suffix;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          el.classList.add('is-counting');
          gsap.to({ val: 0 }, {
            val: targetNum,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function () {
              var current = this.targets()[0].val;
              var formatted = Math.round(current).toLocaleString();
              el.textContent = prefix + formatted + suffix;
            }
          });
        }
      });
    });
  }


  /* ======================================================================
     21. HERO CURSOR GLOW
     Radial gradient follows mouse on hero section.
     ====================================================================== */

  function initHeroCursorGlow() {
    var hero = document.querySelector('.hero--home');
    var glow = document.getElementById('heroCursorGlow');
    if (!hero || !glow) return;

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      glow.style.background = 'radial-gradient(circle 350px at ' + x + 'px ' + y + 'px, rgba(200, 169, 81, 0.07), transparent 70%)';
    });

    hero.addEventListener('mouseleave', function () {
      glow.style.opacity = '0';
    });

    hero.addEventListener('mouseenter', function () {
      glow.style.opacity = '1';
    });
  }


  /* ======================================================================
     22. FOOTER COLUMN REVEALS
     Stagger footer columns into view.
     ====================================================================== */

  function initFooterReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var footerCols = document.querySelectorAll('.footer-new__col');
    if (footerCols.length === 0) return;

    gsap.from(footerCols, {
      scrollTrigger: {
        trigger: '.footer-new',
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 25,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out',
      onComplete: function () {
        footerCols.forEach(function (col) {
          col.classList.add('is-revealed');
        });
      }
    });

    /* Footer cities stagger */
    var cities = document.querySelectorAll('.footer-new__cities span');
    if (cities.length > 0) {
      gsap.from(cities, {
        scrollTrigger: {
          trigger: '.footer-new__cities',
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 10,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }
  }


  /* ─── SERVICE SIDEBAR ─── */
  function initServiceSidebar() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    if (!/^service-\d+\.html$/.test(page)) return;

    var services = [
      { href: 'service-01.html', label: 'Market Entry & GTM' },
      { href: 'service-02.html', label: 'Deployment Teams' },
      { href: 'service-03.html', label: 'Strategic Alliances' },
      { href: 'service-04.html', label: 'Negotiation & Channels' },
      { href: 'service-05.html', label: 'Fiscal Architecture' },
      { href: 'service-06.html', label: 'Industrial Assets' },
      { href: 'service-07.html', label: 'Regulatory Access' },
      { href: 'service-08.html', label: 'M&A & Capital' },
      { href: 'service-09.html', label: 'Digital & Innovation' },
      { href: 'service-10.html', label: 'Corporate Governance' },
      { href: 'service-11.html', label: 'Risk & Asset Protection' },
      { href: 'service-12.html', label: 'Legal Defense & Crisis' }
    ];

    document.body.classList.add('has-service-sidebar');

    var sidebar = document.createElement('nav');
    sidebar.className = 'service-sidebar';
    sidebar.setAttribute('aria-label', 'Service navigation');

    var title = document.createElement('p');
    title.className = 'service-sidebar__title';
    title.textContent = 'Services';
    sidebar.appendChild(title);

    var ul = document.createElement('ul');
    ul.className = 'service-sidebar__list';

    services.forEach(function (svc) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = svc.href;
      a.textContent = svc.label;
      if (svc.href === page) {
        a.classList.add('active');
      }
      li.appendChild(a);
      ul.appendChild(li);
    });

    sidebar.appendChild(ul);

    document.body.appendChild(sidebar);

    /* Mobile toggle */
    title.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('is-expanded');
      }
    });
  }

  initServiceSidebar();


})();
