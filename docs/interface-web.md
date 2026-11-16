# Interface web MNSR Digital

## Integração no repositório

A interface já está integrada: os ficheiros estão em `public/`, o servidor em `server.js` e o comando `npm start` já existe no `package.json`. Não é preciso copiar nada.

## Executar

```bash
npm run imagens   # só na primeira vez, com internet: guarda as fotos em public/img/obras/
npm start
```

Abrir `http://localhost:3000` no navegador. **Não abras `index.html` diretamente**: os módulos e o catálogo devem ser servidos por HTTP.

## Funcionalidades

- Início com navegação responsiva.
- Roteiros de 30, 60 ou 90 min diretamente com `RoteiroService` existente.
- Catálogo de 11 obras reais do acervo (Soares dos Reis, Aurélia de Souza, Henrique Pousão, Marques de Oliveira, Silva Porto), com imagem guardada localmente para funcionar no piso -1 sem rede. Exclui salas fechadas.
- Caça ao tesouro com códigos fictícios `QR-001`, `QR-002`, `QR-003`, usando `CacaTesouroService` existente.
- O assistente IA aparece identificado como não implementado.

## Limitações importantes

- Demonstração, não PWA completa: sem IndexedDB, Service Worker ou sincronização real.
- Progresso da caça fica apenas em memória: ao atualizar a página, perde-se.
- Não existe leitura por câmara; os códigos QR são escritos à mão.
- As obras são reais, mas as salas, os tempos de visita, as pistas e a recompensa são ilustrativos; a recompensa não é válida no museu.
- As imagens vêm do Wikimedia Commons (obras em domínio público); os créditos ficam em `public/img/obras/CREDITOS.md`. Se uma imagem faltar, aparece uma imagem genérica.
- O CSS utiliza fontes Google Fonts online, com fallbacks locais.

## Comandos de verificação

```bash
npm run lint
npm test
npm run test:ci
```

A pasta `public/` contém código browser que o `scripts/static-analysis.js` atual ainda não analisa (o lint existente cobre src/tests/scripts). Acrescentar verificação de frontend noutra iteração.
