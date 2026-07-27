const SVG_NS = 'http://www.w3.org/2000/svg';
const TOTAL_MONTHS = 44;

function monthIndex(value) {
  const [year, month] = value.split('-').map(Number);
  return (year - 2024) * 12 + month - 5;
}
export function renderDonut(container, metas, formatCurrency) {
  const circumference = 2 * Math.PI * 45;
  const firstShare = metas[0].percentualGlobal / 100;
  const secondShare = metas[1].percentualGlobal / 100;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.classList.add('donut');
  svg.setAttribute('viewBox', '0 0 120 120');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Distribuição: Meta 1, ${metas[0].percentualGlobal.toLocaleString('pt-BR')} por cento; Meta 2, ${metas[1].percentualGlobal.toLocaleString('pt-BR')} por cento`);

  const track = document.createElementNS(SVG_NS, 'circle');
  track.classList.add('donut__track');
  track.setAttribute('cx', '60');
  track.setAttribute('cy', '60');
  track.setAttribute('r', '45');

  const meta1 = document.createElementNS(SVG_NS, 'circle');
  meta1.classList.add('donut__meta1');
  meta1.setAttribute('cx', '60');
  meta1.setAttribute('cy', '60');
  meta1.setAttribute('r', '45');
  meta1.setAttribute('stroke-dasharray', `${circumference * firstShare} ${circumference * (1 - firstShare)}`);

  const meta2 = document.createElementNS(SVG_NS, 'circle');
  meta2.classList.add('donut__meta2');
  meta2.setAttribute('cx', '60');
  meta2.setAttribute('cy', '60');
  meta2.setAttribute('r', '45');
  meta2.setAttribute('stroke-dasharray', `${circumference * secondShare} ${circumference * (1 - secondShare)}`);
  meta2.setAttribute('stroke-dashoffset', String(-circumference * firstShare));

  const amount = document.createElementNS(SVG_NS, 'text');
  amount.setAttribute('x', '60');
  amount.setAttribute('y', '58');
  amount.setAttribute('text-anchor', 'middle');
  amount.textContent = 'R$ 70 mi';

  const caption = document.createElementNS(SVG_NS, 'text');
  caption.classList.add('donut-caption');
  caption.setAttribute('x', '60');
  caption.setAttribute('y', '70');
  caption.setAttribute('text-anchor', 'middle');
  caption.textContent = 'valor global';

  svg.append(track, meta1, meta2, amount, caption);
  container.replaceChildren(svg);

  const legend = document.querySelector('#donut-legend');
  if (legend) {
    metas.forEach((meta, index) => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.innerHTML = `
        <span class="legend-swatch" aria-hidden="true"></span>
        <div>
          <strong>Meta ${index + 1} · ${meta.percentualGlobal.toLocaleString('pt-BR')}%</strong>
          <span>${formatCurrency(meta.valor)} · ${meta.nome}</span>
        </div>`;
      legend.append(item);
    });
  }
}

export function renderGantt(container, marcos) {
  const years = [
    { label: '2024', start: 2, span: 2 },
    { label: '2025', start: 4, span: 2 },
    { label: '2026', start: 6, span: 2 },
    { label: '2027', start: 8, span: 2 }
  ];

  const blank = document.createElement('span');
  blank.className = 'gantt-year';
  blank.textContent = 'Fase';
  container.append(blank);

  years.forEach(({ label, start, span }) => {
    const year = document.createElement('span');
    year.className = 'gantt-year';
    year.textContent = label;
    year.style.gridColumn = `${start} / span ${span}`;
    container.append(year);
  });

  marcos.forEach((marco) => {
    const label = document.createElement('span');
    label.className = 'gantt-label';
    label.textContent = marco.titulo;

    const track = document.createElement('div');
    track.className = 'gantt-track';

    const start = Math.max(0, monthIndex(marco.inicio));
    const end = Math.min(TOTAL_MONTHS - 1, monthIndex(marco.fim));
    const bar = document.createElement('span');
    bar.className = `gantt-bar gantt-bar--${marco.status}`;
    bar.style.left = `${(start / TOTAL_MONTHS) * 100}%`;
    bar.style.width = `${((end - start + 1) / TOTAL_MONTHS) * 100}%`;
    bar.title = `${marco.titulo}: ${marco.inicio} a ${marco.fim}`;
    track.append(bar);
    container.append(label, track);
  });

  const today = new Date();
  const todayMonth = (today.getFullYear() - 2024) * 12 + today.getMonth() - 4;
  if (todayMonth >= 0 && todayMonth < TOTAL_MONTHS) {
    const marker = document.createElement('span');
    marker.className = 'today-marker';
    marker.style.left = `calc(160px + (100% - 160px) * ${todayMonth / TOTAL_MONTHS})`;
    marker.setAttribute('aria-hidden', 'true');
    container.append(marker);
  }

  const accessible = document.querySelector('#gantt-accessible');
  if (!accessible) return;
  const table = document.createElement('table');
  table.innerHTML = '<caption>Períodos planejados por marco</caption><thead><tr><th>Marco</th><th>Início</th><th>Fim</th><th>Status</th></tr></thead>';
  const body = document.createElement('tbody');
  marcos.forEach((marco) => {
    const row = document.createElement('tr');
    row.innerHTML = `<th scope="row">${marco.titulo}</th><td>${marco.inicio}</td><td>${marco.fim}</td><td>${marco.rotulo}</td>`;
    body.append(row);
  });
  table.append(body);
  accessible.append(table);
}
