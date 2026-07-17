(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const navShell = document.querySelector('.nav-shell');
  if (navShell) {
    const themeToggle = document.createElement('button');
    themeToggle.type = 'button';
    themeToggle.className = 'theme-toggle';

    function updateThemeToggle() {
      const isLight = document.documentElement.dataset.theme === 'light';
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to night theme' : 'Switch to light theme');
      themeToggle.title = isLight ? 'Night theme' : 'Light theme';
      themeToggle.innerHTML = isLight
        ? '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>'
        : '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>';
    }

    themeToggle.addEventListener('click', function () {
      const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = nextTheme;
      try { localStorage.setItem('interp-theme', nextTheme); } catch (error) { /* Theme still works for this page. */ }
      updateThemeToggle();
    });

    updateThemeToggle();
    navShell.insertBefore(themeToggle, navShell.querySelector('.nav-shell > .button'));
  }

  const revealItems = document.querySelectorAll([
    '.section-heading',
    '.frontier-title',
    '.frontier-copy',
    '.date-card',
    '.speaker-card',
    '.organizer-card',
    '.sponsor-card',
    '.schedule-row',
    '.detail-card',
    '.content-panel',
    '.side-card',
    '.question-card',
    '.topic-card'
  ].join(','));

  revealItems.forEach(function (item, index) {
    item.classList.add('reveal-item');
    item.style.setProperty('--reveal-delay', Math.min(index % 3, 2) * 70 + 'ms');
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  } else {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - headerOffset - 16,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
    history.pushState(null, '', hash);

    const menu = link.closest('details');
    if (menu) menu.removeAttribute('open');
  });
})();
