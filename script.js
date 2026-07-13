// ==========================================================================
// LENIS SMOOTH SCROLL INITIALIZATION (সুরক্ষিত ও বাগমুক্ত সেটআপ)
// ==========================================================================
const lenis = new Lenis({
  duration: 1.6, // স্ক্রল অ্যানিমেশনের সময় বাড়ানো হয়েছে (আগের মান ১.২)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false, 
  touchMultiplier: 2,
});

// GSAP এবং ScrollTrigger পেজে লোড হয়েছে কি না তা চেক করে সিঙ্ক করা (যাতে অন্য পেজে ক্র্যাশ না করে)
if (typeof gsap !== "undefined") {
  if (typeof ScrollTrigger !== "undefined") {
    lenis.on('scroll', ScrollTrigger.update);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
} else {
  // পেজে GSAP না থাকলে সাধারণ ব্রাউজার রেন্ডার ফ্রেম দিয়ে লেনিস স্মুথ স্ক্রল চালানো
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}
// ==========================================================================

// SAFE AND ROBUST DOM READY ENGINE (Stuck Loader & Counter Fix)
const runWebsiteEngine = () => {
  
  // 1. PAGE LOADER INITIALIZATION (Clear preloader safely)
  const clearPreloader = () => {
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.classList.add("hidden");
    }
    document.body.classList.remove("loading");
    
    // Fire entry GSAP animations on page load
    initializePageRevealAnimations();
  };

  // Check if window is already loaded (Prevent racing conditions)
  if (document.readyState === "complete") {
    clearPreloader();
  } else {
    window.addEventListener("load", clearPreloader);
  }

  // Reliable Fallback: Maximum 2 seconds wait time under any condition
  setTimeout(() => {
    const loader = document.querySelector(".loader");
    if (loader && !loader.classList.contains("hidden")) {
      clearPreloader();
    }
  }, 2000);

  // 2. ACTIVE SCROLL PROGRESS TRACKER & TIME CONNECTOR
  window.addEventListener("scroll", () => {
    const progressBar = document.querySelector(".scroll-progress");
    if (progressBar) {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledRatio = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      progressBar.style.width = `${scrolledRatio}%`;
    }

    // Creative Journey Timeline line tracker filling logic
    const timelineFill = document.querySelector(".timeline-center-fill");
    const timelineContainer = document.querySelector(".journey-vertical-timeline");
    if (timelineFill && timelineContainer) {
      const rect = timelineContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.7;
      const progressInContainer = triggerPoint - rect.top;
      
      if (rect.height > 0) {
        let percentage = (progressInContainer / rect.height) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        timelineFill.style.height = `${percentage}%`;
      }

      // Activate alternating index nodes (Clean CSS State Control)
      const nodeCircles = document.querySelectorAll(".timeline-node-circle");
      nodeCircles.forEach(circle => {
        const circleRect = circle.getBoundingClientRect();
        if (circleRect.top < triggerPoint) {
          circle.classList.add("active-node");
        } else {
          circle.classList.remove("active-node");
        }
      });
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
    navLinksMenu.id = navLinksMenu.id || "primary-navigation";
    navMenuToggle.setAttribute("aria-controls", navLinksMenu.id);
    navMenuToggle.setAttribute("aria-expanded", "false");
    navMenuToggle.innerHTML = "&#9776;";

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
    const syncMobileMenu = () => {
      const isOpen = navLinksMenu.classList.contains("open");
      navMenuToggle.setAttribute("aria-expanded", String(isOpen));
      navMenuToggle.innerHTML = isOpen ? "&times;" : "&#9776;";
      document.body.classList.toggle("nav-open", isOpen);
    };

    navMenuToggle.addEventListener("click", syncMobileMenu);
    navLinksMenu.querySelectorAll("a").forEach(option => option.addEventListener("click", syncMobileMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinksMenu.classList.contains("open")) {
        navLinksMenu.classList.remove("open");
        syncMobileMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (navLinksMenu.classList.contains("open") && !navLinksMenu.contains(event.target) && !navMenuToggle.contains(event.target)) {
        navLinksMenu.classList.remove("open");
        syncMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && navLinksMenu.classList.contains("open")) {
        navLinksMenu.classList.remove("open");
        syncMobileMenu();
      }
    });
  }

  // 4. CUSTOM MOUSE FOLLOWER (GSAP সেফটি গার্ড যুক্ত করা হয়েছে)
  const cursorDot = document.querySelector(".custom-cursor-dot");
  const cursorRing = document.querySelector(".custom-cursor-ring");

  if (cursorDot && cursorRing && window.innerWidth > 768 && typeof gsap !== "undefined") {
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
    const interactiveSelectors = "a, button, .filter-btn, .accordion-trigger-button, .nav-avatar-btn";
    document.querySelectorAll(interactiveSelectors).forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursorRing.classList.add("hovered");
        gsap.to(cursorDot, {
          scale: 0.55,
          opacity: 0.65,
          duration: 0.2,
          ease: "power2.out"
        });
      });
      element.addEventListener("mouseleave", () => {
        cursorRing.classList.remove("hovered");
        gsap.to(cursorDot, {
          scale: 1,
          opacity: 1,
          duration: 0.2,
          ease: "power2.out"
        });
      });
    });

    document.addEventListener("mousedown", (event) => {
      cursorRing.classList.add("pressed");

      const ripple = document.createElement("span");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      document.body.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });

    document.addEventListener("mouseup", () => {
      cursorRing.classList.remove("pressed");
    });
  }

  // 5. MAGNETIC BUTTON SYSTEM (GSAP সেফটি গার্ড যুক্ত করা হয়েছে)
  const magneticElements = document.querySelectorAll(".magnetic-element");
  if (magneticElements.length > 0 && window.innerWidth > 768 && typeof gsap !== "undefined") {
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

  // 6. GRAPHIX WALA 9 NEW core team members (Exact image paths config)
  const teamMembersData = [
    {
      name: "SUPRIO KARMAKAR",
      role: "Founder & Strategist",
      outline: "SUPRIO",
      desc: "Founder & Strategist leads the vision of Graphix Wala by combining creative innovation, business strategy, and digital marketing expertise to build impactful brands and drive sustainable growth.",
      cutout: "assets/team/Suprio-full.png",
      avatar: "assets/team/Suprio-avatar.png"
    },
    {
      name: "TANMOY SAHA",
      role: "Social Media Manager",
      outline: "TANMOY",
      desc: "Social Media Manager plans, creates, and manages engaging content across digital platforms, helping brands grow their online presence and build meaningful audience connections.",
      cutout: "assets/team/Tanmoy_Saha-full.png",
      avatar: "assets/team/Tanmoy_Saha-avatar.png"
    },
    {
      name: "KOUSHIK",
      role: "App Developer",
      outline: "KOUSHIK",
      desc: "App Developer designs and builds high-performance mobile applications, creating seamless, user-friendly experiences with modern technologies and innovative solutions.",
      cutout: "assets/team/Koushik-full.png",
      avatar: "assets/team/Koushik-avatar.png"
    },
    {
      name: "TANMOY",
      role: "UX/UI & Website Designer",
      outline: "TANMOY",
      desc: "UX/UI & Website Designer creates intuitive, visually engaging, and user-centered digital experiences, designing modern websites that blend creativity, functionality, and seamless usability.",
      cutout: "assets/team/Tanmoy-full.png",
      avatar: "assets/team/Tanmoy-avatar.png"
    },
    {
      name: "SHUVO DEBNATH",
      role: "Motion & Video Editor",
      outline: "SHUVO",
      desc: "Motion & Video Editor transforms ideas into captivating visual stories through dynamic motion graphics, cinematic video editing, and engaging content that strengthens brand identity.",
      cutout: "assets/team/Shuvo-full.png",
      avatar: "assets/team/Shuvo-avatar.png"
    },
    {
      name: "DIPTI",
      role: "SEO Expert",
      outline: "DIPTI",
      desc: "SEO Expert improves website visibility through strategic optimization, keyword research, and data-driven techniques to increase organic traffic and drive long-term business growth.",
      cutout: "assets/team/Dipti-full.png",
      avatar: "assets/team/Dipti-avatar.png"
    },
    {
      name: "URMILA SARKAR",
      role: "Business Coordinator",
      outline: "URMILA",
      desc: "Business Coordinator streamlines operations, manages client communication, and coordinates teams to ensure smooth project execution while fostering strong business relationships.",
      cutout: "assets/team/Urmila-full.png",
      avatar: "assets/team/Urmila-avatar.png"
    },
    {
      name: "DIBINDU",
      role: "Photographer",
      outline: "DIBINDU",
      desc: "Photographer captures compelling visuals that tell powerful stories, showcase brand identity, and create lasting impressions through professional photography.",
      cutout: "assets/team/Dibindu-full.png",
      avatar: "assets/team/Dibindu-avatar.png"
    },
    {
      name: "SUDIPTA SAHA",
      role: "Content Writer",
      outline: "SUDIPTA",
      desc: "Content Writer crafts engaging, SEO-friendly, and impactful content that strengthens brand communication and connects with the target audience.",
      cutout: "assets/team/Sudipta-full.png",
      avatar: "assets/team/Sudipta-avatar.png"
    }
  ];

  const teamNavButtons = document.querySelectorAll(".nav-avatar-btn");
  const activeOutlineText = document.getElementById("activeOutlineText");
  const sideRoleLabel = document.getElementById("sideRoleLabel");
  const activeLargeCutout = document.getElementById("activeLargeCutout");
  const activeCardAvatar = document.getElementById("activeCardAvatar");
  const activeMemberName = document.getElementById("activeMemberName");
  const activeMemberRole = document.getElementById("activeMemberRole");
  const activeMemberDesc = document.getElementById("activeMemberDesc");
  const widgetViewport = document.querySelector(".widget-viewport");

  if (teamNavButtons.length > 0 && activeLargeCutout && typeof gsap !== "undefined") {
    const handleMemberTransition = (index) => {
      const data = teamMembersData[index];

      // Safe clean previous GSAP animations
      gsap.killTweensOf([activeLargeCutout, activeOutlineText, activeCardAvatar, activeMemberName, activeMemberRole, activeMemberDesc]);

      const tl = gsap.timeline();

      // Fade out timeline swap
      tl.to([activeLargeCutout, activeCardAvatar], {
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          activeLargeCutout.setAttribute("src", data.cutout);
          activeLargeCutout.setAttribute("alt", data.name);
          activeCardAvatar.setAttribute("src", data.avatar);
          activeCardAvatar.setAttribute("alt", data.name);
        }
      });

      tl.to([activeOutlineText, activeMemberName, activeMemberRole, activeMemberDesc], {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: "power1.in",
        onComplete: () => {
          activeOutlineText.textContent = data.outline;
          sideRoleLabel.textContent = data.role;
          activeMemberName.textContent = data.name;
          activeMemberRole.textContent = data.role;
          activeMemberDesc.textContent = data.desc;
        }
      }, "<");

      // Slide and pop back in with modern 3D smoothness
      tl.to(activeLargeCutout, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power4.out"
      });

      tl.to([activeOutlineText, activeMemberName, activeMemberRole, activeMemberDesc], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      }, "-=0.45");

      tl.to(activeCardAvatar, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out"
      }, "-=0.45");
    };

    teamNavButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        teamNavButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const index = parseInt(btn.getAttribute("data-index"), 10);
        handleMemberTransition(index);
      });
    });

    if (widgetViewport) {
      widgetViewport.addEventListener("mouseenter", () => {
        activeLargeCutout.classList.add("hovered-portrait");
      });
      widgetViewport.addEventListener("mouseleave", () => {
        activeLargeCutout.classList.remove("hovered-portrait");
      });
    }
  }

  // 7. ASYMMETRICAL PORTFOLIO FILTER SYSTEM (GSAP সেফটি গার্ড যুক্ত করা হয়েছে)
  const portfolioGridCards = document.querySelectorAll(".portfolio-show-card");
  const portfolioFilterButtons = document.querySelectorAll(".portfolio-filters-row .filter-btn");

  if (portfolioFilterButtons.length > 0 && portfolioGridCards.length > 0) {
    portfolioFilterButtons.forEach(button => {
      button.addEventListener("click", () => {
        portfolioFilterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const selectedValue = button.getAttribute("data-filter");

        portfolioGridCards.forEach(card => {
          const itemCategory = card.getAttribute("data-category");

          if (selectedValue === "all" || itemCategory === selectedValue) {
            card.style.display = "block";
            if (typeof gsap !== "undefined") {
              gsap.fromTo(card, 
                { opacity: 0, scale: 0.94, y: 15 },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" }
              );
            }
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // 8. PORTFOLIO LIGHTBOX MODAL
  const lightboxModal = document.getElementById("portfolioLightbox");
  const closeLightboxBtn = document.getElementById("closeLightbox");
  const lightboxImage = document.getElementById("lightboxMainImage");
  const lightboxMeta = document.getElementById("lightboxMetaTag");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDesc = document.getElementById("lightboxDescription");

  if (lightboxModal && closeLightboxBtn && portfolioGridCards.length > 0) {
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
        document.body.style.overflow = "hidden";
      });
    });

    const closeLightboxSequence = () => {
      lightboxModal.classList.remove("active");
      lightboxModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    closeLightboxBtn.addEventListener("click", closeLightboxSequence);
    lightboxModal.querySelector(".lightbox-overlay-bg").addEventListener("click", closeLightboxSequence);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightboxModal.classList.contains("active")) {
        closeLightboxSequence();
      }
    });
  }

  // 9. ACCORDION DETAILED TOGGLE SPRINT
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

  // 10. BACK TO TOP BUTTON (Lenis Integration)
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
      // Lenis দিয়ে স্মুথ স্ক্রলিং এর মাধ্যমে একদম উপরে নিয়ে যাবে
      lenis.scrollTo(0, { duration: 1.2 });
    });
  }

  // 11. ANCHOR SMOOTH SCROLLS (শুধুমাত্র # হ্যাশ লিংক স্ক্রলিং সক্রিয় করে)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault(); // ব্রাউজারের সাধারণ লাফানো বন্ধ করবে, অন্য HTML পেজ নয়
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // লেনিস দিয়ে পারফেক্ট হেডার অফসেট (৮২px) বাদ দিয়ে স্ক্রল করাবে
        lenis.scrollTo(targetElement, {
          offset: -82,
          duration: 1.2,
          immediate: false
        });
      }
    });
  });

  // 12. GSAP TRIGGER INTERSECTION REVEALS (FULLY OPTIMIZED COUNTER-UP & SCROLL)
  const initiateCounterAnimations = () => {
    const counterElements = document.querySelectorAll(".counter-num");
    if (counterElements.length === 0) return;

    // ব্লক লেভেল প্যারেন্ট গ্রিডকে ট্রিগার হিসেবে সিলেক্ট করা হলো
    const triggerElement = document.querySelector(".timeline-stats-row") || document.querySelector(".creative-journey-container");

    counterElements.forEach(counter => {
      // সরাসরি এইচটিএমএল এডিট করা কন্টেন্ট থেকে টার্গেট নাম্বার রিড করা হচ্ছে
      const targetVal = parseInt(counter.textContent, 10);
      if (isNaN(targetVal)) return;

      // Fail-Safe Counter-up Mechanism (GSAP সেফটি গার্ড যুক্ত করা হয়েছে)
      if (typeof gsap !== "undefined") {
        gsap.fromTo(counter, 
          { textContent: 0 },
          {
            textContent: targetVal,
            duration: 2.5,
            ease: "power2.out",
            snap: { textContent: 1 }, // দশমিক ছাড়া পূর্ণ সংখ্যায় অ্যানিমেশন হবে
            scrollTrigger: {
              trigger: triggerElement,
              start: "top 95%", // কন্টেইনারটি স্ক্রিনে আসামাত্র কাউন্ট শুরু হবে
              toggleActions: "play none none none"
            }
          }
        );
      }
    });
  };

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
          y: 40,
          duration: 1,
          ease: "power3.out"
        });
      });

      // Special animation sequence for Alternating Journey Rows (Safe Smooth Load)
      gsap.from(".journey-row", {
        scrollTrigger: {
          trigger: ".journey-vertical-timeline",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out"
      });

      // Staggered reveal for Services Cards
      gsap.from(".premium-service-card", {
        scrollTrigger: {
          trigger: ".services-asymmetrical-grid",
          start: "top 85%"
        },
        opacity: 0,
        y: 35,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
      });

      // Staggered reveal for Pricing Cards
      gsap.from(".pricing-package-card", {
        scrollTrigger: {
          trigger: ".pricing-layouts-grid",
          start: "top 85%"
        },
        opacity: 0,
        y: 35,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
      });

      // Launch Counter-up
      initiateCounterAnimations();
      
      // Refresh ScrollTrigger to recalculate exact layout heights
      ScrollTrigger.refresh();
    }
  };
};

// INITIALIZE RUNNER SYSTEM (Guarantees execution)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runWebsiteEngine);
} else {
  runWebsiteEngine();
}