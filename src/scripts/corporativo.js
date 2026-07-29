/* Scripts — corporativo.astro */

(function () {
  const nav = document.querySelector('.r-nav');
  const navLinks = document.querySelector('.r-nav-links');
  const burger = document.querySelector('.r-burger');
  const mobileMenu = document.querySelector('.r-mobile-menu');
  const depTrack = document.querySelector('.r-deptrack');
  const depBtns = document.querySelectorAll('.r-depbtn');

  // ── Nav scroll shrink ──────────────────────────────────────────────
  let navThreshold = 0;
  function computeNavThreshold() {
    const autoridade = document.querySelector('.r-autoridade');
    navThreshold = autoridade
      ? Math.max(0, autoridade.offsetTop - (nav ? nav.offsetHeight : 80))
      : window.innerHeight * 0.85;
  }

  function updateNav() {
    if (!nav) return;
    const narrow = window.innerWidth <= 768;
    const h = narrow ? 24 : 60;
    if (window.scrollY >= navThreshold) {
      nav.style.padding = (narrow ? 12 : 15) + 'px ' + h + 'px';
      nav.style.background = 'rgba(26,22,18,0.95)';
      nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.18)';
      if (navLinks) { navLinks.style.opacity = '1'; navLinks.style.pointerEvents = 'auto'; }
      if (burger) burger.style.opacity = '1';
    } else {
      nav.style.padding = (narrow ? 18 : 24) + 'px ' + h + 'px';
      nav.style.background = 'transparent';
      nav.style.boxShadow = 'none';
      if (navLinks) { navLinks.style.opacity = '0'; navLinks.style.pointerEvents = 'none'; }
      if (burger) burger.style.opacity = '0';
    }
  }

  computeNavThreshold();
  updateNav();
  window.addEventListener('load', () => { computeNavThreshold(); updateNav(); });
  window.addEventListener('scroll', updateNav, { passive: true });

  // ── Responsive nav ─────────────────────────────────────────────────
  function applyResponsive() {
    const narrow = window.innerWidth <= 880;
    if (navLinks) navLinks.style.display = narrow ? 'none' : 'flex';
    if (burger) burger.style.display = narrow ? 'flex' : 'none';
    updateNav();
    if (!narrow && mobileMenu) {
      mobileMenu.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  applyResponsive();
  window.addEventListener('resize', () => { computeNavThreshold(); applyResponsive(); });

  // ── Mobile menu ────────────────────────────────────────────────────
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    if (mobileMenu) mobileMenu.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    if (mobileMenu) mobileMenu.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  }

  // ── Reveal on scroll ───────────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const revealEl = (el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          revealEl(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 60px 0px' });

    requestAnimationFrame(() => {
      const hidden = [];
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          revealEl(el);
          return;
        }
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity .8s ease, transform .8s ease';
        io.observe(el);
        hidden.push(el);
      });

      if (hidden.length) {
        setTimeout(() => hidden.forEach(revealEl), 5000);
      }
    });
  }

  // ── Marquee carousels (Experiência / Parceiros) ─────────────────────
  function initMarquee(carouselId, trackId, speedDesktop, speedMobile, visibleMobile, visibleTablet, visibleDesktop) {
    const carousel = document.getElementById(carouselId);
    const track = document.getElementById(trackId);
    if (!carousel || !track) return;

    const GAP = parseFloat(getComputedStyle(track).gap) || 3;
    const SPEED = window.innerWidth < 600 ? speedMobile : speedDesktop;
    const originals = Array.from(track.children);
    const MOBILE_VISIBLE = visibleMobile || 1;
    const TABLET_VISIBLE = visibleTablet || 2;
    const DESKTOP_VISIBLE = visibleDesktop || 3;

    originals.forEach((s) => track.appendChild(s.cloneNode(true)));

    function getVisible() {
      return window.innerWidth < 600 ? MOBILE_VISIBLE : window.innerWidth < 900 ? TABLET_VISIBLE : DESKTOP_VISIBLE;
    }

    function setWidths() {
      const visible = getVisible();
      const w = (carousel.offsetWidth - GAP * (visible - 1)) / visible;
      track.querySelectorAll(':scope > *').forEach((s) => {
        s.style.width = w + 'px';
        if (carouselId === 'partners-carousel') {
          s.style.height = w + 'px';
        } else if (carouselId === 'exp-carousel') {
          s.style.height = Math.round(w * 4 / 3) + 'px';
        }
      });
    }

    function loopWidth() {
      return (originals[0].offsetWidth + GAP) * originals.length;
    }

    let x = 0;
    function tick() {
      x += SPEED;
      if (x >= loopWidth()) x -= loopWidth();
      track.style.transform = `translateX(-${x}px)`;
      requestAnimationFrame(tick);
    }

    function init() {
      if (!carousel.offsetWidth) {
        requestAnimationFrame(init);
        return;
      }
      setWidths();
      requestAnimationFrame(tick);
    }

    if (document.readyState === 'complete') {
      requestAnimationFrame(init);
    } else {
      window.addEventListener('load', () => requestAnimationFrame(init));
    }

    window.addEventListener('resize', () => { setWidths(); x = 0; });
  }

  initMarquee('exp-carousel', 'exp-track', 0.8, 1.4, 1, 2, 3);
  initMarquee('partners-carousel', 'partners-track', 0.6, 1.1, 2, 4, 6);

  // ── Testimonials carousel ──────────────────────────────────────────
  if (depTrack) {
    function smoothScroll(el, target, duration) {
      const start = el.scrollLeft;
      const delta = target - start;
      if (!delta) return;
      el.style.scrollSnapType = 'none';
      const startTime = performance.now();
      function animate(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        el.scrollLeft = start + delta * ease;
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          el.style.scrollSnapType = '';
        }
      }
      requestAnimationFrame(animate);
    }

    function scrollDep(isPrev) {
      const card = depTrack.firstElementChild;
      const gap = parseFloat(getComputedStyle(depTrack).gap) || 20;
      const cardWidth = card ? card.getBoundingClientRect().width + gap : 320;
      smoothScroll(depTrack, depTrack.scrollLeft + (isPrev ? -cardWidth : cardWidth), 400);
    }

    depBtns.forEach((btn) => {
      btn.addEventListener('click', () => scrollDep(btn.getAttribute('aria-label') === 'Anterior'));
    });

    document.querySelectorAll('.dep-nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => scrollDep(btn.classList.contains('dep-nav-prev')));
    });
  }

  // ── Smooth-scroll anchor links (fallback if Lenis not active) ─────
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        closeMenu();
      }
    });
  });
})();
