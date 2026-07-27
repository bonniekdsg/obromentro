import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../data/projeto.json', import.meta.url), 'utf8'));
const [meta1, meta2] = data.financeiro.metas;
const sum = (items) => items.reduce((total, item) => total + item.valor, 0);

assert.equal(data.etapas.length, 5, 'devem existir cinco indicadores de andamento');
assert.deepEqual(data.etapas.map((item) => item.percentual), [100, 78, 42, 18, 5]);
assert.equal(meta1.etapas.length, 11, 'a Meta 1 deve possuir 11 etapas');
assert.equal(meta2.etapas.length, 11, 'a Meta 2 deve possuir 11 etapas');
assert.equal(sum(meta1.etapas), 54_000_000, 'a Meta 1 deve totalizar R$ 54 milhões');
assert.equal(sum(meta2.etapas), 16_000_000, 'a Meta 2 deve totalizar R$ 16 milhões');
assert.equal(meta1.valor + meta2.valor, data.projeto.valorGlobal, 'as metas devem somar o valor global');

console.log('Dados validados: 5 etapas, 22 itens financeiros e totais consistentes.');
