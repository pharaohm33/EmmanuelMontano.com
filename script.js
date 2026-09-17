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
