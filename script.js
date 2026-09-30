// Scroll-in reveal animations
const revealEls = document.querySelectorAll('.reveal');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el) => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

// Auto-scroll to the email opt-in shortly after landing, unless the
// visitor has already started scrolling/interacting on their own.
let userInteracted = false;
const markInteracted = () => { userInteracted = true; };
['wheel', 'touchstart', 'keydown'].forEach((evt) =>
  window.addEventListener(evt, markInteracted, { once: true, passive: true })
);

setTimeout(() => {
  if (!userInteracted) {
    // Instant, not smooth: an animated scroll can still be moving the page
    // under a visitor's finger if they tap inside the beehiiv form right as
    // it fires (touches inside a cross-origin iframe never reach this page's
    // JS, so we can't detect/cancel a scroll that's colliding with a tap).
    // An instant jump closes that window almost entirely.
    document.getElementById('join').scrollIntoView({ behavior: 'auto', block: 'start' });
  }
}, 2000);

// After a visitor subscribes via the beehiiv embed, scroll them down to the
// full links list. The form itself is a cross-origin iframe, so the only
// way to know it was submitted is a postMessage from beehiiv's domain —
// there's no public spec for that payload's exact shape, so this matches
// broadly on common success/subscribe wording rather than one fixed key.
// If it doesn't fire in practice, capture the real event.data (e.g. via
// console.log in devtools) and tighten this match to it.
window.addEventListener('message', (event) => {
  if (!/beehiiv/i.test(event.origin)) return;
  let payload = event.data;
  if (typeof payload === 'string') {
    try { payload = JSON.parse(payload); } catch (err) { /* keep as string */ }
  }
  const signal = typeof payload === 'string' ? payload : JSON.stringify(payload || '');
  if (/subscribe|success|submit/i.test(signal)) {
    document.getElementById('links').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
