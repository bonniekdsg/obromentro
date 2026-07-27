# PRD — Dashboard de Monitoramento do Projeto
## Construção e Estruturação do Auditório Institucional do Ministério Público do Estado do Acre (MPAC)

| Campo | Valor |
|---|---|
| **Documento** | Product Requirements Document (PRD) |
| **Produto** | Portal público de monitoramento de obra — Auditório Institucional MPAC |
| **Versão** | 1.0 |
| **Data** | 24/07/2026 |
| **Fonte de conteúdo** | *Diagramação MPAC com capa.pdf* (Projeto Institucional MPAC) |
| **Stack definida** | HTML5 + CSS3 + JavaScript puro (sem framework, sem build step) |
| **Escopo do MVP** | Visão Geral, Cronograma, Financeiro |
| **Fases futuras** | Execução Física, Documentos, Contato, Área Interna |

---

## 1. Visão Geral do Produto

### 1.1 Problema
O MPAC executará um empreendimento de **R$ 70.000.000,00** com 3.850 m² de área construída. Obras públicas dessa magnitude exigem prestação de contas contínua à sociedade, aos órgãos de controle e às instâncias internas de governança. Hoje essa informação só existe em documentos estáticos (PDFs, planilhas, ofícios), dispersos e desatualizados.

### 1.2 Solução
Uma página web pública, institucional e de leitura rápida que consolida em um único lugar: identificação do projeto, percentual de avanço por etapa, cronograma de marcos, distribuição financeira por meta/etapa e o acervo visual (perspectivas 3D) do empreendimento.

### 1.3 Objetivos do produto
1. Dar **transparência ativa** sobre a execução física e financeira da obra (Lei 12.527/2011 — LAI).
2. Reduzir o esforço de resposta a demandas de informação sobre o andamento do projeto.
3. Comunicar visualmente o empreendimento com material de alta qualidade (renders 3D).
4. Servir de peça institucional de apoio a captação de recursos, articulação com o Governo do Estado (PPA 2024–2027 / LOA 2026) e prestação de contas ao Conselho Superior.

### 1.4 Métricas de sucesso
| Métrica | Meta |
|---|---|
| Lighthouse Performance (mobile) | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Tempo até o primeiro conteúdo (LCP) | < 2,5 s em 4G |
| Atualização dos percentuais | Mensal, após medição da fiscalização |
| Peso total da página (Visão Geral) | < 1,5 MB com renders otimizados |

---

## 2. Personas

| Persona | Necessidade | Uso principal |
|---|---|---|
| **Cidadão acreano** | Saber onde está sendo aplicado o recurso público | Visão Geral, renders, percentuais |
| **Gestor MPAC / Procurador-Geral** | Status executivo em 30 segundos | Cards de KPI, cronograma de marcos |
| **Órgão de controle (TCE, CNMP, Controle Interno)** | Rastreabilidade físico-financeira | Financeiro, Cronograma, Documentos (fase 2) |
| **Departamento de Arquitetura e Engenharia** | Atualizar percentuais e marcos | Área Interna (fase 2) |
| **Imprensa / parceiros institucionais** | Material visual e números oficiais | Renders, valor global, capacidade |

---

## 3. Design System

O design system é derivado do mockup aprovado (`assets/mockup-dashboard.png`) e da identidade visual do MPAC.

### 3.1 Paleta de cores

```css
:root {
  /* Marca */
  --mpac-red:            #A5122A;  /* vermelho institucional MPAC — logo, títulos de seção, anéis de progresso */
  --mpac-red-dark:       #7E0E20;  /* hover, faixa diagonal inferior */
  --mpac-red-soft:       #FBEAEC;  /* fundo dos ícones circulares nos cards de KPI */

  /* Neutros */
  --ink-900:             #1A1A1A;  /* números de KPI, títulos */
  --ink-700:             #3D3D3D;  /* corpo de texto */
  --ink-500:             #6B6B6B;  /* labels, legendas, subtítulos */
  --ink-300:             #C9CDD2;  /* trilha cinza dos anéis de progresso */
  --line:                #E6E8EB;  /* bordas de card, divisores */
  --surface:             #FFFFFF;  /* cards */
  --bg:                  #F5F6F8;  /* fundo da página */
  --bg-diagonal:         #EDEFF2;  /* faixas diagonais decorativas do rodapé */

  /* Status */
  --status-done-bg:      #DFF5E3;
  --status-done-fg:      #1E7B3A;
  --status-running-bg:   #FDECCB;
  --status-running-fg:   #9A6400;
  --status-planned-bg:   #EDEFF2;
  --status-planned-fg:   #5A6169;
}
```

### 3.2 Tipografia

| Token | Uso | Especificação |
|---|---|---|
| `--font-sans` | Toda a interface | `"Inter", "Segoe UI", system-ui, -apple-system, sans-serif` |
| `--fs-display` | Título do hero ("Monitoramento do Projeto") | 56px / 700 / -0.02em, branco |
| `--fs-hero-sub` | Subtítulo do hero | 20px / 400 / 1.45, branco 90% |
| `--fs-kpi` | Números de KPI (700, 3.850 m²) | 34px / 700 / `--ink-900` |
| `--fs-section` | Títulos de seção ("ANDAMENTO DAS ETAPAS") | 15px / 700 / uppercase / +0.08em / `--mpac-red` |
| `--fs-label` | Labels de KPI ("CAPACIDADE") | 12px / 600 / uppercase / +0.06em / `--ink-500` |
| `--fs-body` | Corpo de texto (Objetivo Geral, Público) | 15px / 400 / 1.65 / `--ink-700` |
| `--fs-caption` | Notas de rodapé, asteriscos | 12px / 400 / italic / `--ink-500` |
| `--fs-nav` | Itens de menu | 15px / 500 |

Fonte carregada via `@font-face` local (arquivos WOFF2 no servidor do MPAC) — **não** usar CDN externo, por política de rede de órgão público. Fallback para stack de sistema.

### 3.3 Espaçamento, raio e elevação

```css
:root {
  --sp-1: 4px;  --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
  --sp-5: 24px; --sp-6: 32px;  --sp-7: 48px;  --sp-8: 64px;

  --radius-card: 12px;
  --radius-pill: 999px;
  --radius-btn:  8px;

  --shadow-card:  0 1px 2px rgba(16,24,40,.04), 0 4px 12px rgba(16,24,40,.06);
  --shadow-hover: 0 2px 4px rgba(16,24,40,.06), 0 8px 24px rgba(16,24,40,.10);

  --container-max: 1440px;
  --gutter: 32px;   /* 20px em mobile */
}
```

### 3.4 Grid
- Container central com largura máxima de **1440px**, gutters de 32px (desktop) / 20px (mobile).
- Grid de 12 colunas, gap de 24px.
- Cards de KPI: 4 colunas de 3/12 (desktop) → 2×2 (tablet) → 1 coluna (mobile).
- Faixa inferior (Cronograma / Objetivo / Público): 4/12 + 4/12 + 4/12 → empilha em mobile.

### 3.5 Componentes

#### `header.site-header`
Barra branca fixa no topo, 76px de altura, borda inferior `--line`.
- **Esquerda:** logo MPAC (SVG) + assinatura "Ministério Público do Estado do Acre" em 11px.
- **Centro:** navegação horizontal. Item ativo em `--mpac-red` com underline de 3px, `border-radius: 2px`.
- **Direita:** botão outline "Área Interna" — borda 1,5px `--mpac-red`, texto `--mpac-red`, ícone de usuário, `--radius-btn`. Hover: fundo `--mpac-red`, texto branco.
- Mobile (< 900px): navegação vira menu hambúrguer em drawer lateral.

#### `section.hero`
Altura 380px (desktop) / 300px (mobile). Imagem de fundo `render-02-fachada-principal.png` com `object-fit: cover; object-position: center 60%`.
- Overlay: `linear-gradient(100deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.45) 45%, rgba(0,0,0,.10) 100%)`.
- Badge "PROJETO INSTITUCIONAL": pill vermelho `--mpac-red`, texto branco 11px uppercase, padding 8px 18px.
- Título e subtítulo alinhados à esquerda, ancorados a 48px do fundo.
- Elemento decorativo: triângulo vermelho no canto inferior direito (`clip-path`), sangrando para fora do hero.

#### `article.kpi-card`
```
┌─────────────────────────────────┐
│  ◯icon   LABEL EM CAIXA ALTA    │
│          34px valor destacado   │
│          unidade / observação   │
└─────────────────────────────────┘
```
Fundo `--surface`, borda 1px `--line`, `--radius-card`, `--shadow-card`, padding 24px. Ícone em círculo de 56px com fundo `--mpac-red-soft` e glifo `--mpac-red` (stroke 1.75px). Transição de `--shadow-card` para `--shadow-hover` em 180ms ease-out.

#### `.progress-ring`
SVG de 132×132px, `viewBox="0 0 120 120"`.
- Trilha: `<circle r="52" stroke="var(--ink-300)" stroke-width="11" fill="none">`.
- Progresso: mesmo círculo com `stroke="var(--mpac-red)"`, `stroke-linecap="round"`, `transform="rotate(-90 60 60)"`, controlado por `stroke-dasharray` / `stroke-dashoffset`.
- Percentual centralizado em 26px/700 `--ink-900`; rótulo da etapa abaixo do anel em 13px `--ink-700`.
- Animação de preenchimento ao entrar na viewport (`IntersectionObserver`), 900ms `cubic-bezier(.22,1,.36,1)`. Respeitar `prefers-reduced-motion: reduce` (renderiza estado final sem animar).
- Divisores verticais de 1px `--line` entre os 5 anéis (ocultos em mobile).

#### `ol.milestones`
Lista vertical com linha-guia de 2px `--line` conectando os marcadores.
- Marcador: círculo de 26px. Concluído → fundo `--mpac-red` com ✓ branco. Em andamento → borda 2px `--mpac-red`, número em `--mpac-red`. Planejado → borda 2px `--ink-300`, número em `--ink-500`.
- Título do marco 14px/600; data em 12px `--ink-500`.
- Badge de status à direita: pill 11px/700 uppercase, cores conforme tokens de status.

#### `.info-card`
Card de texto com ícone circular de 64px (`--mpac-red-soft`), título de seção em vermelho com underline curto de 3px × 40px, e corpo em `--fs-body`.

#### `footer.address-bar`
Faixa de 64px com pin de localização `--mpac-red` + endereço: *Rua Fátima Maia, nº 200, Jardim Europa, CEP 69.915-772, Rio Branco/AC*. Fundo com faixas diagonais decorativas em `--bg-diagonal` e bloco vermelho `--mpac-red-dark` à esquerda, ambos em `clip-path` e `aria-hidden`.

### 3.6 Acessibilidade (obrigatório — órgão público)
- Conformidade **WCAG 2.1 nível AA** e **eMAG 3.1**.
- Contraste mínimo 4.5:1 para texto; validar o par branco sobre hero com o overlay aplicado.
- Todos os anéis de progresso expostos como `role="img"` com `aria-label="Execução da Obra: 42 por cento concluído"`.
- Navegação completa por teclado; `:focus-visible` com outline de 2px `--mpac-red` e offset de 2px.
- Link "Pular para o conteúdo principal" como primeiro elemento focável.
- Renders com `alt` descritivo; imagens meramente decorativas com `alt=""` e `aria-hidden="true"`.
- Nenhuma informação transmitida apenas por cor — status sempre acompanhado de texto.

---

## 4. Conteúdo (extraído do PDF institucional)

> Todo o conteúdo abaixo é a fonte de verdade do MVP e deve ser carregado a partir de `data/projeto.json`, nunca hard-coded no HTML.

### 4.1 Identificação do projeto
| Campo | Valor |
|---|---|
| Título | Construção e Estruturação do Auditório Institucional do Ministério Público do Estado do Acre – MPAC |
| Capacidade | 700 lugares |
| Área do Auditório | 2.000 m² |
| Espaço de Eventos / Recepção / Mezanino | 850 m² |
| Salas Multiuso | 1.000 m² |
| Área Total Estimada | 3.850 m² |
| Valor Global | R$ 70.000.000,00 (setenta milhões de reais) |
| Endereço | Rua Fátima Maia, nº 200, Jardim Europa, CEP 69.915-772, Rio Branco/AC |

**Cards de KPI da Visão Geral (4 cards, conforme mockup):** Capacidade (700 lugares) · Área Total Estimada (3.850 m²) · Espaço de Eventos/Recepção/Mezanino (850 m²) · Valor Global (R$ 70.000.000,00).

### 4.2 Andamento das etapas (anéis de progresso)
| Etapa | % | Observação |
|---|---|---|
| Projetos Executivos | 100% | Concluído |
| Licitação | 78% | — |
| Execução da Obra | 42% | Em andamento |
| Mobiliário e Equipamentos | 18% | — |
| Paisagismo | 5% | — |

Nota obrigatória sob os anéis, em `--fs-caption`: *"Percentuais referentes ao acompanhamento conceitual do projeto. Dados ilustrativos."* — deve permanecer até que a fiscalização passe a alimentar medições oficiais.

### 4.3 Cronograma de marcos
| # | Marco | Status | Data |
|---|---|---|---|
| 1 | Projetos Executivos Concluídos | Concluído | Mai/2024 |
| 2 | Licitação da Obra | Concluído | Mar/2025 |
| 3 | Execução da Obra | Em andamento | — |
| 4 | Mobiliário e Equipamentos | Planejado | Início previsto: Ago/2026 |
| 5 | Paisagismo e Urbanização | Planejado | Início previsto: Dez/2026 |

### 4.4 Objetivo Geral
> Fortalecer a capacidade institucional do Ministério Público do Estado do Acre na promoção da cidadania, no aprimoramento das políticas públicas, na qualificação de agentes públicos e na ampliação dos espaços de diálogo com a sociedade, por meio da implantação de infraestrutura adequada para realização de eventos, capacitações, audiências públicas e atividades de participação social.

### 4.5 Público Beneficiado
> Membros, servidores, estagiários e colaboradores do MPAC, gestores públicos, integrantes do Sistema de Justiça, órgãos de controle, instituições de ensino, organizações da sociedade civil, conselhos de direitos, lideranças comunitárias e a população acreana.

### 4.6 Vinculação orçamentária
- **PPA 2024–2027** — Eixo: Desenvolvimento Social e Segurança Pública · Programa Temático: Defesa da Cidadania e Direitos Humanos.
- **LOA 2026** — Órgão 304 · Programa de Trabalho `304.001.03.541.1474.12740000` — Defesa da Cidadania e Direitos Humanos.

---

## 5. Requisitos Funcionais por Aba

### 5.1 Aba **Visão Geral** (`index.html`) — P0

| ID | Requisito |
|---|---|
| VG-01 | Header institucional fixo com logo MPAC, navegação e botão "Área Interna" (desabilitado/placeholder no MVP). |
| VG-02 | Hero com render 3D de fundo, badge "PROJETO INSTITUCIONAL", título e subtítulo do projeto. |
| VG-03 | Quatro cards de KPI conforme §4.1, renderizados a partir de `projeto.json`. |
| VG-04 | Seção "Andamento das Etapas" com 5 anéis SVG animados (§4.2) + nota de rodapé. |
| VG-05 | Card "Cronograma de Marcos" com os 5 marcos e badges de status (§4.3). |
| VG-06 | Cards "Objetivo Geral" e "Público Beneficiado" com ícone e texto (§4.4, §4.5). |
| VG-07 | Barra de endereço no rodapé com pin e elementos gráficos diagonais. |
| VG-08 | Layout totalmente responsivo (breakpoints em §7). |
| VG-09 | Data da última atualização dos dados exibida no rodapé, lida de `projeto.json`. |

### 5.2 Aba **Cronograma** (`cronograma.html`) — P0

| ID | Requisito |
|---|---|
| CR-01 | Timeline vertical expandida dos 5 marcos, com descrição completa de cada fase. |
| CR-02 | Gráfico de Gantt simplificado em CSS Grid (sem biblioteca externa), eixo de Mai/2024 a Dez/2027, uma barra por marco, cor `--mpac-red` com opacidade proporcional ao status. |
| CR-03 | Marcador vertical de "hoje" sobre o Gantt, posicionado por JS a partir da data atual. |
| CR-04 | Tabela detalhada das 11 etapas da Meta 1 e das 11 etapas da Meta 2, com colunas Etapa / Descrição / Status. |
| CR-05 | Filtro por status (Todos / Concluído / Em andamento / Planejado) via botões-pill, com filtragem client-side. |
| CR-06 | Fallback tabular acessível para o Gantt (`<table>` visualmente oculta, disponível a leitores de tela). |

### 5.3 Aba **Financeiro** (`financeiro.html`) — P0

| ID | Requisito |
|---|---|
| FN-01 | Cards de topo: Valor Global R$ 70.000.000,00 · Meta 1 R$ 54.000.000,00 (77,14%) · Meta 2 R$ 16.000.000,00 (22,86%). |
| FN-02 | Gráfico de rosca Meta 1 × Meta 2 em SVG puro, com legenda e percentuais. |
| FN-03 | Tabela "Meta 1 — Construção do Auditório Institucional" com as 11 etapas e valores (§5.3.1). |
| FN-04 | Tabela "Meta 2 — Estruturação e Equipagem do Auditório" com as 11 etapas e valores (§5.3.2). |
| FN-05 | Barras horizontais proporcionais dentro de cada linha de tabela, indicando o peso da etapa sobre o total da meta. |
| FN-06 | Linhas de TOTAL destacadas em `--mpac-red-soft` com valor em negrito. |
| FN-07 | Bloco de vinculação orçamentária (PPA 2024–2027 e LOA 2026, §4.6). |
| FN-08 | Nota: *"Os valores poderão ser atualizados após a conclusão dos projetos executivos, orçamentos detalhados e demais estudos técnicos complementares."* |
| FN-09 | Formatação monetária brasileira via `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`. |
| FN-10 | Botão "Exportar CSV" gerando o arquivo client-side a partir de `projeto.json` (`Blob` + `URL.createObjectURL`). |

#### 5.3.1 Meta 1 — Construção do Auditório Institucional — R$ 54.000.000,00 (77,14%)
| Etapa | Descrição | Valor (R$) |
|---|---|---|
| 1.1 | Elaboração, compatibilização e projetos executivos | 2.500.000,00 |
| 1.2 | Serviços preliminares | 1.500.000,00 |
| 1.3 | Infraestrutura e fundações | 6.500.000,00 |
| 1.4 | Superestrutura | 10.500.000,00 |
| 1.5 | Cobertura e impermeabilização | 4.000.000,00 |
| 1.6 | Alvenarias, fechamentos e esquadrias | 6.000.000,00 |
| 1.7 | Instalações prediais (elétrica, hidrossanitária, incêndio, climatização, SPDA, lógica) | 10.000.000,00 |
| 1.8 | Revestimentos, forros e pintura | 6.000.000,00 |
| 1.9 | Urbanização, estacionamento e paisagismo | 3.000.000,00 |
| 1.10 | Acessibilidade, comunicação visual e comissionamento | 2.000.000,00 |
| 1.11 | Limpeza final, entrega técnica e recebimento | 2.000.000,00 |
| **Total** | | **54.000.000,00** |

#### 5.3.2 Meta 2 — Estruturação e Equipagem do Auditório — R$ 16.000.000,00 (22,86%)
| Etapa | Descrição | Valor (R$) |
|---|---|---|
| 2.1 | Mobiliário | 2.800.000,00 |
| 2.2 | Equipamentos audiovisuais | 3.500.000,00 |
| 2.3 | Sistema de sonorização | 2.000.000,00 |
| 2.4 | Tratamento acústico | 2.300.000,00 |
| 2.5 | Iluminação cênica | 1.200.000,00 |
| 2.6 | Tecnologia da informação e automação | 1.300.000,00 |
| 2.7 | Equipamentos complementares de climatização e automação | 900.000,00 |
| 2.8 | Segurança, CFTV e controle de acesso | 700.000,00 |
| 2.9 | Equipagem do palco, camarins e salas de apoio | 700.000,00 |
| 2.10 | Integração, programação e testes | 400.000,00 |
| 2.11 | Treinamento e operação assistida | 200.000,00 |
| **Total** | | **16.000.000,00** |

### 5.4 Abas de fase 2 (fora do MVP)
- **Execução Física** — galeria de fotos de obra por medição, comparativo render × executado, boletins de medição.
- **Documentos** — repositório de projetos executivos, edital, contrato, ART/RRT, relatórios de fiscalização.
- **Contato** — canal de dúvidas e ouvidoria, formulário com integração ao e-mail institucional.
- **Área Interna** — autenticação e CRUD para o Departamento de Arquitetura e Engenharia atualizar percentuais, marcos e valores.

No MVP esses itens de menu aparecem com estado `disabled` (`aria-disabled="true"`, `cursor: not-allowed`, opacidade 0.45) e tooltip *"Em breve"*.

---

## 6. Acervo Visual (renders 3D)

Arquivos em `assets/renders/`. Todos devem ser servidos em **AVIF + WebP com fallback JPEG**, via `<picture>`, com `loading="lazy"` (exceto o hero, que usa `fetchpriority="high"` e `loading="eager"`), `width`/`height` explícitos e `decoding="async"`.

| Arquivo | Descrição | Uso | Alt sugerido |
|---|---|---|---|
| `render-02-fachada-principal.png` | Fachada frontal do auditório com brise vertical em madeira e cobertura curva | **Hero da Visão Geral** | "Perspectiva ilustrativa da fachada principal do Auditório Institucional do MPAC" |
| `render-01-praca-civica.png` | Praça cívica de acesso com palmeiras, mastros de bandeira e placa MPAC | Hero da aba Cronograma / galeria | "Perspectiva ilustrativa da praça cívica de acesso ao auditório" |
| `render-04-praca-aerea.png` | Vista aérea da praça com o desenho do mapa do Acre em piso diferenciado | Card destaque na Visão Geral (fase 2) / galeria | "Vista aérea da praça cívica com piso representando o mapa do Estado do Acre" |
| `render-03-conjunto-entardecer.png` | Conjunto institucional integrado à sede, ao entardecer, vista da via pública | Hero da aba Financeiro / galeria | "Perspectiva ilustrativa do conjunto institucional integrado à nova sede do MPAC" |

Requisitos:
- Versões responsivas em 640w / 1280w / 1920w / 2560w declaradas em `srcset` + `sizes`.
- Peso máximo por render otimizado: 220 KB (formato AVIF, 1920w).
- Legendas discretas (`<figcaption>`) em `--fs-caption` quando exibidos em galeria: *"Perspectiva ilustrativa — imagem de projeto, sujeita a alterações."*
- Marca d'água ou aviso de "imagem ilustrativa" obrigatório para evitar interpretação como registro fotográfico da obra.

---

## 7. Requisitos Técnicos

### 7.1 Stack e estrutura de arquivos
Sem framework, sem bundler, sem `node_modules`. Publicável em qualquer servidor estático ou diretório do portal do MPAC.

```
/auditorio-mpac/
├── index.html                 # Visão Geral
├── cronograma.html
├── financeiro.html
├── css/
│   ├── tokens.css             # variáveis do design system (§3)
│   ├── base.css               # reset, tipografia, utilitários
│   └── components.css         # header, cards, anéis, timeline, tabelas
├── js/
│   ├── data-loader.js         # fetch de projeto.json + render dos componentes
│   ├── progress-ring.js       # cálculo de dasharray + IntersectionObserver
│   ├── charts.js              # rosca e barras em SVG puro
│   └── nav.js                 # menu mobile, estado ativo, filtros
├── data/
│   └── projeto.json           # FONTE ÚNICA DE VERDADE
├── assets/
│   ├── logo-mpac.svg
│   ├── icons.svg              # sprite SVG (símbolos referenciados por <use>)
│   └── renders/
└── fonts/
    └── inter-*.woff2
```

### 7.2 Modelo de dados — `data/projeto.json`

```json
{
  "meta": {
    "atualizadoEm": "2026-07-24",
    "fonte": "Departamento de Arquitetura e Engenharia — MPAC",
    "avisoDados": "Percentuais referentes ao acompanhamento conceitual do projeto. Dados ilustrativos."
  },
  "projeto": {
    "titulo": "Construção e Estruturação do Auditório Institucional do Ministério Público do Estado do Acre",
    "capacidade": 700,
    "areaAuditorioM2": 2000,
    "areaEventosM2": 850,
    "areaMultiusoM2": 1000,
    "areaTotalM2": 3850,
    "valorGlobal": 70000000,
    "endereco": "Rua Fátima Maia, nº 200, Jardim Europa, CEP 69.915-772, Rio Branco/AC"
  },
  "etapas": [
    { "id": "projetos",   "nome": "Projetos Executivos",       "percentual": 100 },
    { "id": "licitacao",  "nome": "Licitação",                 "percentual": 78 },
    { "id": "obra",       "nome": "Execução da Obra",          "percentual": 42 },
    { "id": "mobiliario", "nome": "Mobiliário e Equipamentos", "percentual": 18 },
    { "id": "paisagismo", "nome": "Paisagismo",                "percentual": 5 }
  ],
  "marcos": [
    { "ordem": 1, "titulo": "Projetos Executivos Concluídos", "status": "concluido",   "data": "2024-05", "rotulo": "Concluído em Mai/2024" },
    { "ordem": 2, "titulo": "Licitação da Obra",              "status": "concluido",   "data": "2025-03", "rotulo": "Concluído em Mar/2025" },
    { "ordem": 3, "titulo": "Execução da Obra",               "status": "andamento",   "data": null,      "rotulo": "Em andamento" },
    { "ordem": 4, "titulo": "Mobiliário e Equipamentos",      "status": "planejado",   "data": "2026-08", "rotulo": "Previsto para Início: Ago/2026" },
    { "ordem": 5, "titulo": "Paisagismo e Urbanização",       "status": "planejado",   "data": "2026-12", "rotulo": "Previsto para Início: Dez/2026" }
  ],
  "financeiro": {
    "metas": [
      {
        "id": "meta1",
        "nome": "Construção do Auditório Institucional",
        "valor": 54000000,
        "percentualGlobal": 77.14,
        "etapas": [
          { "codigo": "1.1", "descricao": "Elaboração, compatibilização e projetos executivos", "valor": 2500000 }
        ]
      }
    ]
  },
  "vinculacao": {
    "ppa": { "periodo": "2024-2027", "eixo": "Desenvolvimento Social e Segurança Pública", "programa": "Defesa da Cidadania e Direitos Humanos" },
    "loa": { "ano": 2026, "orgao": "304", "programaTrabalho": "304.001.03.541.1474.12740000", "especificacao": "Defesa da Cidadania e Direitos Humanos" }
  },
  "renders": []
}
```

> O array `financeiro.metas[].etapas` deve conter as 22 etapas completas conforme §5.3.1 e §5.3.2 — o trecho acima é abreviado apenas para ilustração.

### 7.3 Responsividade
| Breakpoint | Comportamento |
|---|---|
| ≥ 1280px | Layout do mockup: 4 KPIs em linha, 5 anéis em linha, faixa inferior 3 colunas |
| 900–1279px | KPIs 2×2; anéis em 3 + 2; faixa inferior 2 colunas |
| 600–899px | KPIs 2×2; anéis 2 por linha; faixa inferior empilhada; menu hambúrguer |
| < 600px | Tudo em coluna única; hero 300px; título do hero 32px; tabelas financeiras com scroll horizontal e primeira coluna fixa |

### 7.4 Performance
- CSS crítico do hero e header inline no `<head>`; demais folhas com `media="print" onload="this.media='all'"`.
- JavaScript em módulos ES nativos (`<script type="module" defer>`).
- Sem dependências de terceiros — sem jQuery, sem Chart.js, sem CDN externo.
- `content-visibility: auto` nas seções abaixo da dobra.
- Cache HTTP: 1 ano para assets versionados por hash; `no-cache` para `projeto.json`.

### 7.5 Compatibilidade
Chrome/Edge 100+, Firefox 100+, Safari 15.4+. Degradação graciosa em navegadores sem `IntersectionObserver` (anéis renderizam no estado final).

### 7.6 Segurança e conformidade
- CSP restritiva: `default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'`.
- Sem cookies, sem analytics de terceiros, sem tracking — coleta zero de dados pessoais (LGPD).
- HTTPS obrigatório; headers `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- Rodapé com selo de conformidade LAI e link para a Ouvidoria do MPAC.

---

## 8. Governança do Conteúdo

| Item | Definição |
|---|---|
| **Responsável pelos dados** | Departamento de Arquitetura e Engenharia — MPAC |
| **Frequência de atualização** | Mensal, após o boletim de medição da fiscalização |
| **Fluxo no MVP** | Edição manual de `data/projeto.json` + commit/deploy |
| **Fluxo na fase 2** | Formulário autenticado na Área Interna gravando o mesmo JSON |
| **Rastreabilidade** | Campo `meta.atualizadoEm` exibido no rodapé de todas as páginas |
| **Aviso obrigatório** | Enquanto os percentuais forem conceituais, manter a nota de dados ilustrativos em destaque |

---

## 9. Critérios de Aceite

- [ ] As três páginas do MVP renderizam corretamente e são navegáveis entre si.
- [ ] Nenhum valor de conteúdo está hard-coded no HTML — tudo vem de `projeto.json`.
- [ ] Os cinco anéis exibem exatamente 100 / 78 / 42 / 18 / 5% e animam ao entrar na viewport.
- [ ] Todos os valores financeiros somam R$ 54.000.000,00 (Meta 1), R$ 16.000.000,00 (Meta 2) e R$ 70.000.000,00 (total) — validado por teste automatizado simples em JS.
- [ ] Valores monetários formatados em pt-BR com separador de milhar por ponto e decimal por vírgula.
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (mobile).
- [ ] Zero erros no validador do W3C (HTML e CSS).
- [ ] Navegação completa por teclado, com foco visível em todos os elementos interativos.
- [ ] Teste com leitor de tela (NVDA ou VoiceOver) nos anéis de progresso e nas tabelas financeiras.
- [ ] Renderização correta em 360×640, 768×1024, 1440×900 e 1920×1080.
- [ ] Renders exibidos com legenda de "imagem ilustrativa" e `alt` descritivo.
- [ ] Página funcional com JavaScript desabilitado ao menos para o conteúdo textual essencial (progressive enhancement).

---

## 10. Roadmap

| Fase | Entrega | Prazo sugerido |
|---|---|---|
| **F1 — MVP** | Design system em CSS, Visão Geral, Cronograma, Financeiro, `projeto.json` | 3 semanas |
| **F2 — Transparência ampliada** | Aba Documentos, aba Contato, exportação em PDF | +3 semanas |
| **F3 — Execução Física** | Galeria de obra por medição, comparativo render × executado | +4 semanas |
| **F4 — Área Interna** | Autenticação institucional e CRUD dos indicadores | +5 semanas |

---

## 11. Riscos e Premissas

| Risco | Impacto | Mitigação |
|---|---|---|
| Percentuais ilustrativos serem lidos como dados oficiais | Alto — risco reputacional e de controle | Nota de aviso persistente; substituir por medições oficiais assim que disponíveis |
| Renders 3D confundidos com fotos da obra executada | Médio | Legenda obrigatória de "perspectiva ilustrativa" em todas as ocorrências |
| `projeto.json` desatualizado | Médio | Exibir `atualizadoEm` no rodapé e alertar visualmente se > 60 dias |
| Ausência de processo definido de atualização | Alto | Formalizar responsabilidade no Departamento de Arquitetura e Engenharia (§8) |
| Valores sujeitos a revisão após projetos executivos | Médio | Nota explícita na aba Financeiro (FN-08) |

**Premissas:** o MPAC hospedará a página em infraestrutura própria; a identidade visual e o logo em SVG serão fornecidos pela Assessoria de Comunicação; os renders 3D pertencem ao acervo do projeto e têm autorização de uso público.

---

## Anexos
- `assets/mockup-dashboard.png` — mockup de referência aprovado
- `assets/renders/` — quatro perspectivas 3D do empreendimento
- *Diagramação MPAC com capa.pdf* — documento institucional fonte
