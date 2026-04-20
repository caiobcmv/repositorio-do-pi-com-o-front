#  Frontend — Sistema de Gestão de Horas SENAC

Esta é a interface do usuário (UI) do Sistema de Gestão de Atividades Complementares. O frontend foi desenvolvido para ser uma Single Page Experience (dentro de cada módulo), focada em performance, segurança e fidelidade à identidade visual do SENAC.

---

##  Identidade Visual e UX

O projeto utiliza uma interface baseada em **Dashboards Administrativos**, priorizando a clareza dos dados e a facilidade de navegação.

| Elemento | Especificação |
| :--- | :--- |
| **Tipografia** | Montserrat & Poppins (Google Fonts) |
| **Paleta de Cores** | Azul Senac (#004587), Laranja (#F7941D), Sucesso (#10B981) |
| **Ícones** | Boxicons (Biblioteca de ícones vetoriais) |
| **Layout** | Sidebar fixa com Grid dinâmico para KPIs e Tabelas |

---

##  Estrutura de Arquivos

```text
frontend/
├── assets/             → Logos, ícones e imagens oficiais SENAC
├── pages/              → Estrutura HTML das telas (Módulos)
│   ├── index.html      → Tela de Login e seleção de perfil
│   ├── Dasboard.html   → Painel do Aluno (Envio de horas)
│   ├── dashboardadm.html → Painel do Coordenador (Gestão de Alunos)
│   ├── configadm.html  → Painel do Super Admin (Cursos e Coordenadores)
│   └── relatórios.html → Visualização de métricas e status
├── services/
│   └── script.js       → O "Cérebro" do Front: Fetch API, JWT e Auth Guard
└── styles/             → Arquivos CSS modulares
    ├── global.css      → Variáveis, resets e estilos compartilhados
    ├── login.css       → Estilização específica do portal de entrada
    └── dashboard.css   → Estilos de tabelas, badges e cards de KPI


     Funcionalidades Técnicas (JavaScript)
1. Proteção de Rotas (Auth Guard)
Segurança client-side que impede o acesso de usuários não autenticados ou com perfil incorreto através da função protegerPagina().

Persistência: O Token JWT e o perfil do usuário são mantidos no localStorage.

Redirecionamento: Sessões expiradas ou acessos indevidos retornam automaticamente para a index.html.

2. Integração Assíncrona com a API
Todas as requisições são centralizadas em helpers que facilitam a manutenção:

Headers Automáticos: O cabeçalho de autorização (Bearer Token) é injetado em todas as chamadas via apiFetch.

Tratamento de Erros: Captura automática de erros 401 (Unauthorized) para deslogar o usuário com segurança.

3. Renderização Dinâmica (DOM Manipulation)
Tabelas Inteligentes: Linhas geradas via código com base no retorno JSON da API.

KPIs Dinâmicos: Contadores de alunos, horas totais e pendências que se atualizam sem a necessidade de refresh (F5).

UI de Feedback: Uso de avatares coloridos e badges de status (Ativo, Trancado, Pendente) gerados logicamente por JavaScript.

 Como Executar o Frontend
O frontend é servido como conteúdo estático pelo próprio servidor Node.js/Express.

Inicie o Servidor Backend:

Bash
node backend/src/server.js
Acesse via Navegador:
Abra http://localhost:3001

 Componentes de Interface Implementados
[x] Portal de Login: Validação de campos e seleção de perfil (Aluno, Coordenador, Admin).

[x] Sidebar de Navegação: Menu lateral fixo com controle de estado ativo.

[x] Tabela de Alunos: Visualização detalhada com avatares e badges de curso.

[x] Filtros de Busca: Campo de busca por RA e filtros dinâmicos de cursos populados via banco.

[x] Cards de Resumo: Exibição de dados quantitativos no topo da página.

 Responsividade
O sistema utiliza CSS Grid e Flexbox, garantindo que a interface seja funcional tanto em monitores de alta resolução quanto em notebooks e tablets utilizados em ambiente acadêmico.


##  Arquitetura do Sistema

O projeto adota a **Arquitetura Baseada em Componentes (CBA - Component-Based Architecture)**, focando na modularização e separação de responsabilidades para garantir escalabilidade e facilidade de manutenção.

###  Princípios de Componentização Aplicados

1.  **Modularidade Funcional**: Cada funcionalidade (Login, Gestão de Cursos, Análise de Certificados) é tratada como um módulo independente. Isso permite que alterações no backend de "Alunos" não afetem o módulo de "Cursos".
2.  **Reutilização de UI**: Elementos de interface como a Sidebar, Tabelas de Dados e Avatares são tratados como componentes lógicos. O arquivo `script.js` atua como o motor de renderização, injetando esses componentes dinamicamente no DOM.
3.  **Encapsulamento de Lógica (Services)**: Toda a comunicação com a API e lógica de autenticação está encapsulada em arquivos de serviço (`frontend/services/`), separando a estrutura (HTML) do comportamento (JS).



###  Divisão de Camadas

| Camada | Responsabilidade | Implementação |
| :--- | :--- | :--- |
| **View (UI)** | Interface modular com o usuário | HTML Semântico + CSS Grid |
| **Logic (Component)** | Manipulação de dados e comportamento | JavaScript (ES6+) |
| **Service (API)** | Comunicação desacoplada com o Backend | Fetch API + JWT |
| **Data (Persistence)** | Armazenamento de estado e sessão | LocalStorage & PostgreSQL |

###  Vantagens desta Arquitetura no Projeto
- **Manutenibilidade**: Correções de bugs são localizadas dentro do componente específico.
- **Escalabilidade**: Facilita a adição de novos perfis de usuário (ex: Moderadores) sem refatorar o sistema inteiro.
- **Independência**: O Frontend pode evoluir visualmente sem depender de mudanças estruturais na API.

Desenvolvido para: SENAC 2026

Tecnologias: HTML5, CSS3, JavaScript (ES6+), Boxicons.

