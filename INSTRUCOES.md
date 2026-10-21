# Interface web MNSR Digital

## Instalação no repositório existente

Copia as pastas `public/` e o ficheiro `server.js` para a raiz de `Projeto-de-ESOF/`. **Não substituas `src/`, `data/` ou os testes.**

No `package.json` existente, adiciona apenas dentro de `scripts`:

```json
"start": "node server.js"
```

Se a linha anterior no JSON não for a última, confirma as vírgulas.

## Executar

```bash
npm start
```

Abrir `http://localhost:3000` no navegador. **Não abras `index.html` diretamente**: os módulos e o catálogo devem ser servidos por HTTP.

## Funcionalidades

- Início com navegação responsiva.
- Roteiros de 30, 60 ou 90 min diretamente com `RoteiroService` existente.
- Catálogo de obras de exemplo filtrável (exclui salas fechadas).
- Caça ao tesouro com códigos fictícios `QR-001`, `QR-002`, `QR-003`, usando `CacaTesouroService` existente.
- O assistente IA aparece identificado como não implementado.

## Limitações importantes

- Demonstração, não PWA completa: sem IndexedDB, Service Worker ou sincronização real.
- Progresso da caça fica apenas em memória: ao atualizar a página, perde-se.
- Não existe leitura por câmara; os códigos QR são escritos à mão.
- Dados de catálogo e recompensa são fictícios; a recompensa não é válida no museu.
- Interface ilustrativa, sem imagens oficiais do acervo.
- O CSS utiliza fontes Google Fonts online, com fallbacks locais.

## Comandos de verificação

```bash
npm run lint
npm test
npm run test:ci
```

A pasta `public/` contém código browser que o `scripts/static-analysis.js` atual ainda não analisa (o lint existente cobre src/tests/scripts). Acrescentar verificação de frontend noutra iteração.
