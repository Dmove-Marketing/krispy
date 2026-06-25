/* Scripts — casamentos.astro */

(function () {
  const nav = document.querySelector('.r-nav');
  const navLinks = document.querySelector('.r-nav-links');
  const burger = document.querySelector('.r-burger');
  const mobileMenu = document.querySelector('[data-dc-tpl="19"]');
  const depTrack = document.querySelector('.r-deptrack');
  const depBtns = document.querySelectorAll('.r-depbtn');

  // ── Nav scroll shrink ──────────────────────────────────────────────
  function updateNav() {
    if (!nav) return;
    const narrow = window.innerWidth <= 768;
    const h = narrow ? 24 : 60;
    if (window.scrollY > 30) {
      nav.style.padding = (narrow ? 12 : 15) + 'px ' + h + 'px';
      nav.style.background = 'rgba(26,22,18,0.95)';
      nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.18)';
    } else {
      nav.style.padding = (narrow ? 18 : 24) + 'px ' + h + 'px';
      nav.style.background = 'rgba(47,29,19,0.78)';
      nav.style.boxShadow = 'none';
    }
  }

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
  window.addEventListener('resize', applyResponsive);

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
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    requestAnimationFrame(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        // skip elements that are already visible (above fold)
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.style.opacity = '1';
          el.style.transform = 'none';
          return;
        }
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity .8s ease, transform .8s ease';
        io.observe(el);
      });
    });
  }

  // ── Testimonials carousel ──────────────────────────────────────────
  if (depTrack) {
    depBtns.forEach((btn) => {
      const isPrev = btn.getAttribute('aria-label') === 'Anterior';
      btn.addEventListener('click', () => {
        const card = depTrack.firstElementChild;
        const gap = parseFloat(getComputedStyle(depTrack).gap) || 20;
        const step = card ? card.getBoundingClientRect().width + gap : 320;
        depTrack.scrollTo({
          left: depTrack.scrollLeft + (isPrev ? -step : step),
          behavior: 'smooth',
        });
      });
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
