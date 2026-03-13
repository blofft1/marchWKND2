const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function isDMVideoUrl(href) {
  return /adobeaemcloud\.com\/adobe\/assets\/.*\/play/i.test(href);
}

function isVideoUrl(href) {
  if (!href) return false;
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(href) || isDMVideoUrl(href);
}

function createVideoBackground(videoSrc) {
  const videoEl = document.createElement('video');
  videoEl.muted = true;
  videoEl.playsInline = true;
  videoEl.loop = true;

  if (isDMVideoUrl(videoSrc)) {
    videoEl.src = videoSrc;
  } else {
    const sourceEl = document.createElement('source');
    sourceEl.setAttribute('src', videoSrc);
    sourceEl.setAttribute('type', `video/${videoSrc.split('.').pop().split('?')[0]}`);
    videoEl.append(sourceEl);
  }

  if (!prefersReducedMotion.matches) {
    videoEl.autoplay = true;
  }

  return videoEl;
}

function createVideoControls(videoEl) {
  const playIcon = `${window.hlx.codeBasePath}/icons/video-play.svg`;
  const pauseIcon = `${window.hlx.codeBasePath}/icons/video-pause.svg`;

  const controls = document.createElement('div');
  controls.className = 'hero-video-controls';

  const btn = document.createElement('button');
  btn.setAttribute('aria-label', 'Pause background video');
  btn.innerHTML = `<img src="${pauseIcon}" width="24" height="24" alt="">`;

  if (prefersReducedMotion.matches) {
    btn.setAttribute('aria-label', 'Play background video');
    btn.innerHTML = `<img src="${playIcon}" width="24" height="24" alt="">`;
  }

  btn.addEventListener('click', () => {
    if (videoEl.paused) {
      videoEl.play();
      btn.setAttribute('aria-label', 'Pause background video');
      btn.innerHTML = `<img src="${pauseIcon}" width="24" height="24" alt="">`;
    } else {
      videoEl.pause();
      btn.setAttribute('aria-label', 'Play background video');
      btn.innerHTML = `<img src="${playIcon}" width="24" height="24" alt="">`;
    }
  });

  controls.append(btn);
  return controls;
}

/**
 *
 * @param {Element} block
 */
export default function decorate(block) {
  // Get the enable underline setting from the block content (3rd div)
  const enableUnderline = block.querySelector(':scope div:nth-child(3) > div')?.textContent?.trim() || 'true';
  // Get the layout Style from the block content (4th div)
  const layoutStyle = block.querySelector(':scope div:nth-child(4) > div')?.textContent?.trim() || 'overlay';

  // Get the CTA style from the block content (5th div)
  const ctaStyle = block.querySelector(':scope div:nth-child(5) > div')?.textContent?.trim() || 'default';

  const backgroundStyle = block.querySelector(':scope div:nth-child(6) > div')?.textContent?.trim() || 'default';

  // Detect video background: check if first row has a video link instead of a picture
  const firstRow = block.querySelector(':scope > div:first-child');
  const videoLink = firstRow?.querySelector('a[href]');

  if (videoLink && isVideoUrl(videoLink.href)) {
    block.classList.add('hero-video');
    const videoEl = createVideoBackground(videoLink.href);

    // Replace the link's parent with the video element
    const mediaContainer = videoLink.closest('div');
    mediaContainer.textContent = '';
    mediaContainer.append(videoEl);

    // Add play/pause controls
    block.append(createVideoControls(videoEl));
  }

  if (layoutStyle) {
    block.classList.add(`${layoutStyle}`);
  }

  if (backgroundStyle) {
    block.classList.add(`${backgroundStyle}`);
  }

  // Add removeunderline class if underline is disabled
  if (enableUnderline.toLowerCase() === 'false') {
    block.classList.add('removeunderline');
  }

  // Find the button container within the hero block
  const buttonContainer = block.querySelector('p.button-container, p.button-wrapper');

  if (buttonContainer) {
    // Add the CTA style class to the button container
    buttonContainer.classList.add(`cta-${ctaStyle}`);
  }

  // Hide the CTA style configuration paragraph
  const ctaStyleParagraph = block.querySelector('p[data-aue-prop="ctastyle"]');
  if (ctaStyleParagraph) {
    ctaStyleParagraph.style.display = 'none';
  }

  // Optional: Remove the configuration divs after reading them to keep the DOM clean
  const underlineDiv = block.querySelector(':scope div:nth-child(3)');
  if (underlineDiv) {
    underlineDiv.style.display = 'none';
  }

  const layoutStyleDiv = block.querySelector(':scope div:nth-child(4)');
  if (layoutStyleDiv) {
    layoutStyleDiv.style.display = 'none';
  }

  const ctaStyleDiv = block.querySelector(':scope div:nth-child(5)');
  if (ctaStyleDiv) {
    ctaStyleDiv.style.display = 'none';
  }

  const backgroundStyleDiv = block.querySelector(':scope div:nth-child(6)');
  if (backgroundStyleDiv) {
    backgroundStyleDiv.style.display = 'none';
  }
}
