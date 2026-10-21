import { ObraRepositoryMemoria } from '../src/dados/ObraRepositoryMemoria.js';
import { ProgressoRepositoryMemoria } from '../src/dados/ProgressoRepositoryMemoria.js';
import { RoteiroService } from '../src/servico/RoteiroService.js';
import { CacaTesouroService } from '../src/servico/CacaTesouroService.js';
import { gerarIdAnonimo } from '../src/dominio/Visitante.js';

const $ = (selector) => document.querySelector(selector);
const escapeHTML = (str) => String(str ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let obrasRepo, progressoRepo, roteiros, caca, idAnonimo, minutos = 30;

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
  const result = $('#routeResult'); result.innerHTML = '<p class="muted">A gerar roteiro…</p>';
  try {
    const roteiro = await roteiros.gerarRoteiro(minutos);
    result.innerHTML = `<div class="route-header"><h2>O teu roteiro</h2><span class="route-total">${roteiro.duracaoTotal()} de ${minutos} min</span></div>${roteiro.paragens.map(p => `<div class="stop"><div class="stop-number">${p.ordem}</div><div><h3>${escapeHTML(p.obra.titulo)}</h3><p>${escapeHTML(p.obra.autor)} · Sala ${escapeHTML(p.obra.salaId)} · Piso ${escapeHTML(p.obra.piso)} · ${p.minutos} min</p></div></div>`).join('')}`;
  } catch (err) { result.innerHTML = `<div class="feedback error">${escapeHTML(err.message)}</div>`; }
});
function renderWorks(obras, salas) {
  let q = $('#searchWorks').value.trim().toLocaleLowerCase('pt-PT');
  const filtered = obras.filter(o => (`${o.titulo} ${o.autor}`).toLocaleLowerCase('pt-PT').includes(q));
  $('#worksCount').textContent = `${filtered.length} obras`;
  $('#worksGrid').innerHTML = filtered.map(o => `<article class="work"><div class="work-art" aria-hidden="true">◒</div><div class="work-body"><small>${escapeHTML(salas.find(s => s.id === o.salaId)?.nome ?? o.salaId)}</small><h3>${escapeHTML(o.titulo)}</h3><p>${escapeHTML(o.autor)} · ${escapeHTML(o.minutosVisita)} min</p><p>${escapeHTML(o.descricao)}</p></div></article>`).join('') || '<p>Nenhuma obra encontrada.</p>';
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
  $('#reward').textContent = premio ? `✦ ${premio.descricao} (exemplo, não resgatável)` : '♧ Recompensa bloqueada';
}
$('#submitQR').addEventListener('click', async () => {
  const codigo = $('#qrCode').value.trim().toUpperCase();
  const out = $('#qrFeedback');
  if (!codigo) { out.innerHTML = '<div class="feedback error">Introduz um código QR.</div>'; return; }
  try {
    const r = await caca.lerQR(idAnonimo,codigo);
    out.innerHTML = `<div class="feedback">${r.novaPista ? 'Pista desbloqueada!' : 'Já tinhas encontrado esta pista.'} ${escapeHTML(r.enigma)}</div>`;
    $('#qrCode').value = '';
    await updateProgress();
  } catch(err) {out.innerHTML = `<div class="feedback error">${escapeHTML(err.message)}</div>`;}
});
$('#qrCode').addEventListener('keydown', e => {if(e.key === 'Enter') $('#submitQR').click();});
$('#resetHunt').addEventListener('click', async () => {
  idAnonimo = gerarIdAnonimo();
  progressoRepo = new ProgressoRepositoryMemoria();
  caca = new CacaTesouroService({obraRepository:obrasRepo, progressoRepository:progressoRepo});
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
  caca = new CacaTesouroService({obraRepository:obrasRepo,progressoRepository:progressoRepo});
  idAnonimo = gerarIdAnonimo();
  $('#searchWorks').addEventListener('input', () => renderWorks(catalogo.obras.filter(o => obrasRepo.salas.get(o.salaId)?.estaDisponivel()),catalogo.salas));
  renderWorks(catalogo.obras.filter(o => obrasRepo.salas.get(o.salaId)?.estaDisponivel()), catalogo.salas);
  await updateProgress();
} catch(err) {
  $('#routeResult').innerHTML = `<div class="feedback error">Erro a carregar aplicação: ${escapeHTML(err.message)}. Inicia com npm start.</div>`;
  console.error(err);
}
