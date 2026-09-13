(() => {
  const reviews = document.querySelector('.reviews');
  if (!reviews) return;
  const view = reviews.querySelector('.review-view');
  const track = reviews.querySelector('.review-track');
  const cards = Array.from(reviews.querySelectorAll('.review-card'));
  const dots = Array.from(reviews.querySelectorAll('[data-review-dot]'));
  const current = reviews.querySelector('[data-review-current]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let visible = false;
  let hovered = false;
  let focused = false;
  let pointerStart = null;

  function show(next) {
    index = (next + cards.length) % cards.length;
    track.style.setProperty('--slide-index', index);
    current.textContent = String(index + 1).padStart(2, '0');
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    cards.forEach((card, i) => { card.setAttribute('aria-hidden', String(i !== index)); card.inert = i !== index; });
  }

  reviews.querySelector('[data-review-prev]').addEventListener('click', () => show(index - 1));
  reviews.querySelector('[data-review-next]').addEventListener('click', () => show(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  reviews.addEventListener('mouseenter', () => { hovered = true; });
  reviews.addEventListener('mouseleave', () => { hovered = false; });
  reviews.addEventListener('focusin', () => { focused = true; });
  reviews.addEventListener('focusout', () => { focused = reviews.contains(document.activeElement); });
  view.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
  });
  view.addEventListener('pointerdown', (event) => { pointerStart = event.clientX; });
  view.addEventListener('pointerup', (event) => {
    if (pointerStart !== null && Math.abs(event.clientX - pointerStart) > 55) show(index + (event.clientX < pointerStart ? 1 : -1));
    pointerStart = null;
  });
  view.addEventListener('pointercancel', () => { pointerStart = null; });
  show(0);

  if ('IntersectionObserver' in window) {
    const reviewsObserver = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0.25 });
    reviewsObserver.observe(reviews);
    if (!prefersReducedMotion.matches) {
      const targets = document.querySelectorAll('.section-heading, .service-grid article, .about-photo, .about-copy, .reviews-copy, .review-view, .contact-details, .location-heading');
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });
      targets.forEach((target) => { target.classList.add('will-reveal'); revealObserver.observe(target); });
    }
  } else visible = true;
  window.setInterval(() => {
    if (visible && !hovered && !focused && !document.hidden && !prefersReducedMotion.matches) show(index + 1);
  }, 8500);
})();
