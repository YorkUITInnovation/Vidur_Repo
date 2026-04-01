/* =============================================================
   York University IT Innovation Team — main.js
   Features:
   - Mobile navigation toggle
   - Smooth scroll for anchor links
   - Scroll-reveal animations (IntersectionObserver)
   - Animated counter for stats
   - Project filtering
   - Contact form validation
   - Dynamic footer year
   ============================================================= */

(function () {
  "use strict";

  /* ----------------------------------------------------------
     Utility: debounce
  ---------------------------------------------------------- */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /* ----------------------------------------------------------
     1. Mobile Navigation Toggle
  ---------------------------------------------------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when a nav link is clicked
    navMenu.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu on outside click
    document.addEventListener("click", function (e) {
      if (
        navMenu.classList.contains("open") &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ----------------------------------------------------------
     2. Smooth Scroll (fallback for browsers without CSS support)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-height"
          )
        ) || 70;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ----------------------------------------------------------
     3. Scroll-Reveal Animation (IntersectionObserver)
  ---------------------------------------------------------- */
  var STAGGER_DELAY = 0.08; // seconds between sibling card reveals

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      // Stagger cards within the same grid parent
      const siblings = Array.from(el.parentElement.querySelectorAll(".reveal"));
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = idx * STAGGER_DELAY + "s";
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all immediately
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ----------------------------------------------------------
     4. Animated Counters (Stats Banner)
  ---------------------------------------------------------- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const duration = 1600; // ms
    const intervalTime = 20; // ms per tick — fixed interval for smooth animation
    const totalTicks = duration / intervalTime;
    const increment = target / totalTicks;
    let current = 0;

    const timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, intervalTime);
  }

  if ("IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll("[data-target]");
            counters.forEach(animateCounter);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    const statsBanner = document.querySelector(".stats-banner");
    if (statsBanner) statsObserver.observe(statsBanner);
  }

  /* ----------------------------------------------------------
     5. Project Filtering
  ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Update active button state
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      this.classList.add("active");
      this.setAttribute("aria-selected", "true");

      const filter = this.getAttribute("data-filter");

      projectCards.forEach(function (card) {
        const category = card.getAttribute("data-category");
        const show = filter === "all" || category === filter;

        if (show) {
          card.style.display = "";
          // Re-trigger reveal animation
          card.classList.remove("visible");
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              card.classList.add("visible");
            });
          });
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* ----------------------------------------------------------
     6. Contact Form Validation
  ---------------------------------------------------------- */
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    function showError(fieldId, message) {
      const field = document.getElementById(fieldId);
      const error = document.getElementById(fieldId + "-error");
      if (field) field.classList.add("invalid");
      if (error) error.textContent = message;
    }

    function clearError(fieldId) {
      const field = document.getElementById(fieldId);
      const error = document.getElementById(fieldId + "-error");
      if (field) field.classList.remove("invalid");
      if (error) error.textContent = "";
    }

    function validateEmail(email) {
      // RFC 5322-inspired pattern covering common valid email formats
      return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email);
    }

    // Live validation on blur
    ["name", "email", "message"].forEach(function (id) {
      const field = document.getElementById(id);
      if (!field) return;
      field.addEventListener("blur", function () {
        validateField(id);
      });
      field.addEventListener("input", function () {
        if (field.classList.contains("invalid")) validateField(id);
      });
    });

    function validateField(id) {
      const field = document.getElementById(id);
      if (!field) return true;
      const value = field.value.trim();

      if (id === "name") {
        if (!value) {
          showError("name", "Please enter your full name.");
          return false;
        }
        if (value.length < 2) {
          showError("name", "Name must be at least 2 characters.");
          return false;
        }
      }

      if (id === "email") {
        if (!value) {
          showError("email", "Please enter your email address.");
          return false;
        }
        if (!validateEmail(value)) {
          showError("email", "Please enter a valid email address.");
          return false;
        }
      }

      if (id === "message") {
        if (!value) {
          showError("message", "Please enter a message.");
          return false;
        }
        if (value.length < 10) {
          showError("message", "Message must be at least 10 characters.");
          return false;
        }
      }

      clearError(id);
      return true;
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const successEl = document.getElementById("form-success");
      if (successEl) successEl.textContent = "";

      const nameValid = validateField("name");
      const emailValid = validateField("email");
      const messageValid = validateField("message");

      if (!nameValid || !emailValid || !messageValid) return;

      // Simulate successful submission
      const submitBtn = contactForm.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      }

      setTimeout(function () {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i> Send Message';
        }
        if (successEl) {
          successEl.textContent =
            "✓ Thank you! Your message has been sent. We'll be in touch soon.";
        }
        // Clear success message after 6 seconds
        setTimeout(function () {
          if (successEl) successEl.textContent = "";
        }, 6000);
      }, 1200);
    });
  }

  /* ----------------------------------------------------------
     7. Dynamic Footer Year
  ---------------------------------------------------------- */
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     8. Active nav link highlight on scroll
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");

  function updateActiveLink() {
    const navHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--nav-height"
        )
      ) || 70;
    let current = "";

    sections.forEach(function (section) {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= navHeight + 60) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("active-section");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active-section");
      }
    });
  }

  window.addEventListener("scroll", debounce(updateActiveLink, 50), {
    passive: true,
  });
  updateActiveLink();
})();
