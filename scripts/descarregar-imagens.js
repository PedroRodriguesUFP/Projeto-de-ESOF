// Descarrega uma vez as imagens das obras (Wikimedia Commons) para public/img/obras/,
// para que a aplicação as mostre sem rede (galerias do piso -1, US-02 / RNF01).
// Uso: npm run imagens            (só descarrega as que faltam)
//      npm run imagens -- --forcar (volta a descarregar todas)
// Zero dependências: usa o fetch nativo do Node 20+.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.cwd();
const PASTA = join(RAIZ, 'public', 'img', 'obras');
const API = 'https://commons.wikimedia.org/w/api.php';
const LARGURA = 900;
const CABECALHOS = { 'User-Agent': 'MNSR-Digital/1.0 (projeto academico Engenharia de Software, UFP)' };
const forcar = process.argv.includes('--forcar');

// Ficheiro exato no Commons quando conhecido; caso contrário, uma pesquisa.
const FONTES = [
  { id: 'O01', titulo: 'O Desterrado', pesquisa: ['O Desterrado Soares dos Reis', 'Desterrado Soares Reis', 'Soares dos Reis Desterrado escultura', 'Desterrado escultura'] },
  { id: 'O02', titulo: 'Conde de Ferreira', pesquisa: ['Conde de Ferreira Soares dos Reis', 'Soares dos Reis Conde Ferreira', 'Conde de Ferreira estátua', 'Estátua do Conde de Ferreira'] },
  { id: 'O03', titulo: 'Autorretrato', ficheiro: 'Self-portrait (Aurelia de Sousa).jpg' },
  { id: 'O04', titulo: 'Casas Brancas de Capri', ficheiro: 'Pousao casas-brancas1.jpg' },
  { id: 'O05', titulo: 'Esperando o Sucesso', ficheiro: 'Pousao - Esperando o sucesso.jpg' },
  { id: 'O06', titulo: 'Cecília', ficheiro: 'Pousao cecilia1.jpg' },
  { id: 'O07', titulo: 'Céfalo e Prócris', ficheiro: 'Porto 2016-17 Cephalus and Procris (30294514614).jpg' },
  { id: 'O08', titulo: 'Retrato do Escultor Soares dos Reis', ficheiro: 'Escultor Soares dos Reis (1882) - Marques de Oliveira.png' },
  { id: 'O09', titulo: 'Senhora Vestida de Preto', manual: true }, // imagem colocada pela equipa,
  { id: 'O10', titulo: 'Janela das Persianas Azuis', pesquisa: ['Pousão Janela das persianas azuis', 'Pousao persianas azuis', 'Henrique Pousão janela'] },
  { id: 'O11', titulo: 'Colheita – Ceifeiras', pesquisa: ['Silva Porto Colheita Ceifeiras', 'Silva Porto ceifeiras', 'Silva Porto colheita'] },
];

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// A Wikimedia responde 429 quando há pedidos a mais seguidos: espera e tenta outra vez.
async function pedir(url, tentativas = 6) {
  for (let i = 1; i <= tentativas; i += 1) {
    const resposta = await fetch(url, { headers: CABECALHOS });
    if (resposta.status !== 429 && resposta.status !== 503) return resposta;
    const segundos = Number(resposta.headers.get('retry-after')) || 2 ** i;
    console.log(`  … servidor ocupado (${resposta.status}), nova tentativa em ${segundos}s`);
    await esperar(segundos * 1000);
  }
  throw new Error('servidor continua ocupado, tenta de novo daqui a uns minutos');
}

const semHtml = (texto = '') => texto.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

function parametrosBase() {
  return new URLSearchParams({
    action: 'query', format: 'json', prop: 'imageinfo',
    iiprop: 'url|extmetadata', iiurlwidth: String(LARGURA),
  });
}

async function consultar(params) {
  const resposta = await pedir(`${API}?${params}`);
  if (!resposta.ok) throw new Error(`API respondeu ${resposta.status}`);
  const paginas = Object.values((await resposta.json()).query?.pages ?? {});
  return paginas.sort((a, b) => (a.index ?? 0) - (b.index ?? 0)).find((p) => p.imageinfo && /\.(jpe?g|png|webp|tiff?)$/i.test(p.title)) ?? null;
}

async function obterInfo(fonte) {
  let pagina = null;
  if (fonte.ficheiro) {
    const params = parametrosBase();
    params.set('titles', `File:${fonte.ficheiro}`);
    pagina = await consultar(params);
  } else {
    for (const termo of fonte.pesquisa) {
      const params = parametrosBase();
      params.set('generator', 'search');
      params.set('gsrsearch', termo);
      params.set('gsrnamespace', '6');
      params.set('gsrlimit', '5');
      pagina = await consultar(params);
      if (pagina) break; // só aceita imagens (jpg, png, webp, tiff), não PDFs nem vídeos
      await esperar(500);
    }
  }
  if (!pagina) throw new Error('imagem não encontrada no Commons — coloca uma imagem à mão com este nome');
  const info = pagina.imageinfo[0];
  const meta = info.extmetadata ?? {};
  return {
    nome: pagina.title.replace(/^File:/, ''),
    url: info.thumburl ?? info.url,
    pagina: info.descriptionurl,
    autor: semHtml(meta.Artist?.value) || 'desconhecido',
    licenca: semHtml(meta.LicenseShortName?.value) || 'ver página',
  };
}

mkdirSync(PASTA, { recursive: true });
const CAMINHO_CREDITOS = join(PASTA, 'CREDITOS.md');

// Linhas já existentes (ex.: imagens colocadas à mão) são mantidas, salvo se forem atualizadas.
const creditos = new Map();
if (existsSync(CAMINHO_CREDITOS)) {
  for (const linha of readFileSync(CAMINHO_CREDITOS, 'utf-8').split('\n')) {
    const id = linha.match(/^\| (O\d{2}) \|/)?.[1];
    if (id) creditos.set(id, linha);
  }
}
let falhas = 0;

for (const fonte of FONTES) {
  const destino = join(PASTA, `${fonte.id}.jpg`);
  if (fonte.manual) {
    console.log(`• ${fonte.id} imagem colocada à mão (${existsSync(destino) ? 'presente' : 'EM FALTA'})`);
    continue;
  }
  try {
    const info = await obterInfo(fonte);
    if (forcar || !existsSync(destino)) {
      const imagem = await pedir(info.url);
      if (!imagem.ok) throw new Error(`download respondeu ${imagem.status}`);
      writeFileSync(destino, Buffer.from(await imagem.arrayBuffer()));
      console.log(`✔ ${fonte.id} ${fonte.titulo} ← ${info.nome}`);
    } else {
      console.log(`• ${fonte.id} já existe (usa --forcar para substituir)`);
    }
    if (!fonte.ficheiro) console.log(`  ↳ escolhida por pesquisa: confirma que é mesmo «${fonte.titulo}»`);
    creditos.set(fonte.id, `| ${fonte.id} | ${fonte.titulo} | [${info.nome}](${info.pagina}) | ${info.autor} | ${info.licenca} |`);
  } catch (erro) {
    falhas += 1;
    console.warn(`✘ ${fonte.id} ${fonte.titulo}: ${erro.message}`);
  }
  await esperar(1500); // pausa entre obras para não sobrecarregar a Wikimedia
}

writeFileSync(CAMINHO_CREDITOS, [
  '# Créditos das imagens',
  '',
  'Imagens obtidas no Wikimedia Commons por `npm run imagens`. As obras estão no domínio público;',
  'as fotografias seguem a licença indicada. Confirmem que cada imagem corresponde à obra certa.',
  '',
  '| Obra | Título | Ficheiro original | Autor / fotógrafo | Licença |',
  '| --- | --- | --- | --- | --- |',
  ...[...creditos.keys()].sort().map((id) => creditos.get(id)),
  '',
].join('\n'));

console.log(falhas ? `\n${falhas} imagem(ns) por obter: a app mostra uma imagem genérica.` : '\nTodas as imagens prontas para uso offline.');
