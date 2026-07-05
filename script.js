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
      backToTop.style.display = scrollTop > 480 ? 'grid' : 'none';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => navLinks.classList.remove('open')));
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
      modalImage.src = image;
      modalTitle.textContent = title;
      modalText.textContent = text;
      modal.classList.add('open');
    });
  });

  document.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.remove('open');
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});
