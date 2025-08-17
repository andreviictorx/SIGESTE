# Sistema Escolar - Gestão

## 📄 Descrição do Projeto

O **Sistema Escolar - Gestão** é uma aplicação web completa, desenvolvida para demonstrar a criação de um sistema de gerenciamento de dados do tipo CRUD (Create, Read, Update, Delete) com foco em uma arquitetura modular, integridade de dados e uma experiência de usuário fluida. O projeto simula a gestão de alunos, turmas, professores e disciplinas em um ambiente escolar.

## ✨ Principais Funcionalidades

* **Gestão Completa (CRUD):** Permite a criação, leitura, atualização e exclusão de **Alunos**, **Turmas**, **Professores** e **Disciplinas**.
* **Validação de Dados:** Garante a unicidade de códigos e matrículas, prevenindo a duplicação de dados e mantendo a integridade do sistema.
* **Associação Dinâmica:** Permite associar Alunos, Professores e Disciplinas a Turmas de forma intuitiva, criando relações inteligentes entre as entidades.
* **Persistência de Dados:** Utiliza o `localStorage` do navegador para salvar todos os dados localmente, permitindo que a aplicação funcione offline e mantenha o estado mesmo após o recarregamento da página.
* **Interface Responsiva:** O layout foi projetado para se adaptar a diferentes tamanhos de tela, garantindo uma ótima experiência tanto em desktops quanto em dispositivos móveis.
* **Modal Interativo:** Modais de cadastro e edição que são dinamicamente preenchidos com os dados existentes e incluem validação em tempo real.

## 🛠️ Tecnologias Utilizadas

* **Linguagem:** TypeScript
* **HTML:** Estrutura semântica para a interface do usuário.
* **CSS:** Estilização pura para um design limpo e responsivo.
* **JavaScript:** Lógica de manipulação do DOM e eventos.

## 🚀 Como Executar o Projeto

Para executar este projeto em sua máquina local, siga os passos abaixo:

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/andreviictorx/SIGESTE
    ```

2.  **Navegue até o Diretório do Projeto:**
    ```bash
    cd src
    ```

3.  **Compile o TypeScript para JavaScript:**
    Se você estiver usando o `tsc`, execute:
    ```bash
    tsc
    ```
    *(É necessário ter o TypeScript instalado globalmente ou como uma dependência de desenvolvimento)*

4.  **Abra o `index.html`:**
    Simplesmente abra o arquivo `index.html` em seu navegador web preferido. Para uma experiência melhor (com Live Reload), considere usar uma extensão como o `Live Server` no VS Code ou instale um servidor local.

## 📂 Estrutura de Arquivos

├── dist/                # Arquivos JavaScript compilados
│   └── main.js
├── src/
│   ├── css/             # Arquivos de estilo
│   │   ├── button.css
│   │   ├── main.css
│   │   ├── modal.css
│   │   └── records.css
│   ├── ts/              # Código fonte TypeScript
│   │   ├── alunos.ts
│   │   ├── disciplinas.ts
│   │   ├── main.ts
│   │   ├── professor.ts
│   │   └── turmas.ts
│   └── index.html       # Arquivo principal da aplicação
└── README.md

## ✍️ Autor

**André Victor**
* **LinkedIn:** https://www.linkedin.com/in/andreviictor/
* **GitHub:** https://github.com/andreviictorx/SIGESTE
