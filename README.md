# SARE INEP - Sistema de Análise da Rede Escolar

##  Sobre o Projeto
O **SARE INEP** é uma aplicação web desenvolvida como Projeto Prático (P2) para a disciplina de **Programação Avançada Orientada a Objetos** da FATEC Zona Leste.

O objetivo central do sistema é importar, tratar, armazenar e analisar os microdados oficiais do Censo Escolar do Inep. Através da aplicação, é possível investigar a realidade da **inclusão digital** nas escolas brasileiras, comparando o acesso à internet e computadores entre as redes Pública e Privada.

##  Integrantes do Grupo (Grupo XX)
*   [Erick de Sousa e Silva]
*   [Fabrício Araujo Shimabukuro]
*   [Gabriel Reinaldo de Chagas de Medeiros] 
*   [Yan Kevin de Sousa Costa] 

## Tecnologias Utilizadas
*   **Back-end:** Java 17, Spring Boot, Spring Data JPA
*   **Banco de Dados:** PostgreSQL (hospedado no Neon Tech)
*   **Front-end:** HTML5, CSS3, JavaScript Puro (Vanilla)
*   **Visualização de Dados:** Chart.js
*   **Integração Externa:** API oficial do IBGE (para busca de municípios)
*   **Versionamento:** Git e GitHub

##  Funcionalidades Implementadas
*   **CRUD Completo:** Cadastrar, listar, editar e excluir escolas manualmente.
*   **Importação de Dados em Massa:** Leitura e tratamento automatizado do arquivo oficial do Inep (CSV), com tratamento de duplicidades e dados inválidos.
*   **Filtros Dinâmicos:** Busca por UF e por Rede de Ensino diretamente na API.
*   **Paginação:** Tabela dividida em páginas de 50 registros para garantir a performance do navegador.
*   **Gráfico Analítico:** Comparativo visual de acesso à internet entre escolas Públicas e Privadas.

## Fonte dos Dados
Os dados utilizados são os microdados oficiais do Censo Escolar da Educação Básica 2025, disponibilizados pelo Inep.
*   **Portal:** [Portal de Dados Abertos do Inep](https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/censo-escolar)
*   **Arquivo utilizado:** `Tabela_Escola_2025_V2.csv`
*   **Dicionário de Dados:** Consulta oficial para decodificação das colunas categóricas.

## Modelagem de Dados (Entidade Escola)
A entidade principal foi modelada com os seguintes campos extraídos do Censo:
*   `id` (Long): Chave primária gerada automaticamente.
*   `codigoEscola` (Long): Código oficial do Inep (CO_ENTIDADE).
*   `nomeEscola` (String): Nome da escola (NO_ENTIDADE).
*   `uf` (String): Estado (SG_UF).
*   `municipio` (String): Município (NO_MUNICIPIO).
*   `rede` (String): Rede de Ensino (CO_REDE - traduzido para Pública/Privada).
*   `possuiComputador` (Boolean): Indicador de infraestrutura (IN_COMPUTADOR).
*   `possuiInternet` (Boolean): Indicador de infraestrutura (IN_INTERNET).

##  Como Executar o Projeto Localmente

### 1. Pré-requisitos
*   Java 17+
*   Maven
*   Conta no Neon Tech (para o banco PostgreSQL)

### 2. Configuração do Banco de Dados
1. Crie um banco de dados PostgreSQL no Neon.
2. Copie o arquivo `.env.example` para um novo arquivo chamado `.env`.
3. Preencha o arquivo `.env` com as suas credenciais reais do Neon:
   ```properties
   DB_URL=jdbc:postgresql://seu-endereco.neon.tech/neondb?sslmode=require
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
