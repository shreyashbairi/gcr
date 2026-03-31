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
    initCaseGallery();
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

      /* Services accordion: intercept trigger link click on mobile */
      var menuTrigger = nav.querySelector('.header-new__menu-trigger');
      if (menuTrigger) {
        var triggerLink = menuTrigger.querySelector(':scope > a');
        if (triggerLink) {
          triggerLink.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
              e.preventDefault();
              menuTrigger.classList.toggle('is-mobile-open');
            }
          });
        }
      }

      /* Close menu on any nav link click — exclude the services trigger on mobile */
      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          if (window.innerWidth <= 768 && link === (menuTrigger && menuTrigger.querySelector(':scope > a'))) {
            return; /* handled by accordion above */
          }
          nav.classList.remove('is-open');
          if (menuTrigger) menuTrigger.classList.remove('is-mobile-open');
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
      question: 'What is your organization\'s experience with the GCR or similar markets?',
      options: [
        { text: 'We have no prior experience with emerging markets \u2014 this would be our first entry of this kind', score: 0 },
        { text: 'We have operated in other emerging markets (Eastern Europe, MENA, Southeast Asia), but not in the GCR specifically', score: 1 },
        { text: 'We have explored the GCR \u2014 visited, attended events, or had early conversations \u2014 but have not established operations', score: 2 },
        { text: 'We are already operating in the region, but results are below what we expected', score: 3 }
      ]
    },
    {
      id: 2,
      question: 'What is your primary objective in the GCR?',
      options: [
        { text: 'Full market entry \u2014 we want a registered presence, a local team, and direct sales operations', score: 3 },
        { text: 'A joint venture or strategic partnership with a strong local player', score: 3 },
        { text: 'Export or distribution \u2014 we want to sell through local channels without setting up an entity', score: 2 },
        { text: 'Research and validation \u2014 we need hard data before committing to any direction', score: 1 }
      ]
    },
    {
      id: 3,
      question: 'What does your company offer?',
      options: [
        { text: 'Physical goods \u2014 manufacturing, industrial equipment, or consumer products', score: 2 },
        { text: 'Technology or software \u2014 SaaS, IT platforms, or digital solutions', score: 3 },
        { text: 'Professional services \u2014 consulting, engineering, financial, or legal services', score: 3 },
        { text: 'Energy, infrastructure, or large-scale project work', score: 2 }
      ]
    },
    {
      id: 4,
      question: 'When do you expect to see meaningful results from this market?',
      options: [
        { text: 'Within 6 months \u2014 early revenue is important to us', score: 0 },
        { text: '12 to 18 months \u2014 we\'re prepared to invest before reaching breakeven', score: 3 },
        { text: '2 to 3 years or more \u2014 we\'re building a long-term presence', score: 3 },
        { text: 'It depends on how the first conversations and deals develop', score: 2 }
      ]
    },
    {
      id: 5,
      question: 'What budget have you set aside for market entry this year?',
      subtitle: 'Consulting, legal, travel, and local operations \u2014 not the cost of goods or services.',
      options: [
        { text: '$20,000 \u2013 $50,000', score: 1 },
        { text: '$50,000 \u2013 $150,000', score: 2 },
        { text: 'Over $150,000', score: 3 },
        { text: 'No defined budget yet \u2014 we plan to allocate as early results come in', score: 0 }
      ]
    },
    {
      id: 6,
      question: 'Who is leading this initiative inside your organization?',
      options: [
        { text: 'The founder or owner \u2014 this is a personal strategic priority', score: 3 },
        { text: 'The CEO or a board-level executive \u2014 it has been formally approved at the top', score: 3 },
        { text: 'A regional or export director \u2014 they are building the internal case for budget approval', score: 1 },
        { text: 'A small founding team \u2014 decisions are made collectively and move quickly', score: 2 }
      ]
    },
    {
      id: 7,
      question: 'Do you have people available to work in the region?',
      options: [
        { text: 'Yes \u2014 we have staff ready to travel regularly or relocate', score: 3 },
        { text: 'Not yet \u2014 we would need to hire locally, but haven\'t started', score: 2 },
        { text: 'No \u2014 we have no available capacity and would need a fully external operational solution', score: 1 },
        { text: 'We plan to manage everything remotely from headquarters', score: 0 }
      ]
    },
    {
      id: 8,
      question: 'What does your current network in the region look like?',
      options: [
        { text: 'We\'re starting from zero \u2014 no direct contacts at this stage', score: 0 },
        { text: 'We have some connections from events or online outreach, but nothing established', score: 1 },
        { text: 'We have direct access to decision-makers in relevant businesses', score: 3 },
        { text: 'We have working relationships with government bodies or regulators', score: 3 }
      ]
    },
    {
      id: 9,
      question: 'Does your product or service fall into any of these categories?',
      options: [
        { text: 'No \u2014 standard commercial goods or services with no special restrictions', score: 3 },
        { text: 'High-tech equipment, electronics, or technology with dual-use potential', score: 2 },
        { text: 'Financial products, crypto assets, or regulated digital platforms', score: 1 },
        { text: 'Pharmaceuticals, food products, or heavily certified consumer goods', score: 2 }
      ]
    },
    {
      id: 10,
      question: 'What is driving your decision to enter the GCR right now?',
      options: [
        { text: 'We\'ve hit our targets at home and are ready for the next stage of growth', score: 3 },
        { text: 'We\'re receiving inbound interest from the region and want to act on it properly', score: 2 },
        { text: 'We want to reduce dependence on current markets and build a new revenue base', score: 2 },
        { text: 'We see a window of opportunity and want to move before it closes', score: 1 }
      ]
    }
  ];

  /* ── Quiz Result Tiers ── */
  var QUIZ_TIERS = [
    {
      minPct: 0, maxPct: 39,
      label: 'Early Stage',
      headline: 'Your GCR Readiness Score: Early Stage',
      color: '#2C4070',
      body: 'Your organization is at the beginning of its GCR journey. The region has real opportunity, but a steep learning curve. Companies that enter without validated assumptions and a realistic cost picture tend to lose time and money on things that could have been resolved before the first trip.',
      recommendedStep: 'A Strategic Market Entry consultation \u2014 one focused session to answer what matters most before any capital is committed: Is there real demand? What does entry actually require? Where do we start?',
      ctaPrimary: 'Request a Strategic Consultation',
      ctaSecondary: 'Receive Full Report by Email'
    },
    {
      minPct: 40, maxPct: 69,
      label: 'Building Momentum',
      headline: 'Your GCR Readiness Score: Developing',
      color: '#2C4070',
      body: 'You have clear intent and the right approach. There are gaps \u2014 in data, in network, or in internal alignment \u2014 that if left unaddressed will cost you time once you commit capital. The most common mistake at your stage is skipping validation and jumping straight to operations. The groundwork for market understanding and partner identification should start now.',
      recommendedStep: 'A Market Entry consultation that gives you a data-backed starting point \u2014 realistic entry scenarios and a phased roadmap you can take to your leadership with confidence.',
      ctaPrimary: 'Request a Market Entry Consultation',
      ctaSecondary: 'Receive Full Report by Email'
    },
    {
      minPct: 70, maxPct: 100,
      label: 'Market Ready',
      headline: 'Your GCR Readiness Score: Strong',
      color: '#2E7D32',
      body: 'Your organization has the foundations in place for a serious market entry \u2014 a defined objective, a realistic timeline, and the financial commitment the region requires. What you need now is precise execution: the right local infrastructure, vetted partners, and operational support that keeps pace with how decisions are made here.',
      recommendedStep: 'A focused 45-minute call with one of our regional directors. We\'ll map your specific gaps against what we have on the ground \u2014 and tell you honestly where we can help and where you don\'t need us.',
      ctaPrimary: 'Schedule a Strategy Call',
      ctaSecondary: 'Receive Full Report by Email'
    }
  ];

  function initQuiz() {
    var quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;

    var state = {
      currentStep: 0,
      answers: {},
      contactInfo: {}
    };

    renderQuizStep(quizContainer, state);
  }

  function renderQuizStep(container, state) {
    var total = QUIZ_DATA.length;
    var step = state.currentStep;
    var q = QUIZ_DATA[step];
    /* Progress includes contact form as step 11 */
    var totalSteps = total + 1;
    var progress = ((step) / totalSteps) * 100;

    var html = '';
    html += '<div class="quiz__progress"><div class="quiz__progress-bar" style="width: ' + progress + '%"></div></div>';
    html += '<p class="quiz__step-indicator">Question ' + (step + 1) + ' of ' + total + '</p>';
    html += '<h3 class="quiz__question">' + q.question + '</h3>';
    if (q.subtitle) {
      html += '<p class="quiz__subtitle">' + q.subtitle + '</p>';
    }
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
      html += '<button class="btn btn--primary btn--lg" data-quiz-next>Next &rsaquo;</button>';
    } else {
      html += '<button class="btn btn--primary btn--lg" data-quiz-next-contact>Next &rsaquo;</button>';
    }

    html += '</div>';

    container.innerHTML = html;

    /* Bind events */
    container.querySelectorAll('.quiz__option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        var radio = opt.querySelector('input[type="radio"]');
        radio.checked = true;
        state.answers[q.id] = parseInt(radio.value);
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

    var nextContactBtn = container.querySelector('[data-quiz-next-contact]');
    if (nextContactBtn) {
      nextContactBtn.addEventListener('click', function () {
        if (state.answers[q.id] === undefined) {
          alert('Please select an answer before continuing.');
          return;
        }
        renderContactForm(container, state);
      });
    }
  }

  function renderContactForm(container, state) {
    var total = QUIZ_DATA.length;
    var totalSteps = total + 1;
    var progress = (total / totalSteps) * 100;

    var html = '';
    html += '<div class="quiz__progress"><div class="quiz__progress-bar" style="width: ' + progress + '%"></div></div>';
    html += '<p class="quiz__step-indicator">Almost there</p>';
    html += '<h3 class="quiz__question">Tell us about yourself</h3>';
    html += '<p class="quiz__subtitle">We\'ll use this to personalise your results and send you a detailed report.</p>';
    html += '<form class="quiz__contact-form" id="quizContactForm">';
    html += '<div class="quiz__form-grid">';
    html += '<div class="quiz__form-field"><label for="qcf-fname">First name <span class="required">*</span></label><input type="text" id="qcf-fname" name="firstName" required value="' + (state.contactInfo.firstName || '') + '"></div>';
    html += '<div class="quiz__form-field"><label for="qcf-lname">Last name <span class="required">*</span></label><input type="text" id="qcf-lname" name="lastName" required value="' + (state.contactInfo.lastName || '') + '"></div>';
    html += '<div class="quiz__form-field"><label for="qcf-title">Job title <span class="required">*</span></label><input type="text" id="qcf-title" name="jobTitle" required value="' + (state.contactInfo.jobTitle || '') + '"></div>';
    html += '<div class="quiz__form-field"><label for="qcf-company">Company name <span class="required">*</span></label><input type="text" id="qcf-company" name="companyName" required value="' + (state.contactInfo.companyName || '') + '"></div>';
    html += '<div class="quiz__form-field"><label for="qcf-email">Work email <span class="required">*</span></label><input type="email" id="qcf-email" name="workEmail" required value="' + (state.contactInfo.workEmail || '') + '"></div>';
    html += '<div class="quiz__form-field"><label for="qcf-country">Country <span class="required">*</span></label><input type="text" id="qcf-country" name="country" required value="' + (state.contactInfo.country || '') + '"></div>';
    html += '</div>';
    html += '<div class="quiz__nav">';
    html += '<button type="button" class="btn btn--secondary" data-quiz-back-to-questions>Previous</button>';
    html += '<button type="submit" class="btn btn--primary">See Results</button>';
    html += '</div>';
    html += '</form>';

    container.innerHTML = html;

    var backBtn = container.querySelector('[data-quiz-back-to-questions]');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        saveContactFields(state, container);
        state.currentStep = QUIZ_DATA.length - 1;
        renderQuizStep(container, state);
      });
    }

    var form = document.getElementById('quizContactForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      saveContactFields(state, container);
      renderQuizResult(container, state);
    });
  }

  function saveContactFields(state, container) {
    var form = container.querySelector('.quiz__contact-form');
    if (!form) return;
    state.contactInfo = {
      firstName: form.querySelector('[name="firstName"]').value,
      lastName: form.querySelector('[name="lastName"]').value,
      jobTitle: form.querySelector('[name="jobTitle"]').value,
      companyName: form.querySelector('[name="companyName"]').value,
      workEmail: form.querySelector('[name="workEmail"]').value,
      country: form.querySelector('[name="country"]').value
    };
  }

  function getSelectedOptionIndex(state, questionId) {
    return state.answers[questionId];
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

    var maxScore = 30;
    var percentage = Math.round((totalScore / maxScore) * 100);

    /* Find tier by percentage */
    var tier = QUIZ_TIERS.find(function (t) {
      return percentage >= t.minPct && percentage <= t.maxPct;
    }) || QUIZ_TIERS[0];

    /* Internal trigger logic */
    var triggerMessages = [];
    var overridePrimaryCTA = null;

    /* Q7=C (index 2) and Q8=A (index 0) */
    var q7Answer = getSelectedOptionIndex(state, 7);
    var q8Answer = getSelectedOptionIndex(state, 8);
    if (q7Answer === 2 && q8Answer === 0) {
      triggerMessages.push('Your profile suggests no available internal capacity and no local network. A dedicated GCR Deployment Team would remove 6\u20139 months of setup time and allow you to operate from day one.');
    }

    /* Q9=B(1), C(2), or D(3) */
    var q9Answer = getSelectedOptionIndex(state, 9);
    if (q9Answer === 1 || q9Answer === 2 || q9Answer === 3) {
      triggerMessages.push('Your product or service category requires a compliance review before entry. We recommend starting with a direct conversation rather than a standard report.');
      overridePrimaryCTA = 'Schedule a Compliance Review Call';
    }

    /* Q6=C (index 2) */
    var q6Answer = getSelectedOptionIndex(state, 6);
    if (q6Answer === 2) {
      triggerMessages.push('If you need to build an internal business case for budget approval, our written report is structured to serve exactly that purpose.');
    }

    var primaryCTAText = overridePrimaryCTA || tier.ctaPrimary;

    var html = '';
    html += '<div class="quiz__result" aria-live="polite">';
    html += '<h3>' + tier.headline + '</h3>';
    html += '<p class="quiz__score-label" style="color: ' + tier.color + '">' + percentage + '%</p>';
    html += '<div class="quiz__score-bar"><div class="quiz__score-fill" style="width: 0%; background-color: ' + tier.color + '"></div></div>';
    html += '<p class="quiz__recommendation">' + tier.body + '</p>';

    if (triggerMessages.length > 0) {
      triggerMessages.forEach(function (msg) {
        html += '<p class="quiz__trigger-note">' + msg + '</p>';
      });
    }

    html += '<p class="quiz__recommended-step"><strong>Recommended next step:</strong> ' + tier.recommendedStep + '</p>';
    html += '<div class="quiz__result-ctas">';
    html += '<a href="page-08.html" class="btn btn--primary btn--lg">' + primaryCTAText + '</a>';
    html += '<a href="page-08.html" class="btn btn--secondary btn--lg">' + tier.ctaSecondary + '</a>';
    html += '</div>';
    html += '<button class="btn btn--outline mt-lg" data-quiz-restart>Retake Assessment</button>';
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
        var newState = { currentStep: 0, answers: {}, contactInfo: {} };
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
     14b. EXPANDING IMAGE GALLERY (Case Studies)
     ====================================================================== */

  function initCaseGallery() {
    var gallery = document.getElementById('caseGallery');
    if (!gallery) return;

    var items = gallery.querySelectorAll('.case-gallery__item');
    var currentIndex = 0;
    var autoInterval = null;
    var isHovering = false;

    function activateItem(index) {
      items.forEach(function (i) { i.classList.remove('is-active'); });
      items[index].classList.add('is-active');
      currentIndex = index;
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoInterval = setInterval(function () {
        if (!isHovering) {
          currentIndex = (currentIndex + 1) % items.length;
          activateItem(currentIndex);
        }
      }, 4000);
    }

    function stopAutoPlay() {
      if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
      }
    }

    items.forEach(function (item, idx) {
      item.addEventListener('click', function (e) {
        if (!item.classList.contains('is-active')) {
          e.preventDefault();
          activateItem(idx);
        }
      });

      item.addEventListener('mouseenter', function () {
        isHovering = true;
        item.classList.add('is-hovered');
      });

      item.addEventListener('mouseleave', function () {
        item.classList.remove('is-hovered');
        isHovering = false;
      });
    });

    gallery.addEventListener('mouseleave', function () {
      isHovering = false;
    });

    startAutoPlay();
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

    /* ── Case gallery (expanding image gallery) ── */
    var caseGallery = document.querySelector('.case-gallery');
    if (caseGallery) {
      gsap.from(caseGallery, {
        scrollTrigger: {
          trigger: caseGallery,
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

    var tab = document.createElement('span');
    tab.className = 'service-sidebar__tab';
    tab.textContent = 'Services';
    sidebar.appendChild(tab);

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

    /* Desktop drawer: open on load, collapse after 5s, reopen on hover */
    if (window.innerWidth > 768) {
      setTimeout(function () {
        sidebar.classList.add('is-collapsed');
      }, 5000);

      sidebar.addEventListener('mouseenter', function () {
        sidebar.classList.remove('is-collapsed');
      });

      sidebar.addEventListener('mouseleave', function () {
        sidebar.classList.add('is-collapsed');
      });
    }

    /* Mobile toggle */
    title.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('is-expanded');
      }
    });
  }

  initServiceSidebar();


})();
