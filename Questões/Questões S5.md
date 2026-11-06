Grupo I: Questões de Conceitos Diretos
    Questão 1.1
    Os três princípios fundamentais de Clean Code violados no código são: Nomes Significativos (Meaningful Names), Princípio da Responsabilidade Única (SRP) e Separação de Preocupações (Separation of Concerns). Nomes como 'd', 't', 'g' e 'flag1' prejudicam gravemente a manutenção porque não revelam a sua intenção nem o contexto dos dados que armazenam. Isto obriga os programadores a deduzir e memorizar o mapeamento lógico destas variáveis, aumentando a carga cognitiva e a probabilidade de introduzir erros em futuras atualizações.   
    Questão 1.2
    A Regra do Escoteiro (Boy Scout Rule) estabelece que devemos deixar o código sempre um pouco mais limpo do que quando o encontrámos. A sua aplicação contínua no repositório previne a podridão do software (Code Rot) e o aumento da Dívida Técnica porque promove refatorizações incrementais (como renomear variáveis obscuras e extrair métodos complexos) a cada submissão. Desta forma, o código melhora progressivamente em vez de se degradar com a acumulação de soluções rápidas.

    Questão 1.3
    Um Code Smell é um indicador ou sintoma superficial no código-fonte que sugere a provável existência de um problema estrutural mais profundo no design do sistema.
    (a) Long Method: O método possui 250 linhas, múltiplos níveis de aninhamento e mistura regras de negócio com formatação, tornando-o monolítico e difícil de compreender.
    (b) Long Parameter List: A função exige demasiados parâmetros (d, t, e, g, flag1, lst_obras, imp_pdf, email_usr), o que dificulta a sua chamada, reduz a legibilidade e facilita erros na passagem de argumentos.
    (c) Duplicated Code / Magic Numbers: O código utiliza valores literais (10.0, 0.5, 0.23) espalhados sem explicação e repete a lógica de cálculo de IVA, dificultando alterações futuras nas regras de negócio e violando a clareza.

Grupo II: Questões de Complexidade Média
    Questão 2.1   

    from dataclasses import dataclass
    from typing import List, Dict

    @dataclass
    class VisitanteContexto:
        nome: str
        tipo: int
        instituicao: str
        tamanho_grupo: int
        aplicar_destaques: bool
        imprimir_pdf: bool
        email_utilizador: str

    def processar_dados_visita(self, contexto: VisitanteContexto, obras: List[Dict]):
        pass 

    Questão 2.2

    def selecionar_obras_em_destaque(self, obras: List[Dict], destacar: bool) -> List[str]:
    resultado = []
    for obra in obras:
        if obra['cat'] == 'Escultura' and destacar:
            if obra['nome'] == 'O Desterro':
                resultado.insert(0, f"{obra['nome']} (SALA 2 - DESTAQUE)")
            else:
                resultado.append(obra['nome'])
        elif obra['cat'] == 'Pintura' and obra.get('ano', 9999) < 1900:
            resultado.append(f"{obra['nome']} (GALERIA PRINCIPAL)")
    return resultado   

    A técnica Extract Method melhora a coesão pois isola uma responsabilidade única e bem definida num método autónomo. Reduz simultaneamente a complexidade ciclomática do método principal, removendo do mesmo as instruções condicionais aninhadas de filtragem de obras.

    Questão 2.3

    TARIFA_BASE = 10.0
    TAXA_IVA = 0.23

    def calcular_preco_bilhete(tipo: int, instituicao: str, tamanho_grupo: int) -> float:
        descontos = {
            1: 0.5 if instituicao == "UFP" else 0.8,
            2: 0.6,
            3: 0.7 if tamanho_grupo > 5 else 1.0
        }
        fator = descontos.get(tipo, 1.0)
        preco_sem_iva = TARIFA_BASE * fator
        return preco_sem_iva * (1 + TAXA_IVA) 

Grupo III: Questões de Elevada Complexidade
    Questão 3.1

    class CalculadorVisitaService:
    def processar_visita(self, contexto: VisitanteContexto, obras: List[Dict]) -> tuple[str, float, List[str]]:
        total = calcular_preco_bilhete(contexto.tipo, contexto.instituicao, contexto.tamanho_grupo)
        obras_selecionadas = self._selecionar_obras_em_destaque(obras, contexto.aplicar_destaques)
        relatorio = self._gerar_relatorio(contexto.nome, total, obras_selecionadas)
        
        if contexto.imprimir_pdf:
            pass # TODO: Implementar impressão PDF
            
        return relatorio, total, obras_selecionadas
        
    def _selecionar_obras_em_destaque(self, obras: List[Dict], destacar: bool) -> List[str]:
        # Implementação isolada da seleção de obras (ver Questão 2.2)
        pass
        
    def _gerar_relatorio(self, nome: str, total: float, obras: List[str]) -> str:
        return (f"=== RELATORIO DE VISITA MNSR ===\n"
                f"Visitante: {nome} | Total a pagar: {total:.2f} EUR\n"
                f"Obras a visitar: {', '.join(obras)}\n")

    Questão 3.2

    import pytest

    def test_calculo_tarifa_estudante_ufp():
        # Arrange
        tipo = 1
        instituicao = "UFP"
    
        # Act
        total = calcular_preco_bilhete(tipo, instituicao, tamanho_grupo=1)
    
        # Assert: 10.0 * 0.5 (desconto) = 5.0 | 5.0 * 1.23 (IVA) = 6.15 EUR
        assert total == pytest.approx(6.15, 0.01)

    def test_priorizacao_escultura_o_desterro():
        # Arrange
        service = CalculadorVisitaService()
        obras = [
            {"nome": "Pintura Clássica", "cat": "Pintura", "ano": 1800},
            {"nome": "O Desterro", "cat": "Escultura"}
        ]
    
        # Act
        resultado = service._selecionar_obras_em_destaque(obras, destacar=True)
    
        # Assert
        assert resultado[0] == "O Desterro (SALA 2 - DESTAQUE)"  

    Questão 3.3
    A automatização num pipeline CI/CD (GitHub Actions) funciona como um bloqueio de qualidade (Quality Gate) que impede integrações de código degradado na branch principal.
    (a) Linter de estilo: A execução de ferramentas como Flake8 (PEP8) assegura que o estilo de código é consistente, reprovando automaticamente o pipeline caso existam problemas de espaçamento ou limites de linha.
    (b) Complexidade Ciclomática: Ferramentas como o Radon (configuradas para reprovar se McCabe <= 5 for violado) forçam a equipa a simplificar métodos excessivamente complexos e com demasiados caminhos de execução lógicos.
    (c) Governação de IA: A validação automática de um registo obrigatório no ficheiro docs/AI_LOG.md assegura a rastreabilidade, garantindo que o código gerado por IA foi revisto, documentado e compreendido pela equipa humana antes da sua aceitação.                  