document.addEventListener("DOMContentLoaded", () => {
  // 1. PAGE LOADER INITIALIZATION
  window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.classList.add("hidden");
    }
    document.body.classList.remove("loading");
    
    // Fire initial entry animations on page load complete
    initializePageRevealAnimations();
  });

  // Fallback to clear page load blocks
  setTimeout(() => {
    const loader = document.querySelector(".loader");
    if (loader && !loader.classList.contains("hidden")) {
      loader.classList.add("hidden");
      document.body.classList.remove("loading");
      initializePageRevealAnimations();
    }
  }, 2000);

  // 2. ACTIVE SCROLL PROGRESS TRACKER
  window.addEventListener("scroll", () => {
    const progressBar = document.querySelector(".scroll-progress");
    if (progressBar) {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledRatio = (window.scrollY / scrollHeight) * 100;
      progressBar.style.width = `${scrolledRatio}%`;
    }

    // Header scrolled transition setup
    const siteHeader = document.querySelector(".site-header");
    if (siteHeader) {
      if (window.scrollY > 40) {
        siteHeader.classList.add("scrolled");
      } else {
        siteHeader.classList.remove("scrolled");
      }
    }
  });

  // 3. RESPONSIVE MOBILE MENU
  const navMenuToggle = document.querySelector(".nav-toggle");
  const navLinksMenu = document.querySelector(".nav-links");
  if (navMenuToggle && navLinksMenu) {
    navMenuToggle.addEventListener("click", () => {
      navLinksMenu.classList.toggle("open");
      navMenuToggle.textContent = navLinksMenu.classList.contains("open") ? "✕" : "☰";
    });

    // Close options on link clicks
    navLinksMenu.querySelectorAll("a").forEach(option => {
      option.addEventListener("click", () => {
        navLinksMenu.classList.remove("open");
        navMenuToggle.textContent = "☰";
      });
    });
  }

  // 4. CUSTOM MOUSE FOLLOWER
  const cursorDot = document.querySelector(".custom-cursor-dot");
  const cursorRing = document.querySelector(".custom-cursor-ring");

  if (cursorDot && cursorRing && window.innerWidth > 768) {
    document.addEventListener("mousemove", (event) => {
      gsap.to(cursorDot, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.05,
        ease: "power2.out"
      });
      
      gsap.to(cursorRing, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.25,
        ease: "power2.out"
      });
    });

    // Cursor scaling states
    const interactiveSelectors = "a, button, .filter-btn, .accordion-trigger-button, .swiper-button-prev-custom, .swiper-button-next-custom";
    document.querySelectorAll(interactiveSelectors).forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursorRing.classList.add("hovered");
      });
      element.addEventListener("mouseleave", () => {
        cursorRing.classList.remove("hovered");
      });
    });
  }

  // 5. MAGNETIC BUTTON SYSTEM
  const magneticElements = document.querySelectorAll(".magnetic-element");
  if (magneticElements.length > 0 && window.innerWidth > 768) {
    magneticElements.forEach(elem => {
      elem.addEventListener("mousemove", (event) => {
        const boundary = elem.getBoundingClientRect();
        const offsetX = event.clientX - boundary.left - (boundary.width / 2);
        const offsetY = event.clientY - boundary.top - (boundary.height / 2);

        gsap.to(elem, {
          x: offsetX * 0.35,
          y: offsetY * 0.35,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      elem.addEventListener("mouseleave", () => {
        gsap.to(elem, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1.1, 0.4)"
        });
      });
    });
  }

  // 6. SWIPER.JS IMPLEMENTATIONS
  if (typeof Swiper !== "undefined") {
    // 1. Services Swiper Slider
    const servicesSwiper = new Swiper(".services-swiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      slidesPerGroup: 1,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination-custom",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next-custom",
        prevEl: ".swiper-button-prev-custom",
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 3,
          slidesPerGroup: 1,
        }
      }
    });

    // 2. Testimonials Swiper Carousel
    const testimonialsSwiper = new Swiper(".testimonials-swiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination-testimonials",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });
  }

  // 7. COUNTER NUMBERS PROGRESSION SPRINT
  const initiateCounterAnimations = () => {
    const counterElements = document.querySelectorAll(".counter-num");
    counterElements.forEach(counter => {
      const targetVal = parseInt(counter.getAttribute("data-val"), 10);
      const animationObj = { value: 0 };

      gsap.to(animationObj, {
        value: targetVal,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: counter,
          start: "top 85%"
        },
        onUpdate: () => {
          counter.textContent = Math.floor(animationObj.value);
        }
      });
    });
  };

  // 8. ASYMMETRICAL PORTFOLIO FILTER SYSTEM
  const portfolioGridCards = document.querySelectorAll(".portfolio-show-card");
  const portfolioFilterButtons = document.querySelectorAll(".filter-btn");

  portfolioFilterButtons.forEach(button => {
    button.addEventListener("click", () => {
      portfolioFilterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const selectedValue = button.getAttribute("data-filter");

      portfolioGridCards.forEach(card => {
        const itemCategory = card.getAttribute("data-category");

        if (selectedValue === "all" || itemCategory === selectedValue) {
          card.style.display = "block";
          gsap.fromTo(card, 
            { opacity: 0, scale: 0.94, y: 15 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" }
          );
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // 9. PORTFOLIO LIGHTBOX MODAL
  const lightboxModal = document.getElementById("portfolioLightbox");
  const closeLightboxBtn = document.getElementById("closeLightbox");
  const lightboxImage = document.getElementById("lightboxMainImage");
  const lightboxMeta = document.getElementById("lightboxMetaTag");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDesc = document.getElementById("lightboxDescription");

  if (lightboxModal && closeLightboxBtn) {
    portfolioGridCards.forEach(card => {
      card.addEventListener("click", () => {
        const imageSrc = card.getAttribute("data-img");
        const categoryText = card.querySelector(".meta-tag").textContent;
        const titleText = card.querySelector("h3").textContent;
        const descriptionText = card.querySelector("p").textContent;

        lightboxImage.setAttribute("src", imageSrc);
        lightboxImage.setAttribute("alt", titleText);
        lightboxMeta.textContent = categoryText;
        lightboxTitle.textContent = titleText;
        lightboxDesc.textContent = descriptionText;

        lightboxModal.classList.add("active");
        lightboxModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Block page scroll when modal is active
      });
    });

    const closeLightboxSequence = () => {
      lightboxModal.classList.remove("active");
      lightboxModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // Restore scrolling behavior
    };

    closeLightboxBtn.addEventListener("click", closeLightboxSequence);
    lightboxModal.querySelector(".lightbox-overlay-bg").addEventListener("click", closeLightboxSequence);

    // Escape Key bind closes modal
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightboxModal.classList.contains("active")) {
        closeLightboxSequence();
      }
    });
  }

  // 10. TIMELINE ACTIVE PATH PROGRESSION
  const updateTimelineScrollFill = () => {
    const timelineContainer = document.querySelector(".timeline-interactive-container");
    const timelineFillLine = document.querySelector(".timeline-scroll-fill");
    const timelineSteps = document.querySelectorAll(".timeline-node-item");

    if (timelineContainer && timelineFillLine) {
      const containerRect = timelineContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate path height parameters based on trigger elements
      const progressTriggerPoint = viewportHeight / 2;
      const scrollInContainer = progressTriggerPoint - containerRect.top;
      const maxScrollHeight = containerRect.height;

      let progressPercentage = (scrollInContainer / maxScrollHeight) * 100;
      progressPercentage = Math.max(0, Math.min(100, progressPercentage));

      timelineFillLine.style.height = `${progressPercentage}%`;

      // Illuminate step metrics as trigger limits clear
      timelineSteps.forEach(step => {
        const stepBound = step.getBoundingClientRect();
        if (stepBound.top < progressTriggerPoint) {
          step.classList.add("active-step");
        } else {
          step.classList.remove("active-step");
        }
      });
    }
  };

  window.addEventListener("scroll", updateTimelineScrollFill);

  // 11. ACCORDION DETAILED TOGGLE SPRINT
  const faqAccordionItems = document.querySelectorAll(".accordion-luxury-item");
  faqAccordionItems.forEach(item => {
    const trigger = item.querySelector(".accordion-trigger-button");
    const collapsible = item.querySelector(".accordion-collapsible-wrapper");

    if (trigger && collapsible) {
      trigger.addEventListener("click", () => {
        const activeState = item.classList.contains("active");

        // Collapse open elements
        faqAccordionItems.forEach(faqItem => {
          faqItem.classList.remove("active");
          faqItem.querySelector(".accordion-trigger-button").setAttribute("aria-expanded", "false");
          faqItem.querySelector(".accordion-collapsible-wrapper").style.maxHeight = null;
        });

        if (!activeState) {
          item.classList.add("active");
          trigger.setAttribute("aria-expanded", "true");
          collapsible.style.maxHeight = collapsible.scrollHeight + "px";
        }
      });
    }
  });

  // 12. BACK TO TOP BUTTON
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 13. GSAP TRIGGER INTERSECTION REVEALS
  const initializePageRevealAnimations = () => {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // Hero content reveals
      gsap.from(".hero__content .hero__word", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power4.out"
      });

      gsap.from(".hero__description", {
        opacity: 0,
        y: 20,
        duration: 1.2,
        delay: 0.2,
        ease: "power4.out"
      });

      gsap.from(".hero__actions", {
        opacity: 0,
        y: 20,
        duration: 1.2,
        delay: 0.4,
        ease: "power4.out"
      });

      // Lazy scroll fade up reveals
      const fadeElements = document.querySelectorAll(".fade-up");
      fadeElements.forEach(elem => {
        gsap.from(elem, {
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out"
        });
      });

      // Counters initializations trigger
      initiateCounterAnimations();
    }
  };
});