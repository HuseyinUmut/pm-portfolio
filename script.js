/* ── Scroll Progress Bar ── */
const progressBar = document.createElement('div');
Object.assign(progressBar.style, {
  position: 'fixed', top: 0, left: 0, height: '3px', width: '0%',
  background: 'linear-gradient(90deg, #7c5cff, #c084fc)',
  zIndex: '9999', transition: 'width 0.1s linear',
  boxShadow: '0 0 8px rgba(124,92,255,0.7)'
});
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrolled / total) * 100}%`;
});

/* ── Header Scroll ── */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Active Nav Link Highlight ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('#main-nav .nav-link');

const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`#main-nav a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observerNav.observe(s));

/* ── Mobile Burger ── */
const burger = document.getElementById('burger-btn');
const drawer = document.getElementById('mobile-drawer');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  drawer.classList.toggle('open');
});

drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    drawer.classList.remove('open');
  });
});

/* ── Scroll Reveal ── */
const reveals = document.querySelectorAll('.reveal');
const observerReveal = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const delay = siblings.indexOf(entry.target) * 120;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observerReveal.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observerReveal.observe(el));

/* ── Skill Bar Animation ── */
const skillFills = document.querySelectorAll('.skill-bar-fill');
const observerBars = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      observerBars.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(el => observerBars.observe(el));

/* ── Portfolio Filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ── Contact Form ── */
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');
const submitBtn = document.getElementById('contact-submit-btn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';

  setTimeout(() => {
    success.classList.add('show');
    form.reset();
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1200);
});

/* ── Smooth Anchor Offset (for fixed header) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ── Typewriter hero title ── */
const italicSpan = document.querySelector('.title-line.italic');
if (italicSpan) {
  const text = italicSpan.textContent;
  italicSpan.textContent = '';
  italicSpan.style.borderRight = '2px solid #c084fc';
  let i = 0;
  const type = () => {
    if (i <= text.length) {
      italicSpan.textContent = text.slice(0, i++);
      setTimeout(type, 80);
    } else {
      setTimeout(() => {
        italicSpan.style.borderRight = 'none';
      }, 800);
    }
  };
  setTimeout(type, 800);
}

/* ── Cursor Glow (desktop) ── */
if (window.innerWidth > 860) {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed',
    width: '300px', height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,92,255,0.08), transparent 70%)',
    pointerEvents: 'none',
    zIndex: '9998',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s'
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}
