## 1. Enunciado do Cenário Prático e Código Legado

No âmbito do desenvolvimento da aplicação móvel do Museu Nacional Soares dos Reis (MNSR), a equipa de desenvolvimento do projeto foi encarregada de implementar o módulo de venda de bilhetes com descontos especiais (estudantes UFP, famílias e seniores) e envio de confirmação por SMS/Email, integrado com uma Gateway de Pagamentos externa (ex.: SIBS/MBWay).

Na Sprint anterior, a validação foi realizada efetuando chamadas reais à API remota da Gateway de Pagamentos durante os testes, originando:
- **Lentidão e não-determinismo:** a suite demorava mais de 4 minutos no CI/CD, falhando aleatoriamente quando a ligação de rede oscilava.
- **Custos e poluição de dados:** transações e SMS de teste reais enviados para serviços de produção, consumindo plafond.
- **Acoplamento e fragilidade:** impossibilidade de simular cenários de recusa de cartão, timeout ou falhas na rede das salas de pedra.
- **Ausência de TDD:** código escrito sem testes prévios, com ramificações sem cobertura.

### Código Original Fornecido:
```python
# src/business/processador_bilhetes.py
import requests
from datetime import datetime

class ProcessadorDeBilhetesMNSR:
    def __init__(self, gateway_api_url, servico_sms_url):
        self.gateway_api_url = gateway_api_url
        self.servico_sms_url = servico_sms_url

    def calcular_preco(self, tipo_bilhete, quantidade, e_estudante_ufp=False):
        preco_base = 10.0
        if tipo_bilhete == "EXPOSICAO_PERMANENTE":
            preco_base = 10.0
        elif tipo_bilhete == "EXPOSICAO_TEMPORARIA":
            preco_base = 15.0
        else:
            raise ValueError("Tipo de bilhete invalido")

        total = preco_base * quantidade
        if e_estudante_ufp:
            total = total * 0.5  # 50% desconto
        elif quantidade >= 5:
            total = total * 0.8  # 20% desconto grupo

        return total

    def processar_compra(self, id_utilizador, telemovel, tipo_bilhete, qtd, e_estudante, token_pagamento):
        # 1. Calcula valor
        valor_final = self.calcular_preco(tipo_bilhete, qtd, e_estudante)

        # 2. Chamada direta à Gateway de Pagamento Externa (Aparelho frágil!)
        payload_pg = {"user": id_utilizador, "valor": valor_final, "token": token_pagamento}
        resp_pg = requests.post(f"{self.gateway_api_url}/pagar", json=payload_pg, timeout=5)

        if resp_pg.status_code != 200 or not resp_pg.json().get("sucesso"):
            raise RuntimeError("Pagamento recusado pela gateway")

        id_transacao = resp_pg.json().get("transacao_id")

        # 3. Chamada direta ao Serviço de SMS (Outra dependência externa!)
        payload_sms = {"telemovel": telemovel, "mensagem": f"MNSR: Bilhete confirmado #{id_transacao}"}
        requests.post(f"{self.servico_sms_url}/enviar", json=payload_sms, timeout=3)

        return {"sucesso": True, "transacao_id": id_transacao, "valor_pago": valor_final}
```

---

## 2. Grupo I: Questões de Conceitos Diretos

### Questão 1.1: Pirâmide de Testes Automatizados

#### Enunciado:
Explique o conceito da Pirâmide de Testes (Testes Unitários, Testes de Integração e Testes End-to-End / Sistema). Por que razão os Testes Unitários devem constituir a base mais larga da pirâmide e por que razões testar a bilheteira do MNSR diretamente contra a API externa violava esta arquitetura?

#### Resolução Técnica:
1. **Conceito da Pirâmide de Testes (Mike Cohn):**
   - **Testes Unitários (Base, ~70%):** Validam pequenas unidades atómicas de lógica (classes/funções) em isolamento completo de I/O, disco ou rede.
   - **Testes de Integração (Meio, ~20%):** Validam a comunicação e o contrato funcional entre duas ou mais unidades/camadas (ex.: camada de negócio acedendo a base de dados SQLite em memória).
   - **Testes End-to-End / Sistema (Topo, ~10%):** Validam fluxos funcionais completos simulando o percurso real do utilizador pela interface gráfica/CLI até à persistência.
2. **Por que a base deve ser mais larga?** Os testes unitários executam na ordem dos milissegundos, têm custo de manutenção baixo, são 100% determinísticos e isolam a localização exata do defeito quando falham.
3. **Violação no Caso MNSR:** A classe `ProcessadorDeBilhetesMNSR` efetuava chamadas HTTP com `requests.post()` a servidores externos durante a execução da sua lógica. Isso transformou testes que deveriam ser unitários em testes de integração com rede: gerou execuções lentas (>4 min), quebras aleatórias no pipeline de CI por flutuação de conectividade (*testes frágeis*) e cobrança de custos reais em ambientes de terceiros.

---

### Questão 1.2: Ciclo Red-Green-Refactor do TDD

#### Enunciado:
Descreva rigorosamente as três fases do ciclo Test-Driven Development (TDD) formulado por Kent Beck. Qual é a vantagem de escrever o teste automatizado ANTES de implementar o código de produção?

#### Resolução Técnica:
1. **As Três Fases do TDD:**
   - **RED:** Escreve-se primeiro um teste unitário focado num novo requisito ou comportamento esperado. O teste é executado e **tem de falhar** (seja por asserção ou por ausência da classe/método). Isto comprova que o teste não é um falso positivo e que o oráculo de verificação é sensível ao defeito.
   - **GREEN:** Implementa-se a quantidade estritamente mínima e mais simples de código de produção para fazer o teste passar a verde. O objetivo primário é satisfazer a especificação funcional.
   - **REFACTOR:** Melhora-se a estrutura interna do código (eliminar duplicação, melhorar legibilidade, aplicar Clean Code e desacoplamento), executando a suite continuamente para comprovar que nenhuma regressão foi induzida.
2. **Vantagem de escrever antes:** Força uma arquitetura orientada a interfaces e inversão de dependências (código testável por defeito), clarifica os critérios de aceitação e os limites do problema antes do investimento em esforço de implementação.

---

### Questão 1.3: Taxonomia dos Test Doubles (Mocks vs. Stubs)

#### Enunciado:
Segundo a taxonomia de Gerard Meszaros e Martin Fowler, qual é a diferença concetual crucial entre um Stub e um Mock? Explicite também o papel de Dummies, Fakes e Spies.

#### Resolução Técnica:
- **Diferença Crucial entre Stub e Mock:**
  - **Stub (Verificação de Estado):** Fornece respostas enlatadas (*canned answers*) a chamadas feitas durante o teste para que o código execute o seu fluxo. O teste avalia o **estado final** devolvido pelo método sob teste.
  - **Mock (Verificação de Comportamento):** Objeto pré-programado com expetativas explícitas sobre as interações que deve receber. O teste verifica **se as interações esperadas ocorreram** (ex.: se o método `pagar()` foi invocado exatamente uma vez, com argumentos corretos, e se o serviço de SMS não foi chamado em caso de erro).
- **Outros Test Doubles:**
  - **Dummy:** Objeto passado unicamente para preencher parâmetros obrigatórios de métodos, nunca sendo acedido nem executado.
  - **Spy:** Um stub que regista internamente métricas das suas invocações (quantidade de chamadas, histórico de argumentos recebidos) para posterior validação.
  - **Fake:** Objeto que possui uma implementação funcional viável na memória mas inadequada para produção (ex.: base de dados SQLite em memória `:memory:` substituindo base Postgres de produção).

---

## 3. Grupo II: Questões de Complexidade Média

### Questão 2.1: Prática de TDD com PyTest no Cálculo de Descontos do MNSR

#### Enunciado:
Aplique o ciclo TDD (Red-Green-Refactor) para adicionar uma nova regra de negócio ao método `calcular_preco`: *"Visitantes Seniores (idade $\ge 65$ anos) têm direito a um desconto de 30% em qualquer bilhete, não acumulável com desconto UFP"*. Escreva primeiro o teste em PyTest (RED) e de seguida a alteração no código de produção (GREEN).

#### Resolução Técnica:

##### 1. Fase RED (Teste que falha):
```python
# tests/test_processador_bilhetes.py
import pytest
from src.business.processador_bilhetes import ProcessadorDeBilhetesMNSR

def test_calcular_preco_deve_aplicar_desconto_senior_30_porcento():
    proc = ProcessadorDeBilhetesMNSR("https://mock.gateway", "https://mock.sms")
    # Tarifa Temporária base: 15.0€ | Com 30% de desconto = 10.50€
    preco_final = proc.calcular_preco("EXPOSICAO_TEMPORARIA", quantidade=1, e_senior=True)
    assert preco_final == 10.50
```

##### 2. Fase GREEN & REFACTOR (Código de Produção Atualizado):
```python
# src/business/processador_bilhetes.py
class ProcessadorDeBilhetesMNSR:
    def __init__(self, gateway_api_url: str, servico_sms_url: str):
        self.gateway_api_url = gateway_api_url
        self.servico_sms_url = servico_sms_url

    def calcular_preco(self, tipo_bilhete: str, quantidade: int, e_estudante_ufp: bool = False, e_senior: bool = False) -> float:
        tarifas = {
            "EXPOSICAO_PERMANENTE": 10.0,
            "EXPOSICAO_TEMPORARIA": 15.0
        }
        if tipo_bilhete not in tarifas:
            raise ValueError("Tipo de bilhete invalido")

        total = tarifas[tipo_bilhete] * quantidade

        if e_estudante_ufp:
            total *= 0.50  # 50% desconto estudante
        elif e_senior:
            total *= 0.70  # 30% desconto senior (não acumulável com estudante)
        elif quantidade >= 5:
            total *= 0.80  # 20% desconto grupo

        return round(total, 2)
```

---

### Questão 2.2: Isolamento de Dependências com `unittest.mock.patch`

#### Enunciado:
Escreva um teste unitário em PyTest utilizando `unittest.mock.patch` para testar o método `processar_compra` SEM realizar chamadas HTTP reais à rede. O teste deve SIMULAR uma resposta com sucesso HTTP 200 da Gateway de Pagamento e validar se o ID de transação retornado está correto.

#### Resolução Técnica:
```python
# tests/test_compra_isolada.py
from unittest.mock import patch, MagicMock
from src.business.processador_bilhetes import ProcessadorDeBilhetesMNSR

@patch("src.business.processador_bilhetes.requests.post")
def test_processar_compra_sucesso_sem_rede_com_patch(mock_post):
    # 1. Configurar o retorno simulado da Gateway (1ª chamada)
    mock_resp_gateway = MagicMock()
    mock_resp_gateway.status_code = 200
    mock_resp_gateway.json.return_value = {"sucesso": True, "transacao_id": "TX-MNSR-2026"}

    # 2. Configurar o retorno simulado do Serviço de SMS (2ª chamada)
    mock_resp_sms = MagicMock()
    mock_resp_sms.status_code = 200

    mock_post.side_effect = [mock_resp_gateway, mock_resp_sms]

    # 3. Execução isolada em memória
    proc = ProcessadorDeBilhetesMNSR("https://gateway.sibs.pt/api", "https://sms.vodafone.pt/api")
    resultado = proc.processar_compra(
        id_utilizador="user_ufp_45",
        telemovel="912345678",
        tipo_bilhete="EXPOSICAO_PERMANENTE",
        qtd=2,
        e_estudante=False,
        token_pagamento="tok_valid_abc"
    )

    # 4. Asserções de estado e comportamento
    assert resultado["sucesso"] is True
    assert resultado["transacao_id"] == "TX-MNSR-2026"
    assert resultado["valor_pago"] == 20.0
    assert mock_post.call_count == 2
```

---

### Questão 2.3: Cobertura de Linhas vs. Cobertura de Ramos (*Branch Coverage*)

#### Enunciado:
Explique a diferença entre Cobertura de Linhas (*Line Coverage*) e Cobertura de Ramos (*Branch Coverage*). Demonstre, com base no método `calcular_preco`, um caso de teste em que atingir 100% de cobertura de linhas DEIXA PASSAR um bug por falta de teste de um ramo condicional.

#### Resolução Técnica:
1. **Diferença Conceptual:**
   - **Line Coverage:** Rácio entre o número de linhas de código executadas pelo menos uma vez e o total de linhas executáveis.
   - **Branch Coverage:** Rácio entre o número de ramificações booleanas executadas (todos os ramos `True` e `False` de decisões `if`, `elif`, `else`) e o total de ramificações possíveis no grafo de fluxo de controlo.
2. **Demonstração do Caso Prático:**
   Considere o fragmento:
   ```python
   total = preco_base * quantidade
   if e_estudante_ufp:
       total = total * 0.5
   elif quantidade >= 5:
       total = total * 0.8
   return total
   ```
   Se a suite tiver apenas dois casos de teste:
   - Caso A: `e_estudante_ufp = True, quantidade = 1` $\rightarrow$ executa a linha dentro do `if`.
   - Caso B: `e_estudante_ufp = False, quantidade = 5` $\rightarrow$ executa a linha dentro do `elif`.

   **Resultado da Métrica:** 100% de Line Coverage (todas as linhas foram executadas).  
   **Falha Oculta:** O ramo em que `e_estudante_ufp = False` **E** `quantidade < 5` (ramo falso de ambas as condições, correspondente a comprar 1 a 4 bilhetes normais de adulto) nunca foi exercitado. Se houvesse uma mutação ou defeito de omissão no retorno da tarifa inteira, a suite com 100% de linhas executadas passaria com sucesso sem detetar o bug. A análise com `--cov-branch` sinalizaria este ramo em falta.

---

## 4. Grupo III: Questões de Elevada Complexidade

### Questão 3.1: Verificação de Comportamento e Tratamento de Exceções de Rede

#### Enunciado:
Desenvolva um teste unitário avançado para o cenário de FALHA DE REDE: Quando a Gateway de Pagamentos lança uma exceção de Timeout (`requests.exceptions.Timeout`), o método `processar_compra` deve capturar a falha, NÃO tentar enviar a SMS de confirmação, e lançar uma exceção personalizada `PagamentoTimeoutException`. Utilize `unittest.mock` para verificar o comportamento (*Behavior Verification*) garantindo que a chamada ao serviço de SMS NUNCA ocorreu.

#### Resolução Técnica:

```python
# tests/test_resiliencia_timeout.py
import pytest
import requests
from unittest.mock import patch
from src.business.processador_bilhetes import ProcessadorDeBilhetesMNSR

class PagamentoTimeoutException(Exception):
    """Exceção levantada quando a gateway externa excede o tempo limite de resposta."""
    pass

def processar_compra_resiliente(proc: ProcessadorDeBilhetesMNSR, id_user, tel, tipo, qtd, est, token):
    valor_final = proc.calcular_preco(tipo, qtd, est)
    try:
        resp = requests.post(
            f"{proc.gateway_api_url}/pagar",
            json={"user": id_user, "valor": valor_final, "token": token},
            timeout=5
        )
    except requests.exceptions.Timeout:
        raise PagamentoTimeoutException("Gateway de pagamento inacessivel por Timeout")

    if resp.status_code != 200:
        raise RuntimeError("Pagamento recusado")

    txn_id = resp.json().get("transacao_id")
    requests.post(f"{proc.servico_sms_url}/enviar", json={"telemovel": tel, "msg": txn_id}, timeout=3)
    return {"sucesso": True, "transacao_id": txn_id}

@patch("src.business.processador_bilhetes.requests.post")
def test_timeout_gateway_lanca_excecao_custom_e_impede_envio_sms(mock_post):
    # Simula o Timeout ao tentar contactar a gateway
    mock_post.side_effect = requests.exceptions.Timeout("Read timed out on socket")
    proc = ProcessadorDeBilhetesMNSR("https://gateway.sibs.pt", "https://sms.vodafone.pt")

    # Verifica se a exceção esperada é levantada
    with pytest.raises(PagamentoTimeoutException) as exc_info:
        processar_compra_resiliente(proc, "user1", "910000000", "EXPOSICAO_PERMANENTE", 1, False, "tok123")

    assert "Gateway de pagamento inacessivel por Timeout" in str(exc_info.value)
    
    # Behavior Verification: apenas 1 chamada ocorreu (a tentativa na gateway).
    # Comprova que a chamada subsequente ao serviço de SMS NUNCA foi efetuada.
    assert mock_post.call_count == 1
```

---

### Questão 3.2: Refatorização de Testes Frágeis & Utilização de PyTest Fixtures

#### Enunciado:
O código de teste da equipa sofria de forte duplicação devido à instanciação manual de `ProcessadorDeBilhetesMNSR` em cada função de teste. Refatorize a suite utilizando Fixtures do PyTest (`@pytest.fixture`) para criar um ambiente de teste limpo e reutilizável, separando a verificação de estado e a configuração de Mocks.

#### Resolução Técnica:

```python
# tests/conftest.py
import pytest
from src.business.processador_bilhetes import ProcessadorDeBilhetesMNSR

@pytest.fixture
def processador():
    """Fornece uma instância isolada e desacoplada do serviço de bilheteira."""
    return ProcessadorDeBilhetesMNSR(
        gateway_api_url="https://mock.gateway.internal",
        servico_sms_url="https://mock.sms.internal"
    )
```

```python
# tests/test_bilheteira_fixtures.py
import pytest

def test_desconto_estudante_ufp(processador):
    total = processador.calcular_preco("EXPOSICAO_PERMANENTE", quantidade=2, e_estudante_ufp=True)
    assert total == 10.0

def test_desconto_grupo_cinco_bilhetes(processador):
    total = processador.calcular_preco("EXPOSICAO_PERMANENTE", quantidade=5, e_estudante_ufp=False)
    assert total == 40.0

def test_tipo_bilhete_invalido_lanca_excecao(processador):
    with pytest.raises(ValueError, match="Tipo de bilhete invalido"):
        processador.calcular_preco("CATEGORIA_INEXISTENTE", quantidade=1)
```

---

### Questão 3.3: Automação de Testes e Barreira de Qualidade no CI/CD (Marco M3)

#### Enunciado:
No âmbito do Marco M3 do Projeto Integrado, especifique a configuração de um Workflow do GitHub Actions (`.github/workflows/test.yml`) que executa automaticamente a suite de testes PyTest em cada Pull Request, gerando o relatório de cobertura de código com Coverage.py e bloqueando o Merge se a cobertura de ramos (*Branch Coverage*) for inferior a 80%.

#### Resolução Técnica:

```yaml
# .github/workflows/test.yml
name: ESOF Marco M3 - CI Test & Quality Gate

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  qualidade-e-cobertura:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout do Repositório
        uses: actions/checkout@v4

      - name: Configurar Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Instalar Dependências
        run: |
          python -m pip install --upgrade pip
          pip install pytest pytest-cov flake8 requests

      - name: Auditoria Clean Code com Flake8
        run: |
          flake8 src/ tests/ --max-line-length=120 --exclude=.venv,__pycache__

      - name: Executar Suite PyTest com Barreira de Cobertura de Ramos (Branch Coverage >= 80%)
        run: |
          pytest --cov=src --cov-branch --cov-report=term-missing --cov-report=html --cov-fail-under=80
```