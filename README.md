# Dashboard do Auditório Institucional MPAC

Portal estático de transparência e monitoramento do projeto, desenvolvido em HTML, CSS e JavaScript puro a partir do PRD institucional.

## Executar localmente

Na raiz deste diretório:

```bash
python3 -m http.server 4173
```

Acesse `http://localhost:4173/`. O servidor HTTP é necessário porque os dados são carregados de `data/projeto.json`.

## Atualizar conteúdo

Todo o conteúdo variável está centralizado em `data/projeto.json`. Após uma atualização mensal:

1. altere percentuais, marcos e valores;
2. atualize `meta.atualizadoEm`;
3. execute `node tests/data.test.mjs`;
4. valide as três páginas no navegador.

## Páginas

- `index.html` — visão geral, indicadores e andamento;
- `cronograma.html` — linha do tempo, Gantt e filtros;
- `financeiro.html` — composição do orçamento e exportação CSV.

Os renders possuem variantes JPEG e WebP em 640, 1280 e 1672 pixels. Não há framework, dependência externa, cookies ou coleta de dados pessoais.
