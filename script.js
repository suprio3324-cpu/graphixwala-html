const loader = document.querySelector('.loader');
const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.getElementById('backToTop');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-count]');
const faqItems = document.querySelectorAll('.faq-item');
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const modal = document.getElementById('portfolioModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const header = document.querySelector('.site-header');
const heroCopy = document.querySelector('.hero-copy');
const heroTitleLines = document.querySelectorAll('.hero h1 span');
const heroButtons = document.querySelectorAll('.hero .hero-action a');
const heroCard = document.querySelector('.hero-card');
const heroImage = heroCard ? heroCard.querySelector('img') : null;
const heroStats = document.querySelectorAll('.hero-card .stat');
const heroIndicator = document.querySelector('.scroll-indicator');

if (loader) {
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 650);
    document.body.classList.remove('loading');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('loading');

  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (scrollTop / height) * 100 : 0;
      progressBar.style.width = `${progress}%`;
      if (backToTop) {
        backToTop.style.display = scrollTop > 480 ? 'grid' : 'none';
      }
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('counter')) {
          const target = Number(entry.target.dataset.count || 0);
          let current = 0;
          const duration = 1200;
          const startTime = performance.now();
          const step = (timestamp) => {
            const progress = Math.min((timestamp - startTime) / duration, 1);
            current = Math.floor(progress * target);
            entry.target.textContent = `${current}${entry.target.dataset.suffix || ''}`;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach((item) => observer.observe(item));
  counters.forEach((counter) => observer.observe(counter));

  if (!prefersReducedMotion && window.gsap) {
    const heroElements = [
      document.querySelector('.hero .eyebrow'),
      ...heroTitleLines,
      document.querySelector('.hero p'),
      ...heroButtons,
      heroIndicator,
      heroCard,
      ...heroStats,
    ].filter(Boolean);

    window.gsap.set(heroElements, { opacity: 0, y: 24, scale: 0.98 });
    window.gsap.set(heroCopy, { opacity: 0, y: 24 });
    window.gsap.set(heroImage, { y: 10, opacity: 0 });

    const heroTimeline = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
      .from(header || [], { y: -70, opacity: 0, duration: 0.8 })
      .from(document.querySelector('.hero .eyebrow'), { y: 20, opacity: 0, duration: 0.5 }, '-=0.55')
      .from(heroTitleLines, { y: 40, opacity: 0, stagger: 0.12, duration: 0.7 }, '-=0.35')
      .from(document.querySelector('.hero p'), { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
      .from(heroButtons, { scale: 0.92, opacity: 0, stagger: 0.12, duration: 0.5 }, '-=0.35')
      .from(heroIndicator, { y: 16, opacity: 0, duration: 0.45 }, '-=0.25')
      .from(heroCard, { y: 34, opacity: 0, scale: 0.97, duration: 0.8 }, '-=0.45')
      .from(heroStats, { y: 18, opacity: 0, stagger: 0.08, duration: 0.45 }, '-=0.35');

    if (heroImage) {
      window.gsap.to(heroImage, { y: -10, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    heroButtons.forEach((button, index) => {
      window.gsap.to(button, { scale: 1.02, duration: 1.2 + index * 0.08, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeaderVisibility = () => {
      if (!header) {
        ticking = false;
        return;
      }
      if (window.scrollY > 90 && window.scrollY > lastScrollY) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }
      lastScrollY = window.scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderVisibility);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeaderVisibility();

    document.querySelectorAll('.section .reveal').forEach((item) => {
      window.gsap.fromTo(item, { opacity: 0, y: 24 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          once: true,
          toggleClass: 'visible',
        },
      });
    });
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  faqItems.forEach((item) => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach((faq) => faq.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter || 'all';
      portfolioCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? 'block' : 'none';
      });
    });
  });

  portfolioCards.forEach((card) => {
    card.addEventListener('click', () => {
      const image = card.querySelector('img').src;
      const title = card.querySelector('h3').textContent;
      const text = card.querySelector('p').textContent;
      if (modalImage) modalImage.src = image;
      if (modalTitle) modalTitle.textContent = title;
      if (modalText) modalText.textContent = text;
      if (modal) modal.classList.add('open');
    });
  });

  if (document.querySelector('.modal-close') && modal) {
    document.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.classList.remove('open');
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});
