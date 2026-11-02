/**
 * ==============================================================================
 * ZWEN POTERIE — CORE JAVASCRIPT (ES6+ VANILLA)
 * High-performance, lightweight interactions & mobile ergonomics
 * ==============================================================================
 * 
 * FEATURES INCLUDED:
 * 1. Mobile Hamburger Menu with strict Body Scroll-Lock
 * 2. Sticky Glassmorphic Header scroll transitions
 * 3. Desktop-Only Custom Interactive Cursor (Safe on Mobile)
 * 4. Hardware-Accelerated Bidirectional Scroll Reveals (120fps)
 * 5. Smooth Anchor Scrolling & WhatsApp Interaction Helpers
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. MOBILE NAVIGATION & BODY SCROLL LOCK
     Prevents the background content from scrolling when menu is active.
     -------------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburgerBtn && mobileNav) {
    let menuUnlockTimer = null;

    const setMenuOpen = (nextOpen, instantUnlock = false) => {
      hamburgerBtn.classList.toggle('is-active', nextOpen);
      mobileNav.classList.toggle('is-open', nextOpen);
      
      // Accessibility state
      hamburgerBtn.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
      mobileNav.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');

      // Synchronize header & visual chrome transitions immediately in both directions
      document.body.classList.toggle('menu-visual-open', nextOpen);

      clearTimeout(menuUnlockTimer);
      // CRITICAL: Prevent body background scroll on mobile with zero jump
      if (nextOpen) {
        mobileNav.scrollTop = 0;
        document.body.classList.add('menu-open');
      } else if (instantUnlock) {
        document.body.classList.remove('menu-open');
      } else {
        // Keep body scroll locked until the smooth drawer fade-out finishes
        menuUnlockTimer = setTimeout(() => {
          if (!hamburgerBtn.classList.contains('is-active')) {
            document.body.classList.remove('menu-open');
          }
        }, 300);
      }
    };

    const toggleMenu = () => {
      const willOpen = !hamburgerBtn.classList.contains('is-active');
      setMenuOpen(willOpen);
    };

    // Click on hamburger toggle
    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close menu when any mobile link or CTA is clicked
    const allMobileLinks = mobileNav.querySelectorAll('a');
    allMobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (hamburgerBtn.classList.contains('is-active')) {
          const href = link.getAttribute('href') || '';
          setMenuOpen(false, href.startsWith('#'));
        }
      });
    });

    // Close on Escape key press for accessibility
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburgerBtn.classList.contains('is-active')) {
        setMenuOpen(false);
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. HARDWARE-ACCELERATED SCROLL INTERACTIONS & CINEMATIC HERO PARALLAX
     Smooth glassmorphic elevation & buttery 60/120fps hero depth parallax
     -------------------------------------------------------------------------- */
  const siteHeader = document.getElementById('siteHeader');
  const heroSection = document.querySelector('.hero-section');
  const heroContent = heroSection ? heroSection.querySelector('.hero-content') : null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let ticking = false;
  let isScrolled = false;
  let heroInView = true;
  let lastScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
  let scrollDirection = 'down';
  let currentDeltaY = 0;


  // Ensure interactive tactile clay circles exist across all language pages
  if (heroSection) {
    if (!heroSection.querySelector('.hero-circle-1')) {
      const c1 = document.createElement('div');
      c1.className = 'hero-circle hero-circle-1';
      c1.setAttribute('aria-hidden', 'true');
      c1.setAttribute('data-cursor-expand', '');
      heroSection.prepend(c1);
    }
    if (!heroSection.querySelector('.hero-circle-2')) {
      const c2 = document.createElement('div');
      c2.className = 'hero-circle hero-circle-2';
      c2.setAttribute('aria-hidden', 'true');
      c2.setAttribute('data-cursor-expand', '');
      heroSection.prepend(c2);
    }
  }

  const heroCircle1 = heroSection ? heroSection.querySelector('.hero-circle-1') : null;
  const heroCircle2 = heroSection ? heroSection.querySelector('.hero-circle-2') : null;

  // Dynamic floating physics state for hero clay circles (120fps GPU accelerated)
  const circlePhysics = {
    c1: {
      el: heroCircle1,
      baseOpacity: 0.50,
      targetOpacity: 0.50,
      currentOpacity: 0.50,
      targetY: 0,
      currentY: 0,
      targetX: 0,
      currentX: 0,
      targetRot: 0,
      currentRot: 0,
      hoverX: 0,
      hoverY: 0,
      targetHoverX: 0,
      targetHoverY: 0,
      scale: 1,
      targetScale: 1,
      isHovered: false
    },
    c2: {
      el: heroCircle2,
      baseOpacity: 0.32,
      targetOpacity: 0.32,
      currentOpacity: 0.32,
      targetY: 0,
      currentY: 0,
      targetX: 0,
      currentX: 0,
      targetRot: 0,
      currentRot: 0,
      hoverX: 0,
      hoverY: 0,
      targetHoverX: 0,
      targetHoverY: 0,
      scale: 1,
      targetScale: 1,
      isHovered: false
    }
  };

  let circlePhysicsRaf = null;

  const renderCirclePhysics = () => {
    let hasDelta = false;

    [circlePhysics.c1, circlePhysics.c2].forEach(c => {
      if (!c.el) return;

      // Silky liquid inertia lerp factor (0.12 gives luxurious gliding weight)
      c.currentY += (c.targetY - c.currentY) * 0.12;
      c.currentX += (c.targetX - c.currentX) * 0.12;
      c.currentRot += (c.targetRot - c.currentRot) * 0.12;
      c.currentOpacity += (c.targetOpacity - c.currentOpacity) * 0.12;
      c.hoverX += (c.targetHoverX - c.hoverX) * 0.14;
      c.hoverY += (c.targetHoverY - c.hoverY) * 0.14;
      c.scale += (c.targetScale - c.scale) * 0.14;

      const totalX = (c.currentX + c.hoverX).toFixed(2);
      const totalY = (c.currentY + c.hoverY).toFixed(2);
      const rot = c.currentRot.toFixed(2);
      const s = c.scale.toFixed(3);
      const op = Math.max(0, Math.min(1, c.currentOpacity)).toFixed(3);

      c.el.style.transform = `translate3d(${totalX}px, ${totalY}px, 0) rotate(${rot}deg) scale(${s})`;
      c.el.style.opacity = op;

      if (Math.abs(c.targetY - c.currentY) > 0.04 ||
          Math.abs(c.targetX - c.currentX) > 0.04 ||
          Math.abs(c.targetOpacity - c.currentOpacity) > 0.005 ||
          Math.abs(c.targetHoverX - c.hoverX) > 0.04 ||
          Math.abs(c.targetHoverY - c.hoverY) > 0.04 ||
          Math.abs(c.targetScale - c.scale) > 0.002 ||
          c.isHovered) {
        hasDelta = true;
      }
    });

    if (hasDelta && heroInView) {
      circlePhysicsRaf = requestAnimationFrame(renderCirclePhysics);
    } else {
      circlePhysicsRaf = null;
    }
  };

  const startCirclePhysics = () => {
    if (!circlePhysicsRaf && !prefersReducedMotion && heroInView) {
      circlePhysicsRaf = requestAnimationFrame(renderCirclePhysics);
    }
  };

  // Let initial entrance reveal finish smoothly before direct parallax binding
  if (heroContent) {
    setTimeout(() => {
      heroContent.classList.add('parallax-ready');
    }, 1000);
  }

  const updateScrollInteractions = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // 1. Sticky Glassmorphic Header Elevation with Hysteresis
    if (siteHeader) {
      const shouldBeScrolled = scrollY > (isScrolled ? 15 : 35);
      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        siteHeader.classList.toggle('scrolled', isScrolled);
      }
    }


    // 2. Cinematic Hero Parallax & Soft Drift (Pure 120fps GPU Compositing)
    if (!prefersReducedMotion && heroSection) {
      const heroMaxScroll = window.innerHeight * 1.25;
      if (scrollY <= heroMaxScroll) {
        heroInView = true;
        if (heroContent && !heroContent.classList.contains('parallax-ready') && scrollY > 5) {
          heroContent.classList.add('parallax-ready');
        }

        if (heroContent) {
          heroContent.style.transform = `translate3d(0, ${(scrollY * 0.14).toFixed(1)}px, 0)`;
          const fadeOpacity = Math.max(0, 1 - (scrollY / (window.innerHeight * 0.72))).toFixed(3);
          heroContent.style.opacity = fadeOpacity;
        }

        // 2.1 Hero Clay Circles Floating Motion & Dynamic Depth Fade
        // Circle 1 (top-right, celestial 320px): floats down & right, gradual soft fade
        if (circlePhysics.c1.el) {
          circlePhysics.c1.targetY = scrollY * 0.28;
          circlePhysics.c1.targetX = scrollY * 0.08;
          circlePhysics.c1.targetRot = scrollY * 0.035;
          const fade1 = Math.max(0, 1 - (scrollY / (window.innerHeight * 0.72)));
          circlePhysics.c1.targetOpacity = circlePhysics.c1.isHovered ? 0.92 : (circlePhysics.c1.baseOpacity * fade1);
        }
        // Circle 2 (bottom-left, closer 190px): floats down & left, fades out fast & softly
        if (circlePhysics.c2.el) {
          circlePhysics.c2.targetY = scrollY * 0.44;
          circlePhysics.c2.targetX = -(scrollY * 0.09);
          circlePhysics.c2.targetRot = -(scrollY * 0.055);
          // Bottom circle fades out much earlier and faster so it dissolves before touching next section
          const fade2 = Math.max(0, 1 - (scrollY / (window.innerHeight * 0.42)));
          circlePhysics.c2.targetOpacity = circlePhysics.c2.isHovered ? 0.92 : (circlePhysics.c2.baseOpacity * fade2);
        }

        startCirclePhysics();
      } else if (heroInView) {
        // Hero is past viewport - pause updates to free 100% thread resources
        heroInView = false;
        if (circlePhysicsRaf) {
          cancelAnimationFrame(circlePhysicsRaf);
          circlePhysicsRaf = null;
        }
      }
    }


    ticking = false;
  };

  window.addEventListener('scroll', () => {
    const rawY = window.scrollY || document.documentElement.scrollTop || 0;
    const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const currentY = Math.max(0, Math.min(rawY, maxScrollY));
    currentDeltaY = currentY - lastScrollY;
    if (currentDeltaY > 0.5) {
      scrollDirection = 'down';
    } else if (currentDeltaY < -0.5) {
      scrollDirection = 'up';
    }
    lastScrollY = currentY;

    if (!ticking) {
      window.requestAnimationFrame(updateScrollInteractions);
      ticking = true;
    }
  }, { passive: true });

  // Initial check on page load to catch restored scroll positions
  updateScrollInteractions();


  /* --------------------------------------------------------------------------
     2.1 SMOOTH ANCHOR SCROLLING WITH STICKY HEADER OFFSET
     Ensures in-page buttons (#plans, #booking) scroll cleanly under header
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          // Small deferral allows mobile drawer overflow unlock to complete smoothly
          setTimeout(() => {
            const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - (headerHeight + 10);
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 60);
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     3. FUTURISTIC DESKTOP CURSOR (STRICTLY DESKTOP 992px+ AND MOUSE ONLY)
     Safeguarded so it never runs or interferes on mobile, tablet, or touch.
     -------------------------------------------------------------------------- */
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorRing = document.querySelector('.custom-cursor-ring');
  
  const isTouchDevice = () => {
    return (
      window.innerWidth < 992 ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  };

  if (!isTouchDevice() && cursorDot && cursorRing) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let ringRaf = null;
    const rootStyle = document.documentElement.style;

    // Smooth lerping requestAnimationFrame loop for the trailing ring via CSS variable
    const renderCursorRing = () => {
      if (isVisible) {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        rootStyle.setProperty('--cursor-ring-x', ringX.toFixed(2) + 'px');
        rootStyle.setProperty('--cursor-ring-y', ringY.toFixed(2) + 'px');

        if (Math.abs(mouseX - ringX) > 0.08 || Math.abs(mouseY - ringY) > 0.08) {
          ringRaf = requestAnimationFrame(renderCursorRing);
        } else {
          ringRaf = null;
        }
      } else {
        ringRaf = null;
      }
    };

    const wakeCursorRing = () => {
      if (!ringRaf && isVisible) {
        ringRaf = requestAnimationFrame(renderCursorRing);
      }
    };

    // Update root CSS variables for hardware-accelerated transform mapping
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = mouseX;
        ringY = mouseY;
        rootStyle.setProperty('--cursor-ring-x', ringX + 'px');
        rootStyle.setProperty('--cursor-ring-y', ringY + 'px');
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '0.7';
      }

      rootStyle.setProperty('--cursor-x', mouseX + 'px');
      rootStyle.setProperty('--cursor-y', mouseY + 'px');
      wakeCursorRing();
    }, { passive: true });

    // Hide when mouse exits window
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      isVisible = false;
      if (ringRaf) {
        cancelAnimationFrame(ringRaf);
        ringRaf = null;
      }
    });

    document.addEventListener('mouseenter', () => {
      if (mouseX > 0 && mouseY > 0) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '0.7';
        isVisible = true;
        wakeCursorRing();
      }
    });

    // Expand ring on interactive elements (delegated for dynamically created elements)
    const interactiveSelector = 'a, button, input, select, textarea, [data-cursor-expand], .pottery-card, .hero-circle, .card-lifestyle-badge, .lifestyle-modal-close';
    document.addEventListener('mouseover', (e) => {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        document.body.classList.add('cursor-hover');
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        const related = e.relatedTarget;
        if (!related || !related.closest || !related.closest(interactiveSelector)) {
          document.body.classList.remove('cursor-hover');
        }
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     3.1 TACTILE MAGNETIC HOVER INTERACTION FOR HERO CIRCLES
     Harmonious tactile spring attraction combined with 120fps scroll parallax
     -------------------------------------------------------------------------- */
  if (!isTouchDevice()) {
    [circlePhysics.c1, circlePhysics.c2].forEach(c => {
      if (!c.el) return;

      c.el.addEventListener('mousemove', (e) => {
        const rect = c.el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Subtle, elegant magnetic pull (up to 14px max)
        c.targetHoverX = (e.clientX - centerX) * 0.14;
        c.targetHoverY = (e.clientY - centerY) * 0.14;
        startCirclePhysics();
      });

      c.el.addEventListener('mouseenter', () => {
        c.isHovered = true;
        c.targetScale = 1.08;
        c.targetOpacity = 0.92;
        startCirclePhysics();
      });

      c.el.addEventListener('mouseleave', () => {
        c.isHovered = false;
        c.targetHoverX = 0;
        c.targetHoverY = 0;
        c.targetScale = 1.0;
        const currentScroll = window.scrollY || document.documentElement.scrollTop;
        const fadeDist = c === circlePhysics.c2 ? (window.innerHeight * 0.42) : (window.innerHeight * 0.72);
        const fade = Math.max(0, 1 - (currentScroll / fadeDist));
        c.targetOpacity = c.baseOpacity * fade;
        startCirclePhysics();
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. HARDWARE-ACCELERATED SCROLL REVEALS (120FPS)
     Desktop: Bidirectional entrance motions when scrolling DOWN and back UP.
     Mobile (< 992px / coarse touch): Downward scroll reveal ONLY — upward
     scrolling has zero motion effect so previously passed content stays solid.
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('[data-reveal]');

  const isMobileRevealView = () => (
    window.innerWidth < 992 ||
    window.matchMedia('(max-width: 991px), (hover: none) and (pointer: coarse)').matches
  );

  const setRevealStateInstantly = (el, shouldReveal) => {
    if (el._revealInstantRaf) {
      cancelAnimationFrame(el._revealInstantRaf);
      el._revealInstantRaf = null;
    }
    el.classList.add('reveal-instant');
    el.classList.remove('reveal-from-top');
    el.classList.toggle('is-revealed', shouldReveal);

    el._revealInstantRaf = requestAnimationFrame(() => {
      el._revealInstantRaf = requestAnimationFrame(() => {
        el.classList.remove('reveal-instant');
        el._revealInstantRaf = null;
      });
    });
  };

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  } else if ('IntersectionObserver' in window) {
    const observedRevealElements = new Set();
    let isInitialRevealPass = true;

    const revealObserver = new IntersectionObserver((entries) => {
      const currentScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
      const isNearPageTop = currentScrollY < 60;
      const mobileView = isMobileRevealView();

      entries.forEach(entry => {
        const el = entry.target;
        const isHero = el.classList.contains('hero-content') || el.closest('.hero-section');

        if (mobileView) {
          // MOBILE VIEW: Reveal motion ONLY when scrolling down; disabled when scrolling up
          if (entry.isIntersecting) {
            el.classList.remove('reveal-from-top');

            if (!el.classList.contains('is-revealed')) {
              if (scrollDirection === 'up' && !isInitialRevealPass) {
                // Upward scroll: show immediately with zero motion effect
                setRevealStateInstantly(el, true);
              } else {
                // Downward scroll (or initial viewport load): play smooth reveal motion
                if (el._revealInstantRaf) {
                  cancelAnimationFrame(el._revealInstantRaf);
                  el._revealInstantRaf = null;
                }
                el.classList.remove('reveal-instant');
                el.classList.add('is-revealed');
              }
            }
          } else {
            if (isHero && isNearPageTop) {
              el.classList.add('is-revealed');
              el.classList.remove('reveal-from-top');
              return;
            }

            const rect = entry.boundingClientRect;
            if (rect.bottom <= 0 || rect.top < 0) {
              // Exited above the viewport: keep revealed so scrolling back UP has zero motion
              if (!el.classList.contains('is-revealed') || el.classList.contains('reveal-from-top')) {
                setRevealStateInstantly(el, true);
              }
            } else {
              // Exited below the viewport: reset silently offscreen so scrolling DOWN animates cleanly
              if (el.classList.contains('is-revealed') || el.classList.contains('reveal-from-top')) {
                setRevealStateInstantly(el, false);
              }
            }
          }
          return;
        }

        // DESKTOP VIEW: Bidirectional scroll reveals
        if (entry.isIntersecting) {
          // Element has entered or is within the viewport
          const enteringFromTop = (scrollDirection === 'up') && !isNearPageTop && !isHero;

          if (enteringFromTop) {
            el.classList.add('reveal-from-top');
          } else {
            el.classList.remove('reveal-from-top');
          }

          el.classList.add('is-revealed');
        } else {
          // Element has completely left the viewport.
          // Keep hero elements revealed if user is resting at the top of the page.
          if (isHero && isNearPageTop) {
            el.classList.add('is-revealed');
            el.classList.remove('reveal-from-top');
            return;
          }

          // Offscreen reset: determine which direction it exited
          const rect = entry.boundingClientRect;
          el.classList.remove('is-revealed');

          if (rect.bottom <= 0 || rect.top < 0) {
            // Exited above the viewport: prime for smooth downward glide on upward scroll
            el.classList.add('reveal-from-top');
          } else {
            // Exited below the viewport: prime for smooth upward glide on downward scroll
            el.classList.remove('reveal-from-top');
          }
        }
      });

      isInitialRevealPass = false;
    }, {
      root: null,
      threshold: [0, 0.05],
      rootMargin: '15px 0px 15px 0px'
    });

    const registerRevealElement = (el) => {
      if (!el || observedRevealElements.has(el)) return;
      observedRevealElements.add(el);
      revealObserver.observe(el);
    };

    revealElements.forEach(registerRevealElement);

    // Guarantee instant visibility for all elements in initial viewport
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < (window.innerHeight || document.documentElement.clientHeight) + 80) {
        el.classList.add('is-revealed');
      }
    });

    // Safety guard: guarantee content is never stuck hidden on slower devices or initial paint
    setTimeout(() => {
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < (window.innerHeight || document.documentElement.clientHeight) + 200) {
          el.classList.add('is-revealed');
        }
      });
    }, 600);

    // Expose global observer hook for dynamically injected content
    window.observeRevealElement = (el) => {
      if (el && !el.classList.contains('is-revealed')) {
        registerRevealElement(el);
      }
    };

    // Sync state cleanly if viewport crosses between desktop and mobile breakpoints
    let wasMobileRevealView = isMobileRevealView();
    window.addEventListener('resize', () => {
      const nowMobile = isMobileRevealView();
      if (nowMobile && !wasMobileRevealView) {
        observedRevealElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.bottom <= 0 || rect.top < window.innerHeight) {
            if (!el.classList.contains('is-revealed') || el.classList.contains('reveal-from-top')) {
              setRevealStateInstantly(el, true);
            }
          } else {
            el.classList.remove('reveal-from-top');
          }
        });
      }
      wasMobileRevealView = nowMobile;
    }, { passive: true });
  } else {
    // Fallback if browser lacks IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* --------------------------------------------------------------------------
     5. MULTILINGUAL SUBDIRECTORY NAVIGATION (PURE CLIENT-SIDE, ZERO RELOADS)
     Guarantees that when a visitor is in the French or Spanish section, internal links
     (Showroom, Workshops, Our Story, etc.) always navigate cleanly within /fr/ or /es/.
     -------------------------------------------------------------------------- */
  const docLang = document.documentElement.lang;
  const isSubdirDoc = docLang === 'fr' || docLang === 'es' || docLang === 'ar';

  if (isSubdirDoc) {
    const localizedPages = ['index.html', 'showroom.html', 'workshops.html', 'our-story.html'];

    // Ensure all internal links stay safely within current language scope
    document.querySelectorAll('a[href]').forEach(link => {
      const rawHref = link.getAttribute('href');
      if (!rawHref) return;

      // Skip anchors, external links, mailto, tel, javascript
      if (rawHref.startsWith('#') || rawHref.startsWith('http') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) return;

      // Skip language switcher links (which deliberately point across language sections)
      if (link.classList.contains('lang-item')) return;

      // If an absolute path was used without language prefix (e.g. "/showroom.html"), normalize it
      if (rawHref.startsWith('/') && !rawHref.startsWith('/' + docLang + '/')) {
        const pathPart = rawHref.substring(1);
        const baseHref = pathPart.split('?')[0].split('#')[0];
        if (localizedPages.includes(baseHref)) {
          const queryHash = rawHref.substring(baseHref.length + 1);
          link.setAttribute('href', '/' + docLang + '/' + baseHref + queryHash);
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. WORKSHOP OFFERS MOBILE SWIPE CAROUSEL (< 768px)
     Ultra-smooth 120fps native-accelerated carousel with instant touch response,
     compositor-thread scroll snapping, spring card scaling, dynamic indicator pills,
     previous/next controls, and tap-to-focus card interactions.
     -------------------------------------------------------------------------- */
  const initWorkshopOffersCarousel = () => {
    const pricingGrid = document.getElementById('pricingCarousel');
    if (!pricingGrid) return;

    const cards = Array.from(pricingGrid.querySelectorAll('.pricing-card'));
    const pills = Array.from(document.querySelectorAll('.pricing-pill'));
    const prevBtn = document.querySelector('.pricing-arrow-prev');
    const nextBtn = document.querySelector('.pricing-arrow-next');
    const counterBadge = document.querySelector('.pricing-swipe-badge .swipe-counter-pill') || document.querySelector('.pricing-swipe-badge .swipe-counter');

    if (cards.length === 0) return;

    let currentIndex = 1;
    let isProgrammatic = false;
    let programmaticTimer = null;
    let cachedStep = 0;
    let isInitialized = false;

    const isRTLCarousel = () => (
      document.documentElement.dir === 'rtl' ||
      getComputedStyle(pricingGrid).direction === 'rtl'
    );

    // Cache card distance without layout thrashing (works in both LTR & RTL)
    const updateGeometry = () => {
      if (cards.length > 1) {
        cachedStep = Math.abs(Math.round(cards[1].offsetLeft - cards[0].offsetLeft));
      }
      if (!cachedStep || cachedStep <= 0) {
        cachedStep = Math.round(cards[0].offsetWidth + 18);
      }
    };

    // Calculate exact scrollLeft to center a card precisely (LTR & RTL safe)
    const getCardScrollLeft = (index) => {
      if (index < 0 || index >= cards.length) return 0;
      const card = cards[index];
      const gridRect = pricingGrid.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      if (gridRect.width > 0 && cardRect.width > 0) {
        const delta = (cardRect.left + cardRect.width / 2) - (gridRect.left + gridRect.width / 2);
        return Math.round(pricingGrid.scrollLeft + delta);
      }
      const gridWidth = pricingGrid.clientWidth;
      const cardWidth = card.offsetWidth;
      return Math.round(card.offsetLeft - (gridWidth - cardWidth) / 2);
    };

    const updateUIState = (index) => {
      if (index === currentIndex && isInitialized) return;
      currentIndex = index;

      // Update active card styling
      cards.forEach((card, i) => {
        const isActive = (i === index);
        card.classList.toggle('is-card-active', isActive);
      });

      // Update pills
      pills.forEach((pill, i) => {
        const isActive = (i === index);
        pill.classList.toggle('is-active', isActive);
        pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update previous / next arrow states
      if (prevBtn) {
        const isPrevDisabled = (index === 0);
        prevBtn.disabled = isPrevDisabled;
        prevBtn.classList.toggle('is-disabled', isPrevDisabled);
      }
      if (nextBtn) {
        const isNextDisabled = (index === cards.length - 1);
        nextBtn.disabled = isNextDisabled;
        nextBtn.classList.toggle('is-disabled', isNextDisabled);
      }

      // Update counter badge text
      if (counterBadge) {
        const star = (index === 2) ? ' ★' : '';
        counterBadge.textContent = `${index + 1} / ${cards.length}${star}`;
      }
    };

    const scrollToOffer = (index, smooth = true) => {
      if (index < 0 || index >= cards.length) return;
      if (window.innerWidth > 768) return;

      updateGeometry();
      updateUIState(index);

      const targetScrollLeft = getCardScrollLeft(index);
      const clampedLeft = isRTLCarousel()
        ? Math.min(0, targetScrollLeft)
        : Math.max(0, targetScrollLeft);

      if (smooth) {
        isProgrammatic = true;
        // Temporarily disengage snap to eliminate WebKit/Blink jitter during smooth scrollTo
        pricingGrid.style.scrollSnapType = 'none';
        pricingGrid.scrollTo({
          left: clampedLeft,
          behavior: 'smooth'
        });

        clearTimeout(programmaticTimer);
        programmaticTimer = setTimeout(() => {
          pricingGrid.style.scrollSnapType = '';
          isProgrammatic = false;
        }, 380);
      } else {
        pricingGrid.scrollTo({
          left: clampedLeft,
          behavior: 'auto'
        });
      }
    };

    // Lightweight 120fps passive scroll tracking with zero layout reflows (LTR & RTL safe)
    let scrollRaf = null;
    const handleScroll = () => {
      if (window.innerWidth > 768) return;
      if (isProgrammatic) return;

      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        if (!cachedStep) updateGeometry();
        const scrollDist = Math.abs(pricingGrid.scrollLeft);
        const rawIndex = scrollDist / (cachedStep || 1);
        const activeIndex = Math.max(0, Math.min(cards.length - 1, Math.round(rawIndex)));

        if (activeIndex !== currentIndex) {
          updateUIState(activeIndex);
        }
      });
    };

    pricingGrid.addEventListener('scroll', handleScroll, { passive: true });

    // Handle scrollend where supported for pixel-perfect resting state sync
    if ('onscrollend' in window) {
      pricingGrid.addEventListener('scrollend', () => {
        if (window.innerWidth > 768) return;
        if (isProgrammatic) return;
        handleScroll();
      }, { passive: true });
    }

    // Pill click navigation
    pills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(pill.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          scrollToOffer(idx, true);
        }
      });
    });

    // Arrow navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex > 0) {
          scrollToOffer(currentIndex - 1, true);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex < cards.length - 1) {
          scrollToOffer(currentIndex + 1, true);
        }
      });
    }

    // Tap-to-focus: clicking a resting offer card smoothly centers and activates it
    cards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;
        if (e.target.closest('a, button')) return;
        if (idx !== currentIndex) {
          e.preventDefault();
          scrollToOffer(idx, true);
        }
      });
    });

    // Smooth drag-to-scroll support for mouse/desktop testing
    let isMouseDown = false;
    let startPageX = 0;
    let startScrollLeft = 0;
    let dragDistance = 0;

    pricingGrid.addEventListener('mousedown', (e) => {
      if (window.innerWidth > 768) return;
      if (e.target.closest('a, button')) return;
      isMouseDown = true;
      dragDistance = 0;
      startPageX = e.pageX;
      startScrollLeft = pricingGrid.scrollLeft;
      pricingGrid.classList.add('is-dragging');
      pricingGrid.style.scrollSnapType = 'none';
    });

    window.addEventListener('mouseup', () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      pricingGrid.classList.remove('is-dragging');
      pricingGrid.style.scrollSnapType = '';
      if (Math.abs(dragDistance) > 30) {
        updateGeometry();
        const scrollDist = Math.abs(pricingGrid.scrollLeft);
        const activeIndex = Math.max(0, Math.min(cards.length - 1, Math.round(scrollDist / (cachedStep || 1))));
        scrollToOffer(activeIndex, true);
      }
    });

    pricingGrid.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      const currentX = e.pageX;
      dragDistance = currentX - startPageX;
      pricingGrid.scrollLeft = startScrollLeft - dragDistance;
      handleScroll();
    });

    // Handle viewport resize (clean reset between desktop and mobile)
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        updateGeometry();
        scrollToOffer(currentIndex, false);
      } else {
        cards.forEach(card => {
          card.classList.remove('is-card-active');
          card.style.transform = '';
          card.style.opacity = '';
        });
      }
    }, { passive: true });

    // Initial setup on load (default strictly to Offer 2 / index 1 on mobile)
    const centerDefaultOffer = () => {
      if (window.innerWidth <= 768) {
        updateGeometry();
        updateUIState(1);
        scrollToOffer(1, false);
        isInitialized = true;
      }
    };

    centerDefaultOffer();
    setTimeout(centerDefaultOffer, 50);
    window.addEventListener('load', centerDefaultOffer, { once: true });
  };

  initWorkshopOffersCarousel();

  /* --------------------------------------------------------------------------
     7. EDITORIAL BIOGRAPHICAL CHAPTERS MOTION (OUR STORY)
     Smooth 120fps liquid-interpolated watermark depth drift & active reading spotlight
     -------------------------------------------------------------------------- */
  const initStoryChaptersMotion = () => {
    const chapterCards = document.querySelectorAll('.chapter-card');
    if (chapterCards.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 7.1 Active Chapter Reading Spotlight Observer with Hysteresis
    if ('IntersectionObserver' in window) {
      const readingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-reading-active');
          } else {
            entry.target.classList.remove('is-reading-active');
          }
        });
      }, {
        root: null,
        // Active when reading in middle 55% of viewport
        rootMargin: '-20% 0px -25% 0px',
        threshold: 0.15
      });

      chapterCards.forEach(card => readingObserver.observe(card));
    }

    // 7.2 Buttery Liquid Inertia Watermark Parallax Drift on Scroll (Pure 120fps)
    if (!prefersReducedMotion) {
      const watermarkItems = [];
      chapterCards.forEach(card => {
        const wm = card.querySelector('.chapter-watermark');
        if (wm) {
          watermarkItems.push({
            card,
            wm,
            currentY: 0,
            targetY: 0
          });
        }
      });

      let parallaxRaf = null;

      const renderWatermarkPhysics = () => {
        let hasDelta = false;
        const vh = window.innerHeight;

        // Phase 1: Batch DOM measurements to prevent layout thrashing
        watermarkItems.forEach(item => {
          const rect = item.card.getBoundingClientRect();
          if (rect.bottom >= -150 && rect.top <= vh + 150) {
            const cardCenter = rect.top + rect.height / 2;
            const screenCenter = vh / 2;
            item.targetY = (cardCenter - screenCenter) * -0.065;
          }
        });

        // Phase 2: Batch GPU-accelerated compositor writes for 120fps throughput
        watermarkItems.forEach(item => {
          // Smooth 120fps liquid lerp (0.10 factor = buttery gliding inertia)
          item.currentY += (item.targetY - item.currentY) * 0.10;
          item.wm.style.transform = `translate3d(0, ${item.currentY.toFixed(2)}px, 0)`;

          if (Math.abs(item.targetY - item.currentY) > 0.05) {
            hasDelta = true;
          }
        });

        if (hasDelta) {
          parallaxRaf = requestAnimationFrame(renderWatermarkPhysics);
        } else {
          parallaxRaf = null;
        }
      };

      const triggerParallax = () => {
        if (!parallaxRaf) {
          parallaxRaf = requestAnimationFrame(renderWatermarkPhysics);
        }
      };

      window.addEventListener('scroll', triggerParallax, { passive: true });
      window.addEventListener('resize', triggerParallax, { passive: true });

      // Initial alignment
      renderWatermarkPhysics();
    }
  };

  initStoryChaptersMotion();

  /* --------------------------------------------------------------------------
     8. IN-USE LIFESTYLE PREVIEW & CERAMIC LIGHTBOX SYSTEM
     Seamless tap-to-preview interactions for pottery in daily living rituals
     -------------------------------------------------------------------------- */
  const initLifestylePreviewSystem = () => {
    const lifestyleCards = Array.from(document.querySelectorAll('.pottery-card[data-lifestyle-img]'));
    if (lifestyleCards.length === 0) return;

    const docLang = document.documentElement.lang || 'en';

    const i18n = {
      en: {
        badgeText: 'View in Use',
        tag: 'Everyday Ritual',
        closeLabel: 'Close preview',
        waLabel: 'Enquire via WhatsApp',
        defaultNote: 'Handcrafted ceramic piece in everyday life — wheel-thrown in Agadir from 100% natural Moroccan clay.'
      },
      fr: {
        badgeText: 'Voir en situation',
        tag: 'Rituel du quotidien',
        closeLabel: "Fermer l'aperçu",
        waLabel: 'Demander via WhatsApp',
        defaultNote: "Pièce en céramique artisanale dans le quotidien — façonnée au tour à Agadir à partir d'argile marocaine 100% naturelle."
      },
      es: {
        badgeText: 'Ver en uso',
        tag: 'Ritual cotidiano',
        closeLabel: 'Cerrar vista',
        waLabel: 'Consultar por WhatsApp',
        defaultNote: 'Pieza de cerámica artesanal en la vida diaria — torneada a mano en Agadir con arcilla marroquí 100% natural.'
      },
      ar: {
        badgeText: 'معاينة أثناء الاستخدام',
        tag: 'في الحياة اليومية',
        closeLabel: 'إغلاق المعاينة',
        waLabel: 'استفسر عبر واتساب',
        defaultNote: 'تحفة خزفية حرفية في تفاصيل الحياة اليومية — مشكّلة يدوياً على الدولاب في أكادير من طين مغربي طبيعي 100%.'
      }
    };

    const strings = i18n[docLang] || i18n.en;

    // Create single reusable accessible lightbox modal if not already present
    let modal = document.getElementById('lifestyleModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'lifestyleModal';
      modal.className = 'lifestyle-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('aria-labelledby', 'lifestyleModalTitle');
      modal.innerHTML = `
        <div class="lifestyle-modal-backdrop" aria-hidden="true"></div>
        <div class="lifestyle-modal-container">
          <div class="lifestyle-modal-card">
            <button type="button" class="lifestyle-modal-close" aria-label="${strings.closeLabel}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div class="lifestyle-modal-stage">
              <div class="lifestyle-modal-img-wrap">
                <div class="lifestyle-modal-loader" aria-hidden="true">
                  <span class="lifestyle-modal-spinner"></span>
                </div>
                <img id="lifestyleModalImg" class="lifestyle-modal-img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" alt="">
              </div>
            </div>
            <div class="lifestyle-modal-details">
              <div class="lifestyle-modal-text">
                <div class="lifestyle-modal-eyebrow">
                  <span class="mono-tag">${strings.tag}</span>
                </div>
                <h3 id="lifestyleModalTitle" class="lifestyle-modal-heading"></h3>
                <p id="lifestyleModalDesc" class="lifestyle-modal-copy"></p>
              </div>
              <div class="lifestyle-modal-cta">
                <a id="lifestyleModalWa" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>${strings.waLabel}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const modalImg = modal.querySelector('#lifestyleModalImg');
    const modalTitle = modal.querySelector('#lifestyleModalTitle');
    const modalDesc = modal.querySelector('#lifestyleModalDesc');
    const modalWa = modal.querySelector('#lifestyleModalWa');
    const modalBackdrop = modal.querySelector('.lifestyle-modal-backdrop');
    const modalCloseBtn = modal.querySelector('.lifestyle-modal-close');

    let activeLoadToken = 0;
    let lastFocusedTrigger = null;

    const trapFocus = (e) => {
      if (!modal.classList.contains('is-active')) return;
      if (e.key !== 'Tab') return;

      const focusables = Array.from(modal.querySelectorAll('button:not([disabled]), a:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const openModal = (pieceData, triggerEl) => {
      lastFocusedTrigger = triggerEl || document.activeElement;
      const currentToken = ++activeLoadToken;
      const targetSrc = pieceData.lifestyleImg;

      modalTitle.textContent = pieceData.title;
      modalDesc.textContent = pieceData.note || strings.defaultNote;
      modalWa.href = pieceData.waHref || 'https://wa.me/212657110942';

      // Always clear out previous product's image to prevent stale image sticking
      if (modalImg.getAttribute('src') !== targetSrc) {
        modalImg.classList.remove('is-loaded');
        modal.classList.add('is-loading');
        modalImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";

        const tempImg = new Image();
        tempImg.onload = () => {
          if (currentToken === activeLoadToken) {
            modalImg.src = targetSrc;
            modalImg.alt = pieceData.lifestyleAlt || pieceData.title;
            requestAnimationFrame(() => {
              modalImg.classList.add('is-loaded');
              modal.classList.remove('is-loading');
            });
          }
        };
        tempImg.onerror = () => {
          if (currentToken === activeLoadToken) {
            modalImg.src = targetSrc;
            modalImg.alt = pieceData.lifestyleAlt || pieceData.title;
            modalImg.classList.add('is-loaded');
            modal.classList.remove('is-loading');
          }
        };
        tempImg.src = targetSrc;

        // If the browser already cached this image, show it without delay
        if (tempImg.complete && tempImg.naturalWidth > 0) {
          modalImg.src = targetSrc;
          modalImg.alt = pieceData.lifestyleAlt || pieceData.title;
          modalImg.classList.add('is-loaded');
          modal.classList.remove('is-loading');
        }
      } else {
        modalImg.classList.add('is-loaded');
        modal.classList.remove('is-loading');
      }

      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lifestyle-modal-open');

      window.addEventListener('keydown', trapFocus);
      requestAnimationFrame(() => {
        if (modalCloseBtn) modalCloseBtn.focus();
      });
    };

    const closeModal = () => {
      window.removeEventListener('keydown', trapFocus);
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lifestyle-modal-open');

      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
        lastFocusedTrigger.focus();
      }

      // Clear image when closed so reopening never shows stale frame
      setTimeout(() => {
        if (!modal.classList.contains('is-active')) {
          activeLoadToken++;
          modalImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";
          modalImg.classList.remove('is-loaded');
          modal.classList.remove('is-loading');
        }
      }, 350);
    };

    // Close listeners
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Touch swipe down to dismiss modal on mobile
    let touchStartY = 0;
    modal.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        if (deltaY > 90) {
          closeModal();
        }
      }
    }, { passive: true });

    // Enhance each card with in-use media and interactions
    lifestyleCards.forEach(card => {
      const imgContainer = card.querySelector('.pottery-img-container');
      const studioImgEl = imgContainer ? imgContainer.querySelector('img') : null;
      if (!imgContainer || !studioImgEl) return;

      const titleEl = card.querySelector('.pottery-card-title');
      const waBtn = card.querySelector('.btn-whatsapp');

      const pieceData = {
        title: titleEl ? titleEl.textContent.trim() : 'Ceramic Creation',
        studioImg: studioImgEl.getAttribute('src') || studioImgEl.src,
        studioAlt: studioImgEl.getAttribute('alt') || '',
        lifestyleImg: card.getAttribute('data-lifestyle-img'),
        lifestyleAlt: card.getAttribute('data-lifestyle-alt') || '',
        note: card.getAttribute('data-lifestyle-note') || '',
        waHref: waBtn ? waBtn.getAttribute('href') : ''
      };

      // 1. Add floating preview pill badge if not yet present
      let badge = imgContainer.querySelector('.card-lifestyle-badge');
      if (!badge) {
        badge = document.createElement('button');
        badge.type = 'button';
        badge.className = 'card-lifestyle-badge';
        badge.setAttribute('aria-label', `${strings.badgeText} - ${pieceData.title}`);
        badge.setAttribute('data-cursor-expand', '');
        badge.innerHTML = `
          <span class="lifestyle-badge-icon" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </span>
          <span class="lifestyle-badge-text">${strings.badgeText}</span>
        `;
        imgContainer.appendChild(badge);
      }

      // Explicit accessible click handler on badge
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(pieceData, badge);
      });

      // 2. Click events on card surface (without invalid nested role="button" on card)
      card.setAttribute('data-cursor-expand', '');
      card.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        openModal(pieceData, badge);
      });
    });

    // Idle background preloading for instant preview responsiveness
    const preloadLifestyleImages = () => {
      if (navigator.connection && (navigator.connection.saveData || (navigator.connection.effectiveType && navigator.connection.effectiveType.includes('2g')))) {
        return;
      }
      const urls = [];
      lifestyleCards.forEach(card => {
        const url = card.getAttribute('data-lifestyle-img');
        if (url && !urls.includes(url)) urls.push(url);
      });

      let idx = 0;
      const loadNext = () => {
        if (idx >= urls.length) return;
        const img = new Image();
        img.src = urls[idx++];
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadNext, { timeout: 2000 });
        } else {
          setTimeout(loadNext, 200);
        }
      };

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadNext, { timeout: 3000 });
      } else {
        setTimeout(loadNext, 1200);
      }
    };

    if (document.readyState === 'complete') {
      preloadLifestyleImages();
    } else {
      window.addEventListener('load', preloadLifestyleImages, { once: true });
    }
  };

  initLifestylePreviewSystem();

});
