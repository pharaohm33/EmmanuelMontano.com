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

// Shrink the whole page (CSS zoom) just enough that the opt-in card fits
// entirely on screen, then auto-scroll to it shortly after landing —
// unless the visitor has already started scrolling/interacting on their own.
let userInteracted = false;
const markInteracted = () => { userInteracted = true; };
['wheel', 'touchstart', 'keydown'].forEach((evt) =>
  window.addEventListener(evt, markInteracted, { once: true, passive: true })
);

function fitJoinCardToScreen() {
  const card = document.querySelector('.join-card');
  if (!card || !('zoom' in document.documentElement.style)) return;

  document.documentElement.style.zoom = 1;

  requestAnimationFrame(() => {
    const cardHeight = card.getBoundingClientRect().height;
    const needed = cardHeight + 140; // card + breathing room for section padding
    if (needed > window.innerHeight) {
      const scale = Math.max(0.55, Math.min(1, window.innerHeight / needed));
      document.documentElement.style.zoom = scale;
    }
  });
}

window.addEventListener('load', fitJoinCardToScreen);
window.addEventListener('resize', fitJoinCardToScreen);

setTimeout(() => {
  if (!userInteracted) {
    document.getElementById('join').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}, 2000);
