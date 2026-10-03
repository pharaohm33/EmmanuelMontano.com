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

// Auto-scroll to the text-me CTA shortly after landing, unless the
// visitor has already started scrolling/interacting on their own.
let userInteracted = false;
const markInteracted = () => { userInteracted = true; };
['wheel', 'touchstart', 'keydown'].forEach((evt) =>
  window.addEventListener(evt, markInteracted, { once: true, passive: true })
);

setTimeout(() => {
  if (!userInteracted) {
    document.getElementById('text-me').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}, 2000);

// The phone number never appears in the page source: it's stored XOR-encoded
// in data-p (on the big CTA button and the bottom "Contact Me" row) and only
// decoded when someone taps one. This keeps it away from simple HTML
// scrapers; it is obfuscation, not real secrecy, since anything a browser can
// decode a JS-running bot could too.
const KEY = 'montano';
const decode = (hex) => {
  let out = '';
  for (let i = 0; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ KEY.charCodeAt((i / 2) % KEY.length));
  }
  return out;
};

document.querySelectorAll('[data-p]').forEach((el) => {
  el.addEventListener('click', (event) => {
    event.preventDefault();
    const num = decode(el.dataset.p);
    const digits = num.replace(/\D/g, '').slice(-10);
    const pretty = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    // Show the number too: sms: links do nothing on many desktops.
    const label = el.querySelector('.textme-btn-label, .link-title');
    if (label) label.textContent = `Text ${pretty}`;
    window.location.href = `sms:${num}`;
  });
});
