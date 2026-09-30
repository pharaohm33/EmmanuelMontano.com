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
// way to know it was submitted is a postMessage from beehiiv's domain.
// Known routine messages observed from the embed: the bare string
// "childReady" and { type: "beehiiv:child-loaded", payload: { src: ... } }
// (fired repeatedly as the iframe resizes) — neither means a submission.
// IMPORTANT: only inspect the `type` field, never the whole stringified
// payload — the child-loaded payload's `src` field contains the literal
// substring "subscribe-forms.beehiiv.com", which would false-match a naive
// "subscribe" search on every routine load/resize ping.
// There's no public spec for the real submit event's type, so this matches
// broadly on common success/subscribe wording. If it doesn't fire on an
// actual test subscribe, capture the real event.data via devtools and
// tighten this match to it.
window.addEventListener('message', (event) => {
  if (!/beehiiv/i.test(event.origin)) return;
  let payload = event.data;
  if (typeof payload === 'string') {
    try { payload = JSON.parse(payload); } catch (err) { /* keep as string */ }
  }
  const type = typeof payload === 'string' ? payload : (payload && payload.type) || '';
  if (/child-?ready|child-?loaded|resize|height/i.test(type)) return;
  if (/subscribe|success|submit/i.test(type)) {
    document.getElementById('links').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// beehiiv's loader.js builds the form iframe itself, so we don't control
// that URL directly. If a visitor's browser has an old cached copy of it
// (e.g. right after editing the form in beehiiv), force a fresh fetch by
// tagging the iframe src with a cache-busting param the moment it appears.
// This only clears a visitor's own browser cache — if the form still looks
// outdated after this, beehiiv's own CDN is serving a stale version and
// needs to catch up on their end (check for a publish/save step there).
const joinCard = document.querySelector('.join-card');
if (joinCard) {
  // Poll rather than use a MutationObserver: beehiiv's loader sets the
  // iframe's src sometime after inserting it, so a childList/attribute
  // observer can miss the final URL depending on load timing.
  let attempts = 0;
  const tryBust = () => {
    const iframe = joinCard.querySelector('iframe');
    if (iframe && iframe.src && /beehiiv/i.test(iframe.src)) {
      try {
        const url = new URL(iframe.src);
        url.searchParams.set('cb', Date.now());
        iframe.src = url.toString();
      } catch (err) { /* malformed URL, leave it alone */ }
      return;
    }
    attempts += 1;
    if (attempts < 40) setTimeout(tryBust, 250);
  };
  tryBust();
}
