// Demonstração executável do núcleo (M3): npm run demo
import { readFileSync } from 'node:fs';
import { ObraRepositoryMemoria } from './dados/ObraRepositoryMemoria.js';
import { ProgressoRepositoryMemoria } from './dados/ProgressoRepositoryMemoria.js';
import { RoteiroService } from './servico/RoteiroService.js';
import { CacaTesouroService } from './servico/CacaTesouroService.js';
import { SincronizacaoService } from './servico/SincronizacaoService.js';
import { gerarIdAnonimo } from './dominio/Visitante.js';

const catalogo = JSON.parse(readFileSync(new URL('../data/catalogo-exemplo.json', import.meta.url), 'utf-8'));
const obraRepository = new ObraRepositoryMemoria(catalogo);
const progressoRepository = new ProgressoRepositoryMemoria();

console.log('=== US01: roteiro de 30 minutos ===');
const roteiro = await new RoteiroService(obraRepository).gerarRoteiro(30);
for (const p of roteiro.paragens) {
  console.log(`${p.ordem}. ${p.obra.titulo} (sala ${p.obra.salaId}, piso ${p.obra.piso}) - ${p.minutos} min`);
}
console.log(`Total: ${roteiro.duracaoTotal()} min`);

console.log('\n=== US02/US04: caça ao tesouro offline ===');
const caca = new CacaTesouroService({ obraRepository, progressoRepository });
const id = gerarIdAnonimo();
let redeDisponivel = false;
const remoto = {
  async enviarProgresso(dados) {
    if (!redeDisponivel) throw new Error('Sem rede');
    console.log('  [servidor] progresso recebido:', JSON.stringify(dados));
  },
};
const sync = new SincronizacaoService({ progressoRepository, remoto });

for (const codigo of ['QR-001', 'QR-XXX', 'QR-002', 'QR-003']) {
  try {
    const r = await caca.lerQR(id, codigo);
    console.log(`${codigo}: ok (${r.progresso.pistasConcluidas}/${r.progresso.totalPistas})${r.completo ? ' -> ' + r.premio.descricao : ''}`);
  } catch (e) {
    console.log(`${codigo}: ${e.message}`);
  }
}
console.log('Sincronizar sem rede:', await sync.sincronizar());
redeDisponivel = true;
console.log('Sincronizar com rede:', await sync.sincronizar());
