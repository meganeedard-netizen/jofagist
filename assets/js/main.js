/* JOFAGIST — main.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky header ── */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav toggle ── */
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');

  toggle?.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* ── Mobile dropdown sub-menus ── */
  document.querySelectorAll('.nav-item.has-dropdown .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const item = link.closest('.nav-item');
        item.classList.toggle('open');
      }
    });
  });

  /* ── Close nav on resize ── */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      menu?.classList.remove('open');
      toggle?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /* ── Close nav on outside click ── */
  document.addEventListener('click', (e) => {
    if (menu?.classList.contains('open') && !header?.contains(e.target)) {
      menu.classList.remove('open');
      toggle?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /* ── Active nav link ── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === currentPage) link.classList.add('active');
  });

  /* ── Scroll reveal ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ── Counter animation ── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ── Contact form ── */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Envoi en cours...';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.reset();
        if (successMsg) { successMsg.style.display = 'block'; }
        btn.textContent = 'Message envoyé !';
      } else {
        btn.textContent = 'Erreur — réessayez';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Erreur — réessayez';
      btn.disabled = false;
    }
  });

  /* ── Before/after carousels ── */
  document.querySelectorAll('.ba-carousel-wrap').forEach((wrap) => {
    const slides = wrap.querySelectorAll('.ba-carousel-slide');
    const dots   = wrap.querySelectorAll('.ba-dot');
    const prev   = wrap.querySelector('.ba-carousel-prev');
    const next   = wrap.querySelector('.ba-carousel-next');
    let current  = 0;

    const goTo = (index) => {
      slides[current]?.classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current]?.classList.add('active');
      dots[current]?.classList.add('active');
    };

    prev?.addEventListener('click', () => goTo(current - 1));
    next?.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  });

  /* ── Gallery carousels ── */
  document.querySelectorAll('.gallery-carousel').forEach((car) => {
    const track = car.querySelector('.gallery-carousel-track');
    const prev  = car.querySelector('.gallery-carousel-prev');
    const next  = car.querySelector('.gallery-carousel-next');
    const scrollStep = () => (track.querySelector('.gallery-item')?.offsetWidth || 280) + 16;

    prev?.addEventListener('click', () => track.scrollBy({ left: -scrollStep(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: scrollStep(), behavior: 'smooth' }));
  });

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
