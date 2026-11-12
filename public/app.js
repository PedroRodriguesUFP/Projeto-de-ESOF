import { ObraRepositoryMemoria } from '../src/dados/ObraRepositoryMemoria.js';
import { ProgressoRepositoryMemoria } from '../src/dados/ProgressoRepositoryMemoria.js';
import { RoteiroService } from '../src/servico/RoteiroService.js';
import { CacaTesouroService } from '../src/servico/CacaTesouroService.js';
import { gerarIdAnonimo } from '../src/dominio/Visitante.js';

const $ = (selector) => document.querySelector(selector);
const escapeHTML = (str) => String(str ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let obrasRepo, progressoRepo, roteiros, caca, idAnonimo, minutos = 30;

function obterPlaceholderSVG(titulo) {
  const iniciais = String(titulo || 'MNSR').slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="#1e4638"/><circle cx="150" cy="100" r="55" fill="#c89d54" opacity="0.85"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="32" font-weight="bold">${escapeHTML(iniciais)}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function pagina(nome) {
  document.querySelectorAll('.page').forEach(el => el.classList.toggle('active', el.id === `page-${nome}`));
  document.querySelectorAll('.nav').forEach(el => el.classList.toggle('active', el.dataset.page === nome));
  $('#sidebar').classList.remove('open');
  scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('[data-page]').forEach(b => b.addEventListener('click', () => pagina(b.dataset.page)));
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => pagina(b.dataset.go)));
$('#menuToggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));

document.querySelectorAll('.duration').forEach(b => b.addEventListener('click', () => {
  minutos = Number(b.dataset.min);
  document.querySelectorAll('.duration').forEach(x => x.classList.toggle('active', x === b));
}));

$('#generate').addEventListener('click', async () => {
  const result = $('#routeResult');
  result.innerHTML = '<p class="muted">A gerar roteiro…</p>';
  try {
    const roteiro = await roteiros.gerarRoteiro(minutos);
    result.innerHTML = `
      <div class="route-header">
        <h2>O teu roteiro no MNSR</h2>
        <span class="route-total">${roteiro.duracaoTotal()} de ${minutos} min (${roteiro.paragens.length} obras)</span>
      </div>
      ${roteiro.paragens.map(p => {
        const fallback = obterPlaceholderSVG(p.obra.titulo);
        const imgSrc = p.obra.imagemUrl ? escapeHTML(p.obra.imagemUrl) : fallback;
        return `
          <div class="stop" style="display:flex; align-items:center; gap:14px;">
            <div class="stop-number">${p.ordem}</div>
            <img
              src="${imgSrc}"
              alt="${escapeHTML(p.obra.titulo)}"
              referrerpolicy="no-referrer"
              onerror="this.onerror=null;this.src='${fallback}';"
              style="width:56px; height:56px; object-fit:cover; border-radius:8px; flex-shrink:0; border:1px solid rgba(0,0,0,0.1); background:#1e4638;"
            />
            <div style="flex:1;">
              <h3 style="margin:0 0 4px 0;">${escapeHTML(p.obra.titulo)}</h3>
              <p style="margin:0;">${escapeHTML(p.obra.autor)} · Sala ${escapeHTML(p.obra.salaId)} · Piso ${escapeHTML(p.obra.piso)} · <strong>${p.minutos} min</strong></p>
            </div>
          </div>
        `;
      }).join('')}
    `;
  } catch (err) {
    result.innerHTML = `<div class="feedback error">${escapeHTML(err.message)}</div>`;
  }
});

function renderWorks(obras, salas) {
  let q = $('#searchWorks').value.trim().toLocaleLowerCase('pt-PT');
  const filtered = obras.filter(o => (`${o.titulo} ${o.autor}`).toLocaleLowerCase('pt-PT').includes(q));
  $('#worksCount').textContent = `${filtered.length} obras`;
  $('#worksGrid').innerHTML = filtered.map(o => {
    const fallback = obterPlaceholderSVG(o.titulo);
    const imgSrc = o.imagemUrl ? escapeHTML(o.imagemUrl) : fallback;
    const nomeSala = salas.find(s => s.id === o.salaId)?.nome ?? o.salaId;
    return `
      <article class="work">
        <div class="work-art" style="padding:0; overflow:hidden; position:relative;">
          <img
            src="${imgSrc}"
            alt="${escapeHTML(o.titulo)}"
            referrerpolicy="no-referrer"
            onerror="this.onerror=null;this.src='${fallback}';"
            style="width:100%; height:100%; min-height:180px; max-height:210px; object-fit:cover; display:block;"
          />
        </div>
        <div class="work-body">
          <small>${escapeHTML(nomeSala)}</small>
          <h3>${escapeHTML(o.titulo)}</h3>
          <p><strong>${escapeHTML(o.autor)}</strong> · ${escapeHTML(o.minutosVisita)} min</p>
          <p>${escapeHTML(o.descricao)}</p>
        </div>
      </article>
    `;
  }).join('') || '<p>Nenhuma obra encontrada.</p>';
}

async function updateProgress() {
  const current = await progressoRepo.obter(idAnonimo);
  const total = await obrasRepo.totalPistas();
  const done = current?.pistasConcluidas ?? 0;
  $('#doneCount').textContent = done;
  $('#totalCount').textContent = `/ ${total} pistas`;
  $('#progressBar').style.width = `${total ? done / total * 100 : 0}%`;
  $('#progressText').textContent = done === total ? 'Fantástico! Completaste o desafio.' : `Faltam ${total - done} pistas para concluir.`;
  const premio = done === total ? await obrasRepo.obterPremio() : null;
  $('#reward').classList.toggle('unlocked', Boolean(premio));
  $('#reward').textContent = premio ? `✦ ${premio.descricao}` : '♧ Recompensa bloqueada';
}

$('#submitQR').addEventListener('click', async () => {
  const codigo = $('#qrCode').value.trim().toUpperCase();
  const out = $('#qrFeedback');
  if (!codigo) { out.innerHTML = '<div class="feedback error">Introduz um código QR.</div>'; return; }
  try {
    const r = await caca.lerQR(idAnonimo, codigo);
    out.innerHTML = `<div class="feedback">${r.novaPista ? 'Pista desbloqueada!' : 'Já tinhas encontrado esta pista.'} ${escapeHTML(r.enigma)}</div>`;
    $('#qrCode').value = '';
    await updateProgress();
  } catch (err) {
    out.innerHTML = `<div class="feedback error">${escapeHTML(err.message)}</div>`;
  }
});

$('#qrCode').addEventListener('keydown', e => { if (e.key === 'Enter') $('#submitQR').click(); });

$('#resetHunt').addEventListener('click', async () => {
  idAnonimo = gerarIdAnonimo();
  progressoRepo = new ProgressoRepositoryMemoria();
  caca = new CacaTesouroService({ obraRepository: obrasRepo, progressoRepository: progressoRepo });
  $('#qrFeedback').innerHTML = '';
  await updateProgress();
});

try {
  const res = await fetch('/data/catalogo-exemplo.json');
  if (!res.ok) throw new Error('Catálogo indisponível');
  const catalogo = await res.json();
  obrasRepo = new ObraRepositoryMemoria(catalogo);
  progressoRepo = new ProgressoRepositoryMemoria();
  roteiros = new RoteiroService(obrasRepo);
  caca = new CacaTesouroService({ obraRepository: obrasRepo, progressoRepository: progressoRepo });
  idAnonimo = gerarIdAnonimo();
  const obrasDisponiveis = await obrasRepo.listarObrasDisponiveis();
  $('#searchWorks').addEventListener('input', () => renderWorks(obrasDisponiveis, catalogo.salas));
  renderWorks(obrasDisponiveis, catalogo.salas);
  await updateProgress();
} catch (err) {
  $('#routeResult').innerHTML = `<div class="feedback error">Erro a carregar aplicação: ${escapeHTML(err.message)}. Inicia com npm start.</div>`;
  console.error(err);
}