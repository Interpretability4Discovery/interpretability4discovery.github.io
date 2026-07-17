(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    target.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
    history.pushState(null, '', hash);

    const menu = link.closest('details');
    if (menu) menu.removeAttribute('open');
  });
})();
