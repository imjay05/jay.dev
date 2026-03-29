// Theme Toggle
const html = document.documentElement;
html.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');
document.getElementById('themeToggle').addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Reveal animations — content visible by default; js-anim enables fade-in only if IntersectionObserver works
window.addEventListener('DOMContentLoaded', () => {
  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-anim');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) cur = s.id;
  });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}, { passive: true });

// Toast notification
function showToast(msg, ok = true) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + (ok ? 'ok' : 'err');
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => t.classList.remove('show'), 4200);
}

// Contact form submission
async function sendMsg() {
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const msg     = document.getElementById('fmessage').value.trim();

  if (!name || !email || !msg) {
    showToast('Please fill in all required fields.', false);
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', false);
    return;
  }

  const btn = document.getElementById('sendBtn');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const res = await fetch('https://formspree.io/f/mgopaojp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, email, subject, message: msg })
    });
    if (res.ok) {
      showToast("Message sent! I'll reply soon.");
      ['fname', 'femail', 'fsubject', 'fmessage'].forEach(id => {
        document.getElementById(id).value = '';
      });
    } else {
      showToast('Something went wrong. Email me directly.', false);
    }
  } catch (e) {
    showToast('Network error. Try emailing directly.', false);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Send Message`;
  }
}