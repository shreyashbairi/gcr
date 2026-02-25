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

})();
