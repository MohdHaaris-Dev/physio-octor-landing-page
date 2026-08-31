document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".site-nav");
  const menuToggle = document.querySelector(".nav-menu-toggle");
  const mobileNavWrapper = document.querySelector(".mobile-nav-wrapper");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
  const mobileNavLinks = document.querySelectorAll(
    ".mobile-nav-links a"
  );

  if (
    !nav ||
    !menuToggle ||
    !mobileNavWrapper ||
    !mobileNav ||
    !mobileNavOverlay
  ) {
    return;
  }

  const desktopBreakpoint = 768;
  const closeAnimationDuration = 500;

  let previouslyFocusedElement = null;
  let closeTimeout = null;

  /* ══════════════════════════════════════
     SCROLL STATE
     ══════════════════════════════════════ */

  function updateNavbarOnScroll() {
    if (window.scrollY > 20) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }

  updateNavbarOnScroll();

  window.addEventListener(
    "scroll",
    updateNavbarOnScroll,
    {
      passive: true,
    }
  );


  /* ══════════════════════════════════════
     OPEN MENU
     ══════════════════════════════════════ */

  function openMenu() {
    /*
     * Clear any pending closing animation.
     */
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    previouslyFocusedElement =
      document.activeElement;

    /*
     * Remove the closing state first.
     */
    mobileNavWrapper.classList.remove(
      "is-closing"
    );

    /*
     * Keep wrapper mounted and visible.
     */
    mobileNavWrapper.classList.add(
      "is-open"
    );

    /*
     * Raise navbar above the glass panel.
     */
    nav.classList.add("menu-open");

    /*
     * Morph hamburger into X.
     */
    menuToggle.classList.add("is-open");

    mobileNavWrapper.setAttribute(
      "aria-hidden",
      "false"
    );

    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Close navigation menu"
    );

    /*
     * Prevent background page scrolling.
     */
    document.body.style.overflow = "hidden";

    /*
     * Move focus to the toggle itself.
     *
     * Since the toggle is now the close button,
     * this makes keyboard interaction intuitive.
     */
    requestAnimationFrame(() => {
      menuToggle.focus();
    });
  }


  /* ══════════════════════════════════════
     CLOSE MENU
     ══════════════════════════════════════ */

  function closeMenu() {
    /*
     * Don't restart the animation if the menu
     * is already closing.
     */
    if (
      !mobileNavWrapper.classList.contains(
        "is-open"
      )
    ) {
      return;
    }

    /*
     * Remove the open state so the navbar controls
     * can return to their normal position.
     */
    mobileNavWrapper.classList.remove(
      "is-open"
    );

    /*
     * Add closing state so the glass panel and
     * links animate out before the wrapper disappears.
     */
    mobileNavWrapper.classList.add(
      "is-closing"
    );

    /*
     * Start hamburger → normal hamburger animation.
     */
    menuToggle.classList.remove(
      "is-open"
    );

    /*
     * Update accessibility state immediately.
     */
    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    mobileNavWrapper.setAttribute(
      "aria-hidden",
      "true"
    );

    /*
     * Restore page scrolling.
     */
    document.body.style.overflow = "";

    /*
     * Remove the navbar open state after the
     * controls have started their transition.
     */
    nav.classList.remove("menu-open");

    /*
     * Wait for the panel's closing animation to finish
     * before completely hiding the wrapper.
     */
    closeTimeout = setTimeout(() => {
      mobileNavWrapper.classList.remove(
        "is-closing"
      );

      closeTimeout = null;
    }, closeAnimationDuration);

    /*
     * Return focus to the hamburger button.
     */
    requestAnimationFrame(() => {
      menuToggle.focus();
    });

    previouslyFocusedElement = null;
  }


  /* ══════════════════════════════════════
     TOGGLE
     ══════════════════════════════════════ */

  function toggleMenu() {
    if (
      mobileNavWrapper.classList.contains(
        "is-open"
      )
    ) {
      closeMenu();
    } else {
      openMenu();
    }
  }


  /* ══════════════════════════════════════
     MENU BUTTON
     ══════════════════════════════════════ */

  menuToggle.addEventListener(
    "click",
    toggleMenu
  );


  /* ══════════════════════════════════════
     OVERLAY
     ══════════════════════════════════════ */

  mobileNavOverlay.addEventListener(
    "click",
    closeMenu
  );


  /* ══════════════════════════════════════
     NAVIGATION LINKS
     ══════════════════════════════════════ */

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });


  /* ══════════════════════════════════════
     ESCAPE KEY
     ══════════════════════════════════════ */

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") {
        return;
      }

      if (
        mobileNavWrapper.classList.contains(
          "is-open"
        )
      ) {
        closeMenu();
      }
    }
  );


  /* ══════════════════════════════════════
     FOCUS TRAP
     ══════════════════════════════════════ */

  mobileNav.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Tab") {
        return;
      }

      const focusableElements =
        mobileNav.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

      /*
       * If the menu only contains links and no
       * additional buttons, we still want the
       * focus to remain inside the menu.
       */
      const allFocusableElements = [
        menuToggle,
        ...focusableElements,
      ];

      if (!allFocusableElements.length) {
        return;
      }

      const firstElement =
        allFocusableElements[0];

      const lastElement =
        allFocusableElements[
          allFocusableElements.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement ===
          firstElement
      ) {
        event.preventDefault();

        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement ===
          lastElement
      ) {
        event.preventDefault();

        firstElement.focus();
      }
    }
  );


  /* ══════════════════════════════════════
     VIEWPORT CHANGE
     ══════════════════════════════════════ */

  window.addEventListener(
    "resize",
    () => {
      if (
        window.innerWidth >
          desktopBreakpoint &&
        mobileNavWrapper.classList.contains(
          "is-open"
        )
      ) {
        closeMenu();
      }
    }
  );
});
