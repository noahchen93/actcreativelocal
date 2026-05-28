(() => {
  const DEFAULT_INTERVAL = 3800;
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

  const cleanText = (value) => (value || '').replace(/\s+/g, ' ').trim();

  function collectCases(doc) {
    return [...doc.querySelectorAll('.portfolio-case-card')]
      .flatMap((card) => {
        const title = cleanText(card.querySelector('h3')?.textContent);
        const category = cleanText(card.querySelector('.case-card-head span')?.textContent);

        return [...card.querySelectorAll('.portfolio-shot-strip figure')].map((figure, imageIndex) => {
          const image = figure.querySelector('img');
          if (!image) return null;

          const src = image.getAttribute('src');
          const caption = cleanText(figure.querySelector('figcaption')?.textContent) || title;
          if (!src || !title) return null;

          return {
            src,
            title,
            caption,
            category,
            alt: image.getAttribute('alt') || `${title} production case image ${imageIndex + 1}`,
          };
        });
      })
      .filter(Boolean);
  }

  async function loadItems(root) {
    const source = root.dataset.caseCarouselSource;
    if (!source) return collectCases(document);

    const response = await fetch(source, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Unable to load carousel source: ${response.status}`);

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return collectCases(doc);
  }

  function fallbackItem(root) {
    const image = root.querySelector('[data-carousel-image]');
    const title = cleanText(root.querySelector('[data-carousel-title]')?.textContent);

    if (!image?.getAttribute('src') || !title) return null;

    return {
      src: image.getAttribute('src'),
      title,
      caption: cleanText(root.querySelector('[data-carousel-caption]')?.textContent) || title,
      category: cleanText(root.querySelector('[data-carousel-category]')?.textContent),
      alt: image.getAttribute('alt') || `${title} production case image`,
    };
  }

  function initCarousel(root) {
    const image = root.querySelector('[data-carousel-image]');
    const frame = root.querySelector('.case-carousel-frame');
    const category = root.querySelector('[data-carousel-category]');
    const counter = root.querySelector('[data-carousel-counter]');
    const title = root.querySelector('[data-carousel-title]');
    const caption = root.querySelector('[data-carousel-caption]');

    if (!image || !frame || !title || !caption) return;

    let items = [fallbackItem(root)].filter(Boolean);
    let index = 0;
    let timer = null;
    let isMoving = false;

    const track = document.createElement('div');
    const currentSlide = document.createElement('div');
    const nextSlide = document.createElement('div');
    const nextImage = document.createElement('img');

    track.className = 'case-carousel-scroll';
    currentSlide.className = 'case-carousel-slide';
    nextSlide.className = 'case-carousel-slide';
    nextImage.loading = 'lazy';
    nextImage.decoding = 'async';
    nextImage.width = 1200;
    nextImage.height = 800;
    nextImage.setAttribute('aria-hidden', 'true');

    currentSlide.appendChild(image);
    nextSlide.appendChild(nextImage);
    track.append(currentSlide, nextSlide);
    frame.appendChild(track);
    root.classList.add('is-scroll-carousel');

    const setImage = (targetImage, item) => {
      targetImage.src = item.src;
      targetImage.alt = item.alt;
    };

    const updateCaption = (itemIndex) => {
      const item = items[itemIndex];

      title.textContent = item.title;
      caption.textContent = item.caption;
      if (category) category.textContent = item.category || 'Production case';
      if (counter) counter.textContent = `${itemIndex + 1} / ${items.length}`;
    };

    const resetTrack = () => {
      track.style.transition = 'none';
      track.style.transform = 'translate3d(0, 0, 0)';
      track.getBoundingClientRect();
    };

    const render = (nextIndex, immediate = false) => {
      if (!items.length) return;

      index = (nextIndex + items.length) % items.length;
      const item = items[index];
      const followingItem = items[(index + 1) % items.length];

      resetTrack();
      setImage(image, item);
      setImage(nextImage, followingItem);
      updateCaption(index);
    };

    const moveNext = () => {
      if (isMoving || items.length < 2) return;

      const nextIndex = (index + 1) % items.length;
      const followingItem = items[(nextIndex + 1) % items.length];

      isMoving = true;
      setImage(nextImage, items[nextIndex]);
      resetTrack();

      track.style.transition = 'transform 760ms cubic-bezier(0.72, 0, 0.18, 1)';
      requestAnimationFrame(() => {
        track.style.transform = 'translate3d(-100%, 0, 0)';
      });

      const finish = () => {
        if (!isMoving) return;

        index = nextIndex;
        resetTrack();
        setImage(image, items[index]);
        setImage(nextImage, followingItem);
        updateCaption(index);
        isMoving = false;
      };

      track.addEventListener('transitionend', finish, { once: true });
      window.setTimeout(() => {
        if (isMoving) finish();
      }, 900);
    };

    const start = () => {
      window.clearInterval(timer);
      if (items.length < 2 || REDUCED_MOTION.matches) return;

      const interval = Number(root.dataset.caseCarouselInterval || DEFAULT_INTERVAL);
      timer = window.setInterval(moveNext, interval);
    };

    render(0, true);

    loadItems(root)
      .then((loadedItems) => {
        if (!loadedItems.length) return;
        items = loadedItems;
        render(0, true);
        start();
      })
      .catch(() => {
        start();
      });
  }

  document.querySelectorAll('[data-case-carousel]').forEach(initCarousel);
})();
