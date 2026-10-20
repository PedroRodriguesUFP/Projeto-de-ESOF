// M4 (OA7): Logging estruturado, observabilidade básica e proteção de privacidade (RNF03).

export const NivelLog = Object.freeze({
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40,
  SILENT: 100,
});

const CAMPOS_SENSIVEIS = new Set(['nome', 'email', 'telefone', 'nif', 'password', 'token', 'apikey']);

/**
 * Mascara um UUID/ID anónimo para diagnóstico seguro nos logs (ex.: "f47ac10b-... -> anon-f47ac10b")
 * e remove quaisquer campos pessoais caso sejam passados acidentalmente (RNF03).
 */
export function sanitizarContexto(contexto = {}) {
  const seguro = {};
  for (const [chave, valor] of Object.entries(contexto)) {
    if (CAMPOS_SENSIVEIS.has(chave.toLowerCase())) {
      seguro[chave] = '[REDACTED_RGPD]';
    } else if (chave === 'idAnonimo' && typeof valor === 'string') {
      seguro[chave] = `anon-${valor.slice(0, 8)}`;
    } else {
      seguro[chave] = valor;
    }
  }
  return seguro;
}

export class Logger {
  constructor({ componente = 'AppMNSR', nivelMinimo = NivelLog.INFO, sink = null } = {}) {
    this.componente = componente;
    this.nivelMinimo = nivelMinimo;
    this.registos = []; // buffer em memória para diagnóstico e testes
    this.sink = sink;   // função opcional (ex.: console.log) para output externo
  }

  _registar(nivelNome, nivelValor, evento, contexto = {}) {
    if (nivelValor < this.nivelMinimo) return null;

    const entrada = {
      timestamp: new Date().toISOString(),
      nivel: nivelNome,
      componente: this.componente,
      evento,
      contexto: sanitizarContexto(contexto),
    };

    this.registos.push(entrada);
    if (this.sink) {
      this.sink(JSON.stringify(entrada));
    }
    return entrada;
  }

  debug(evento, contexto) {
    return this._registar('DEBUG', NivelLog.DEBUG, evento, contexto);
  }

  info(evento, contexto) {
    return this._registar('INFO', NivelLog.INFO, evento, contexto);
  }

  warn(evento, contexto) {
    return this._registar('WARN', NivelLog.WARN, evento, contexto);
  }

  error(evento, contexto) {
    return this._registar('ERROR', NivelLog.ERROR, evento, contexto);
  }

  /**
   * Mede o tempo de execução de uma operação assíncrona (profiling/diagnóstico RNF01).
   */
  async medirTempo(evento, fn, contextoBase = {}) {
    const inicio = performance.now();
    try {
      const resultado = await fn();
      const duracaoMs = Number((performance.now() - inicio).toFixed(2));
      this.info(evento, { ...contextoBase, duracaoMs, sucesso: true });
      return resultado;
    } catch (erro) {
      const duracaoMs = Number((performance.now() - inicio).toFixed(2));
      this.warn(`${evento}_FALHOU`, {
        ...contextoBase,
        duracaoMs,
        erroTipo: erro.name || 'Error',
        erroMensagem: erro.message,
      });
      throw erro;
    }
  }
}

export const loggerPadrao = new Logger({
  componente: 'MNSR-Core',
  nivelMinimo: process.env.LOG_LEVEL ? (NivelLog[process.env.LOG_LEVEL] ?? NivelLog.INFO) : NivelLog.SILENT,
});