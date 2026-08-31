/**
 * Casual deterrents against right-click / view-source / dev tools.
 *
 * IMPORTANT: this does NOT secure the API token used elsewhere on this page.
 * Anyone can still read it via curl, a proxy tool, or dev tools opened
 * before this script runs. Treat this as UX friction for casual visitors
 * only, not a security control. Replace with a server-side proxy for the
 * API token before this goes anywhere permanent.
 */
(function () {
  'use strict';

  const BLOCKED_SHORTCUTS = [
    (e) => e.key === 'F12',
    (e) => (e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()),
    (e) => (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u'
  ];

  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());

  document.addEventListener('keydown', (e) => {
    if (BLOCKED_SHORTCUTS.some((test) => test(e))) e.preventDefault();
  });

  // Rough dev-tools-open heuristic based on viewport vs window size.
  // Unreliable across browsers/OSes — informational only, no action taken.
  const DEVTOOLS_SIZE_THRESHOLD = 160;
  let devToolsOpen = false;

  setInterval(() => {
    const opened =
      window.outerWidth - window.innerWidth > DEVTOOLS_SIZE_THRESHOLD ||
      window.outerHeight - window.innerHeight > DEVTOOLS_SIZE_THRESHOLD;

    if (opened && !devToolsOpen) {
      devToolsOpen = true;
      console.warn('DevTools detected.');
    } else if (!opened) {
      devToolsOpen = false;
    }
  }, 2000);

  console.log(
    '%cThis is a temporary build — not hardened for production.',
    'font-size: 13px; color: orange;'
  );
})();
