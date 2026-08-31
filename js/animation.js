document.addEventListener("DOMContentLoaded", () => {
  console.log("[Animations] Scroll animations initialized.");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /*
   * ──────────────────────────────────────
   * Intersection Observer
   * ──────────────────────────────────────
   */

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        // Animate only once.
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -50px 0px",
    }
  );


  /*
   * ──────────────────────────────────────
   * Helper
   * ──────────────────────────────────────
   */

  const reveal = (
    selector,
    animationClass = "reveal-up",
    stagger = false
  ) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element, index) => {
      element.classList.add(animationClass);

      if (stagger) {
        element.classList.add(
          `stagger-${Math.min(index + 1, 6)}`
        );
      }

      if (prefersReducedMotion) {
        element.classList.add("is-visible");
      } else {
        observer.observe(element);
      }
    });
  };


  /*
   * ──────────────────────────────────────
   * SECTION INTRODUCTIONS
   * ──────────────────────────────────────
   */

  reveal(
    ".problem .section-intro, .features .section-intro, .testimonials .section-intro, .howitworks .section-intro",
    "reveal-up"
  );


  /*
   * ──────────────────────────────────────
   * PROBLEM CARDS
   * ──────────────────────────────────────
   */

  reveal(
    ".problem-card",
    "reveal-up",
    true
  );


  /*
   * Problem conclusion
   */

  reveal(
    ".problem-arrow",
    "reveal-up"
  );


  /*
   * ──────────────────────────────────────
   * FEATURE ROWS
   * ──────────────────────────────────────
   */

  document.querySelectorAll(".feature-row").forEach((row) => {
    const text = row.querySelector(".feature-text");
    const visual = row.querySelector(".feature-visual");

    const reverse = row.classList.contains("reverse");

    if (text) {
      text.classList.add(
        reverse ? "reveal-right" : "reveal-left"
      );

      if (prefersReducedMotion) {
        text.classList.add("is-visible");
      } else {
        observer.observe(text);
      }
    }

    if (visual) {
      visual.classList.add(
        reverse ? "reveal-left" : "reveal-right"
      );

      visual.classList.add("stagger-2");

      if (prefersReducedMotion) {
        visual.classList.add("is-visible");
      } else {
        observer.observe(visual);
      }
    }
  });


  /*
   * ──────────────────────────────────────
   * OWNER DASHBOARD SECTION
   * ──────────────────────────────────────
   */

  document.querySelectorAll("section").forEach((section) => {
    const label = section.querySelector(".section-label");

    if (!label) return;

    if (
      label.textContent.trim().toLowerCase() !==
      "the owner view"
    ) {
      return;
    }

    /*
     * Intro content
     */
    const intro = section.children[0];

    if (intro) {
      intro.classList.add("reveal-up");

      if (prefersReducedMotion) {
        intro.classList.add("is-visible");
      } else {
        observer.observe(intro);
      }
    }

    /*
     * Dashboard image
     */
    const image = section.querySelector("img");

    if (image) {
      image.classList.add("reveal-scale");

      if (prefersReducedMotion) {
        image.classList.add("is-visible");
      } else {
        observer.observe(image);
      }
    }
  });


  /*
   * ──────────────────────────────────────
   * TESTIMONIALS
   * ──────────────────────────────────────
   */

  reveal(
    ".testimonial-card",
    "reveal-up",
    true
  );

  reveal(
    ".testimonials-clinic-badge",
    "reveal-up"
  );


  /*
   * ──────────────────────────────────────
   * HOW IT WORKS
   * ──────────────────────────────────────
   */

  reveal(
    ".step",
    "reveal-up",
    true
  );


  /*
   * ──────────────────────────────────────
   * CTA
   * ──────────────────────────────────────
   *
   * Animate the CTA itself as one unit.
   *
   * We deliberately do NOT hide its children.
   * This prevents the form from disappearing.
   */

  const cta = document.querySelector(".cta-section");

  if (cta) {
    cta.classList.add("reveal-up");

    if (prefersReducedMotion) {
      cta.classList.add("is-visible");
    } else {
      observer.observe(cta);
    }
  }


  /*
   * ──────────────────────────────────────
   * DONE
   * ──────────────────────────────────────
   */

  console.log(
    `[Animations] Observing ${document.querySelectorAll(
      ".reveal-up, .reveal-left, .reveal-right, .reveal-scale"
    ).length} elements.`
  );
});
