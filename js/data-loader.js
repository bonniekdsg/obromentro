import { initNavigation, initStatusFilters } from './nav.js';
import { createProgressRing, initProgressRings } from './progress-ring.js';
import { renderDonut, renderGantt } from './charts.js';

const ICONS = {
  capacidade: 'users',
  area: 'area',
  eventos: 'events',
  valor: 'money'
};

const STATUS_LABELS = {
  concluido: 'Concluído',
  andamento: 'Em andamento',
  planejado: 'Planejado'
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const numberFormatter = new Intl.NumberFormat('pt-BR');
const formatCurrency = (value) => currencyFormatter.format(value);
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
const statusBadge = (status) => `<span class="status status--${status}">${STATUS_LABELS[status]}</span>`;

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR').format(new Date(year, month - 1, day));
}

function renderFooter(data) {
  document.querySelectorAll('#project-address').forEach((element) => {
    element.textContent = data.projeto.endereco;
  });
  document.querySelectorAll('#last-updated').forEach((element) => {
    element.textContent = `Última atualização: ${formatDate(data.meta.atualizadoEm)}`;
  });
  document.querySelectorAll('#data-source').forEach((element) => {
    element.textContent = `Fonte: ${data.meta.fonte}`;
  });
}

function renderOverview(data) {
  const subtitle = document.querySelector('#hero-subtitle');
  if (subtitle) subtitle.textContent = data.projeto.titulo;

  const kpis = [
    { icon: ICONS.capacidade, label: 'Capacidade', value: numberFormatter.format(data.projeto.capacidade), note: 'lugares' },
    { icon: ICONS.area, label: 'Área Total Estimada', value: `${numberFormatter.format(data.projeto.areaTotalM2)} m²`, note: 'área construída' },
    { icon: ICONS.eventos, label: 'Eventos / Recepção / Mezanino', value: `${numberFormatter.format(data.projeto.areaEventosM2)} m²`, note: 'espaço integrado' }
  ];

  const kpiGrid = document.querySelector('#kpi-grid');
  kpiGrid.replaceChildren();
  kpis.forEach((kpi) => {
    const article = document.createElement('article');
    article.className = 'card kpi-card';
    article.innerHTML = `
      <span class="icon-bubble" aria-hidden="true">${icon(kpi.icon)}</span>
      <div class="kpi-content">
        <span class="kpi-label">${kpi.label}</span>
        <strong class="kpi-value">${kpi.value}</strong>
        <span class="kpi-note">${kpi.note}</span>
      </div>`;
    kpiGrid.append(article);
  });

  const progressGrid = document.querySelector('#progress-grid');
  progressGrid.replaceChildren();
  data.etapas.forEach((etapa) => progressGrid.append(createProgressRing(etapa)));
  document.querySelector('#progress-note').textContent = `* ${data.meta.avisoDados}`;
  initProgressRings(progressGrid);

  const milestones = document.querySelector('#milestones-list');
  data.marcos.forEach((marco) => {
    const item = document.createElement('li');
    item.className = 'milestone';
    const marker = marco.status === 'concluido' ? icon('check') : marco.ordem;
    item.innerHTML = `
      <span class="milestone-marker milestone-marker--${marco.status}" aria-hidden="true">${marker}</span>
      <span>
        <strong class="milestone-title">${marco.titulo}</strong>
        <span class="milestone-date">${marco.rotulo}</span>
      </span>
      ${statusBadge(marco.status)}`;
    milestones.append(item);
  });

  document.querySelector('#objective-text').textContent = data.conteudo.objetivo;
  document.querySelector('#audience-text').textContent = data.conteudo.publico;
}

function renderSchedule(data) {
  const expanded = document.querySelector('#expanded-milestones');
  data.marcos.forEach((marco) => {
    const item = document.createElement('li');
    item.className = 'expanded-milestone';
    const marker = marco.status === 'concluido' ? icon('check') : marco.ordem;
    item.innerHTML = `
      <span class="expanded-milestone__marker expanded-milestone__marker--${marco.status}" aria-hidden="true">${marker}</span>
      <div class="expanded-milestone__heading">
        <h3>${marco.titulo}</h3>
        ${statusBadge(marco.status)}
      </div>
      <p>${marco.descricao}</p>
      <time>${marco.rotulo}</time>`;
    expanded.append(item);
  });

  renderGantt(document.querySelector('#gantt-chart'), data.marcos);

  const tableBody = document.querySelector('#schedule-table-body');
  data.financeiro.metas.forEach((meta, metaIndex) => {
    meta.etapas.forEach((etapa) => {
      const row = document.createElement('tr');
      row.dataset.status = etapa.status;
      row.innerHTML = `
        <td>${etapa.codigo}</td>
        <td>${etapa.descricao}</td>
        <td>Meta ${metaIndex + 1}</td>
        <td>${statusBadge(etapa.status)}</td>`;
      tableBody.append(row);
    });
  });
  initStatusFilters();
}

function renderFinance(data) {
  const kpiGrid = document.querySelector('#finance-kpis');
  const kpis = [
    { label: 'Valor Global', value: data.projeto.valorGlobal, note: 'Investimento total estimado', icon: 'money' },
    { label: 'Meta 1', value: data.financeiro.metas[0].valor, note: `${data.financeiro.metas[0].percentualGlobal.toLocaleString('pt-BR')}% do valor global`, icon: 'bank' },
    { label: 'Meta 2', value: data.financeiro.metas[1].valor, note: `${data.financeiro.metas[1].percentualGlobal.toLocaleString('pt-BR')}% do valor global`, icon: 'events' }
  ];
  kpis.forEach((kpi) => {
    const card = document.createElement('article');
    card.className = 'card finance-kpi';
    card.innerHTML = `
      <div class="finance-kpi__top">
        <span class="eyebrow">${kpi.label}</span>
        <span class="icon-bubble" aria-hidden="true">${icon(kpi.icon)}</span>
      </div>
      <div class="finance-kpi__value">${formatCurrency(kpi.value)}</div>
      <div class="finance-kpi__label">${kpi.note}</div>`;
    kpiGrid.append(card);
  });

  renderDonut(document.querySelector('#donut-chart'), data.financeiro.metas, formatCurrency);

  const binding = document.querySelector('#binding-list');
  binding.innerHTML = `
    <article class="binding-item">
      <h3>PPA ${data.vinculacao.ppa.periodo}</h3>
      <p><strong>Eixo:</strong> ${data.vinculacao.ppa.eixo}<br><strong>Programa:</strong> ${data.vinculacao.ppa.programa}</p>
    </article>
    <article class="binding-item">
      <h3>LOA ${data.vinculacao.loa.ano}</h3>
      <p><strong>Órgão ${data.vinculacao.loa.orgao}</strong><br>Programa de Trabalho <code>${data.vinculacao.loa.programaTrabalho}</code><br>${data.vinculacao.loa.especificacao}</p>
    </article>`;

  const tables = document.querySelector('#budget-tables');
  data.financeiro.metas.forEach((meta, index) => {
    const section = document.createElement('section');
    section.className = 'card budget-card content-section';
    section.setAttribute('aria-labelledby', `budget-${meta.id}`);
    const rows = meta.etapas.map((etapa) => `
      <tr>
        <td>${etapa.codigo}</td>
        <td>${etapa.descricao}</td>
        <td class="currency value-cell">
          <div class="value-row">
            <span class="amount-bar" aria-hidden="true"><span style="--bar-width: ${(etapa.valor / meta.valor) * 100}%"></span></span>
            <span>${formatCurrency(etapa.valor)}</span>
          </div>
        </td>
      </tr>`).join('');
    section.innerHTML = `
      <header class="budget-card__header">
        <div>
          <p class="eyebrow">Meta ${index + 1}</p>
          <h2 id="budget-${meta.id}">${meta.nome}</h2>
          <p>${meta.percentualGlobal.toLocaleString('pt-BR')}% do valor global</p>
        </div>
        <span class="status status--${index === 0 ? 'andamento' : 'planejado'}">${index === 0 ? 'Em andamento' : 'Planejado'}</span>
      </header>
      <div class="table-scroll">
        <table class="data-table">
          <caption class="sr-only">Valores das etapas da Meta ${index + 1}</caption>
          <thead><tr><th scope="col">Etapa</th><th scope="col">Descrição</th><th scope="col">Valor</th></tr></thead>
          <tbody>${rows}<tr class="total-row"><td>Total</td><td>${meta.nome}</td><td class="currency">${formatCurrency(meta.valor)}</td></tr></tbody>
        </table>
      </div>`;
    tables.append(section);
  });

  document.querySelector('#finance-note-text').textContent = data.meta.avisoFinanceiro;
  document.querySelector('#export-csv').addEventListener('click', () => exportCsv(data));
}

function exportCsv(data) {
  const lines = [['Meta', 'Etapa', 'Descrição', 'Valor (R$)', 'Status']];
  data.financeiro.metas.forEach((meta, index) => {
    meta.etapas.forEach((etapa) => {
      lines.push([`Meta ${index + 1}`, etapa.codigo, etapa.descricao, etapa.valor.toFixed(2).replace('.', ','), STATUS_LABELS[etapa.status]]);
    });
  });
  const csv = lines.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';')).join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `auditorio-mpac-financeiro-${data.meta.atualizadoEm}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function showError(error) {
  console.error(error);
  const main = document.querySelector('.main-content');
  if (!main) return;
  const message = document.createElement('p');
  message.className = 'error-message';
  message.textContent = 'Não foi possível carregar os dados do projeto. Tente atualizar a página.';
  main.prepend(message);
}

async function init() {
  initNavigation();
  try {
    const response = await fetch('data/projeto.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Falha ao carregar dados: ${response.status}`);
    const data = await response.json();
    renderFooter(data);

    const page = document.documentElement.dataset.page;
    if (page === 'visao-geral') renderOverview(data);
    if (page === 'cronograma') renderSchedule(data);
    if (page === 'financeiro') renderFinance(data);
  } catch (error) {
    showError(error);
  }
}

init();
