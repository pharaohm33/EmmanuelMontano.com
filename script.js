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

// "What do you need help with" -> highlight choice + scroll to embed.
// If your beehiiv form is built with a matching Poll Question, you can also
// deep-link a pre-selected answer via the iframe src's query string per beehiiv's docs.
const optionButtons = document.querySelectorAll('.option-btn');
const embedWrap = document.getElementById('beehiiv-embed');

optionButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    optionButtons.forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    embedWrap.dataset.topic = btn.dataset.topic;
    embedWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
