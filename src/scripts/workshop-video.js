(() => {
  const video = document.querySelector('#verified-excerpt');
  if (!video) return;
  const poster = document.querySelector('.excerpt-poster');
  const toggle = document.querySelector('.excerpt-toggle');
  const sound = document.querySelector('.excerpt-sound');
  const status = document.querySelector('#moment-status');
  const desktop = matchMedia('(min-width: 1001px) and (hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let inView = false;
  let autoplayAttempted = false;
  let userInteracted = false;
  let automaticPlayback = false;
  let hasPlayed = false;
  let starting = false;

  function allowsAutoplay() {
    return desktop.matches && !reducedMotion.matches && !connection?.saveData &&
      !['slow-2g', '2g'].includes(connection?.effectiveType);
  }

  function updateControls() {
    toggle.textContent = video.ended ? 'Replay workshop excerpt' :
      video.paused ? 'Play workshop excerpt' : 'Pause workshop excerpt';
    sound.textContent = video.muted ? 'Watch with sound' : 'Turn sound off';
    sound.hidden = video.hidden;
  }

  function fallback(message) {
    video.pause();
    video.hidden = true;
    poster.hidden = false;
    status.textContent = message;
    updateControls();
  }

  async function play({ automatic = false, withSound = false } = {}) {
    if (starting) return;
    starting = true;
    automaticPlayback = automatic;
    toggle.disabled = true;
    sound.disabled = true;
    if (automatic) video.muted = true;
    else if (withSound || !hasPlayed) video.muted = false;
    if (!video.getAttribute('src')) {
      video.src = video.dataset.src;
      video.load();
    } else if (video.error) video.load();
    if (withSound || video.ended) video.currentTime = 0;
    video.hidden = false;
    poster.hidden = true;
    status.textContent = '';
    try {
      await video.play();
      hasPlayed = true;
      if (document.hidden || (automatic && (!inView || !allowsAutoplay()))) video.pause();
    } catch (error) {
      // A blocked autoplay request must leave a usable, quiet Play button.
      if (error.name === 'AbortError' && video.paused && !video.error) fallback('');
      else fallback(automatic && error.name === 'NotAllowedError'
        ? 'Press Play to watch the excerpt.'
        : 'The excerpt could not play. Please try again.');
    } finally {
      starting = false;
      toggle.disabled = false;
      sound.disabled = false;
      updateControls();
    }
  }

  function maybeAutoplay() {
    if (!inView || document.hidden || autoplayAttempted || userInteracted || !allowsAutoplay()) return;
    autoplayAttempted = true;
    play({ automatic: true });
  }

  toggle.addEventListener('click', () => {
    userInteracted = true;
    automaticPlayback = false;
    if (video.paused) play();
    else video.pause();
  });
  sound.addEventListener('click', () => {
    userInteracted = true;
    automaticPlayback = false;
    if (video.muted) play({ withSound: true });
    else video.muted = true;
  });
  // Native controls count as visitor choices, too. Never override their pause.
  video.addEventListener('pointerdown', () => { userInteracted = true; automaticPlayback = false; });
  video.addEventListener('keydown', () => { userInteracted = true; automaticPlayback = false; });
  ['play', 'pause', 'ended', 'volumechange'].forEach(event => video.addEventListener(event, updateControls));
  video.addEventListener('ended', () => {
    video.hidden = true;
    poster.hidden = false;
    updateControls();
  });
  video.addEventListener('error', () => fallback('The excerpt is unavailable. The workshop photo is shown instead.'));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else maybeAutoplay();
  });
  function preferenceChanged() {
    if (automaticPlayback && !allowsAutoplay()) video.pause();
    else maybeAutoplay();
  }
  desktop.addEventListener?.('change', preferenceChanged);
  reducedMotion.addEventListener?.('change', preferenceChanged);
  connection?.addEventListener?.('change', preferenceChanged);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.5;
      if (inView) maybeAutoplay();
      else video.pause();
    }, { threshold: [0, 0.5] }).observe(document.querySelector('.moment-frame'));
  }
  updateControls();
})();
