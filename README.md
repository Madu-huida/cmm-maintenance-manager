# ⚙️ CMM - Computerized Maintenance Manager

---

## 📜 Domínio do Problema (Escopo)

Empresas que possuem infraestrutura física (prédios corporativos, indústrias, shoppings) lidam com uma grande quantidade de ativos, como elevadores, geradores, sistemas de ar-condicionado (HVAC) e maquinário industrial. O controle manual ou via planilhas dessas manutenções gera:
* Falta de visibilidade sobre o histórico de quebras de um equipamento.
* Esquecimento de manutenções preventivas (o que gera multas ou acidentes).
* Dificuldade em calcular o custo total de operação (TCO) de uma máquina.
* Falha na comunicação entre quem reporta o problema e a equipe técnica.

O **CMM** é uma aplicação web desenvolvida para centralizar o cadastro de ativos e orquestrar as Ordens de Manutenção (preventivas e corretivas), garantindo que a infraestrutura da empresa opere sem paradas inesperadas.

---

## 🎯 Objetivo do Sistema

Fornecer uma plataforma ágil e confiável capaz de:
* Cadastrar e categorizar os equipamentos e locais da empresa.
* Registrar chamados de problemas (manutenção corretiva).
* Controlar o ciclo de vida de uma Ordem de Manutenção (Aberta -> Em Atendimento -> Concluída).
* Rastrear o tempo de inatividade (*downtime*) e os custos envolvidos no reparo.

---

# 🧱 Funcionalidades Principais

---

## 🏢 1. Gestão de Ativos e Locais (CRUD)
O "coração" do inventário da empresa. Cada registro possui:
* Nome do Equipamento (ex: Elevador Social Bloco B, Chiller 01)
* Categoria e Número de Série
* Localização (ex: Andar 2, Setor de Produção)
* Status Operacional (Online / Offline / Em Manutenção)

Operações:
* Criar, Listar, Atualizar e Inativar equipamentos.

## 👥 2. Gestão de Equipe Técnica (CRUD)
* Cadastro de técnicos, suas especialidades (Elétrica, Mecânica, Predial) e disponibilidade.

---

# 🔄 Transação Principal — Ciclo da Ordem de Manutenção (OM)

O fluxo principal do sistema garante que um reparo seja executado e devidamente registrado com integridade de dados:

1. **Abertura:** Um usuário reporta uma falha. A OM é gerada vinculada a um Ativo. O status do Ativo muda automaticamente para `OFFLINE`.
2. **Atribuição:** O sistema ou o gestor designa a OM para um Técnico específico.
3. **Execução e Transação (Fechamento):** * O técnico preenche o laudo, insere as horas trabalhadas e os custos de peças.
   * Ao clicar em "Finalizar OM", o sistema executa uma transação que:
     * Calcula o custo total da manutenção.
     * Altera o status da OM para `CONCLUÍDA`.
     * Retorna o status do Ativo para `ONLINE`.
     * Salva no histórico de confiabilidade do equipamento.
   * **Regra ACID:** Se qualquer parte desse fechamento falhar (ex: erro no cálculo de custos), o status da máquina não volta para online e a OM não é fechada, evitando dados corrompidos.

---

# 🔐 Controle de Acesso
Segurança e roteamento baseados em perfis via **JWT (JSON Web Token)**.

* **Solicitante (Usuário Comum):** Pode apenas abrir chamados para equipamentos quebrados e ver o status do seu chamado.
* **Técnico:** Visualiza a fila de OMs atribuídas, insere laudos e finaliza os serviços.
* **Gestor/Admin:** Tem acesso total ao CRUD de Ativos, cadastra técnicos e extrai relatórios de custos e paradas.

---

# 🏗️ Arquitetura e Padrões de Projeto
[cite_start]O sistema adota uma arquitetura **Client-Server** [cite: 43][cite_start], implementado como uma **Single-Page Application (SPA)**[cite: 37, 38]. 

Padrões de Projeto aplicados:
* [cite_start]**Injeção de Dependência / IoC:** Utilizado no back-end para desacoplamento de serviços[cite: 16, 19].
* [cite_start]**State Pattern:** Para o gerenciamento rigoroso dos estados da Ordem de Manutenção[cite: 14].
* [cite_start]**MVC/MV*:** Separação clara de responsabilidades entre a interface, o controle de requisições e a regra de negócio[cite: 52].

---

# 🛠️ Tecnologias Escolhidas

* **Back-end:** Java + Spring Boot. (Garante robustez transacional e agilidade na criação da API REST, além de estar alinhado com as práticas da disciplina).
* **Front-end:** React (Criação de dashboards dinâmicos para visualização dos equipamentos e chamados em tempo real).
* **Banco de Dados:** MySQL. (Relacional, garantindo as *constraints* e a integridade referencial entre Ativos, Usuários e Ordens de Manutenção).
* **Infraestrutura:** Repositório no GitHub/GitLab, versionamento estruturado, testes unitários (JUnit) e deploy contínuo (CI/CD).

---

# 📋 Organização e Plano de Trabalho

O desenvolvimento do projeto será realizado de forma individual (Full Stack).

* **Desenvolvedora Responsável:** Maria Eduarda Huida
* **Escopo de Atuação:** * Modelagem e administração do banco de dados relacional.
  * Desenvolvimento da API REST em Java (Spring Boot) com autenticação JWT.
  * Estruturação da Single-Page Application (SPA) no front-end.
  * Implementação da lógica de transação (fechamento de Ordens de Manutenção) e cobertura de testes.
  * Configuração da esteira de CI/CD para deploy da aplicação em produção.
