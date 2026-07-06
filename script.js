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
const heroSection = document.getElementById('hero');
const heroWords = document.querySelectorAll('.hero__word');
const heroDescription = document.querySelector('.hero__description');
const heroActions = document.querySelector('.hero__actions');
const heroRating = document.querySelector('.hero__rating');
const heroVisual = document.querySelector('.hero__visual-card');
const heroImage = heroVisual ? heroVisual.querySelector('img') : null;
const parallelVisual = document.querySelector('[data-parallax]');
const marquee = document.querySelector('[data-marquee]');

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
    window.gsap.set(heroWords, { y: 24, opacity: 0 });
    window.gsap.set([heroDescription, heroActions, heroRating, heroVisual], { y: 24, opacity: 0 });

    const heroTimeline = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
      .from(header || [], { y: -60, opacity: 0, duration: 0.7 })
      .to(heroWords, { y: 0, opacity: 1, duration: 0.75, stagger: 0.12 }, '-=0.45')
      .to(heroDescription, { y: 0, opacity: 1, duration: 0.65 }, '-=0.35')
      .to(heroActions, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .to(heroRating, { y: 0, opacity: 1, duration: 0.55 }, '-=0.25')
      .to(heroVisual, { y: 0, opacity: 1, duration: 0.8, scale: 1 }, '-=0.2');

    if (heroImage) {
      window.gsap.to(heroImage, { y: -10, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    if (parallelVisual && heroSection) {
      const resetParallax = () => {
        window.gsap.to(parallelVisual, { x: 0, y: 0, rotateY: 0, rotateX: 0, duration: 0.75, ease: 'power2.out' });
      };

      heroSection.addEventListener('mousemove', (event) => {
        const bounds = heroSection.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        window.gsap.to(parallelVisual, { x: x * 10, y: y * 10, duration: 0.8, ease: 'power2.out' });
      });

      heroSection.addEventListener('mouseleave', resetParallax);
    }

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

    window.gsap.utils.toArray('.reveal').forEach((item) => {
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

    // No marquee: trusted brands are static in the reference layout
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
/* ==========================================================
   GRAPHIX WALA HERO PREMIUM ANIMATION
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (!window.gsap) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero__badge",{
        y:30,
        opacity:0,
        duration:.8,
        ease:"power3.out"
    });

    gsap.from(".hero__title .hero__word",{
        y:80,
        opacity:0,
        stagger:.12,
        duration:1,
        ease:"power4.out",
        delay:.2
    });

    gsap.from(".hero__underline",{
        width:0,
        duration:.8,
        delay:.8
    });

    gsap.from(".hero__description",{
        y:30,
        opacity:0,
        duration:.8,
        delay:1
    });

    gsap.from(".hero__actions",{
        y:30,
        opacity:0,
        duration:.8,
        delay:1.2
    });

    gsap.from(".hero__rating",{
        y:30,
        opacity:0,
        duration:.8,
        delay:1.4
    });

    gsap.from(".hero__visual-card",{
        x:80,
        opacity:0,
        scale:.95,
        duration:1.2,
        ease:"power4.out",
        delay:.3
    });

    gsap.to(".hero__image-shell img",{
        y:-15,
        repeat:-1,
        yoyo:true,
        duration:3,
        ease:"sine.inOut"
    });

});

const hero=document.querySelector(".hero");

const visual=document.querySelector(".hero__visual-card");

if(hero && visual){

hero.addEventListener("mousemove",(e)=>{

const rect=hero.getBoundingClientRect();

const x=(e.clientX-rect.left)/rect.width-.5;

const y=(e.clientY-rect.top)/rect.height-.5;

gsap.to(visual,{

  x: x*15,
  y: y*15,
  duration: .8,
  ease: "power3.out"

});

});

hero.addEventListener("mouseleave",()=>{

gsap.to(visual,{

  x:0,
  y:0,
  duration:.8

});

});

}


/* ==========================================
Trusted Brands Animation
========================================== */

gsap.from(".trusted-brands__card",{

opacity:0,

y:40,

stagger:.08,

duration:.8,

scrollTrigger:{

trigger:".trusted-brands",

start:"top 80%"

}

});