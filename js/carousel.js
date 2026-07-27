const AUTOPLAY_DELAY = 5500;

function createSlide(render, index, collection) {
  const slide = document.createElement('figure');
  slide.className = 'carousel-slide';
  slide.setAttribute('aria-roledescription', 'slide');
  slide.setAttribute('aria-label', `${index + 1} de ${collection.length}`);
  slide.innerHTML = `
    <picture>
      <source
        type="image/webp"
        srcset="
          assets/renders/${render.arquivo}-640.webp 640w,
          assets/renders/${render.arquivo}-1280.webp 1280w,
          assets/renders/${render.arquivo}-1672.webp 1672w"
        sizes="(max-width: 899px) 100vw, 1440px">
      <img
        src="assets/renders/${render.arquivo}-1280.jpg"
        srcset="
          assets/renders/${render.arquivo}-640.jpg 640w,
          assets/renders/${render.arquivo}-1280.jpg 1280w,
          assets/renders/${render.arquivo}-1672.jpg 1672w"
        sizes="(max-width: 899px) 100vw, 1440px"
        width="1672"
        height="941"
        loading="lazy"
        decoding="async"
        alt="${render.alt}">
    </picture>
    <figcaption>
      <span>${render.alt}</span>
      <small>${render.legenda}</small>
    </figcaption>`;
  return slide;
}

export function initCarousel(renders) {
  const carousel = document.querySelector('#project-carousel');
  const track = document.querySelector('#carousel-track');
  if (!carousel || !track || renders.length < 2) return;

  const dotsContainer = document.querySelector('#carousel-dots');
  const counter = document.querySelector('#carousel-counter');
  const status = document.querySelector('#carousel-status');
  const previousButton = carousel.querySelector('.carousel-arrow--previous');
  const nextButton = carousel.querySelector('.carousel-arrow--next');
  const toggleButton = carousel.querySelector('.carousel-toggle');
  const toggleLabel = toggleButton.querySelector('span');
  const toggleIcon = toggleButton.querySelector('use');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const originalSlides = renders.map(createSlide);
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides.at(-1).cloneNode(true);
  [firstClone, lastClone].forEach((clone) => {
    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('aria-label');
    clone.querySelector('img').alt = '';
  });
  track.append(lastClone, ...originalSlides, firstClone);

  let position = 1;
  let timer = null;
  let pausedByUser = reducedMotion;
  let pointerInside = false;
  let focusInside = false;
  let touchStartX = 0;

  renders.forEach((render, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Exibir imagem ${index + 1}: ${render.alt}`);
    dot.addEventListener('click', () => {
      position = index + 1;
      update(true);
      restartAutoplay();
    });
    dotsContainer.append(dot);
  });

  const realIndex = () => {
    if (position === 0) return renders.length - 1;
    if (position === renders.length + 1) return 0;
    return position - 1;
  };

  const update = (announce = false) => {
    track.style.transform = `translate3d(-${position * 100}%, 0, 0)`;
    const index = realIndex();
    originalSlides.forEach((slide, slideIndex) => {
      slide.setAttribute('aria-hidden', String(slideIndex !== index));
    });
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, dotIndex) => {
      dot.setAttribute('aria-current', String(dotIndex === index));
    });
    counter.textContent = `${index + 1} / ${renders.length}`;
    if (announce) status.textContent = `Imagem ${index + 1} de ${renders.length}: ${renders[index].alt}`;
  };

  const move = (direction, announce = true) => {
    position += direction;
    update(announce);
  };

  const stopAutoplay = () => {
    clearInterval(timer);
    timer = null;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (pausedByUser || pointerInside || focusInside || document.hidden) return;
    timer = setInterval(() => move(1, false), AUTOPLAY_DELAY);
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  const renderToggle = () => {
    const paused = pausedByUser;
    toggleButton.setAttribute('aria-label', paused ? 'Iniciar reprodução automática' : 'Pausar reprodução automática');
    toggleLabel.textContent = paused ? 'Reproduzir' : 'Pausar';
    toggleIcon.setAttribute('href', `assets/icons.svg#${paused ? 'play' : 'pause'}`);
  };

  track.addEventListener('transitionend', () => {
    if (position !== 0 && position !== renders.length + 1) return;
    track.classList.add('is-jumping');
    position = position === 0 ? renders.length : 1;
    update(false);
    requestAnimationFrame(() => requestAnimationFrame(() => track.classList.remove('is-jumping')));
  });

  previousButton.addEventListener('click', () => {
    move(-1);
    restartAutoplay();
  });
  nextButton.addEventListener('click', () => {
    move(1);
    restartAutoplay();
  });
  toggleButton.addEventListener('click', () => {
    pausedByUser = !pausedByUser;
    renderToggle();
    startAutoplay();
  });

  carousel.addEventListener('mouseenter', () => {
    pointerInside = true;
    stopAutoplay();
  });
  carousel.addEventListener('mouseleave', () => {
    pointerInside = false;
    startAutoplay();
  });
  carousel.addEventListener('focusin', () => {
    focusInside = true;
    stopAutoplay();
  });
  carousel.addEventListener('focusout', (event) => {
    if (carousel.contains(event.relatedTarget)) return;
    focusInside = false;
    startAutoplay();
  });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  });
  carousel.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 45) return;
    move(distance > 0 ? -1 : 1);
    restartAutoplay();
  }, { passive: true });
  document.addEventListener('visibilitychange', startAutoplay);

  update(false);
  renderToggle();
  startAutoplay();
}
