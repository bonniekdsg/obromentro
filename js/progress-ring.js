const CIRCUMFERENCE = 2 * Math.PI * 52;

export function createProgressRing(etapa) {
  const item = document.createElement('div');
  item.className = 'progress-item';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('progress-ring');
  svg.setAttribute('viewBox', '0 0 120 120');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `${etapa.nome}: ${etapa.percentual} por cento concluído`);

  const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  track.classList.add('progress-ring__track');
  track.setAttribute('cx', '60');
  track.setAttribute('cy', '60');
  track.setAttribute('r', '52');

  const value = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  value.classList.add('progress-ring__value');
  value.setAttribute('cx', '60');
  value.setAttribute('cy', '60');
  value.setAttribute('r', '52');
  value.setAttribute('stroke-dasharray', String(CIRCUMFERENCE));
  value.setAttribute('stroke-dashoffset', String(CIRCUMFERENCE));
  value.dataset.offset = String(CIRCUMFERENCE * (1 - etapa.percentual / 100));

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', '60');
  text.setAttribute('y', '67');
  text.setAttribute('text-anchor', 'middle');
  text.textContent = `${etapa.percentual}%`;

  const name = document.createElement('span');
  name.className = 'progress-name';
  name.textContent = etapa.nome;

  svg.append(track, value, text);
  item.append(svg, name);
  return item;
}
export function initProgressRings(container) {
  const values = container.querySelectorAll('.progress-ring__value');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reveal = (element) => element.setAttribute('stroke-dashoffset', element.dataset.offset);

  if (reducedMotion || !('IntersectionObserver' in window)) {
    values.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: .35 });

  values.forEach((value) => observer.observe(value));
}
