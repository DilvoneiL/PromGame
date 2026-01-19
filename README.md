# 🛒 Next.js Loja

**Projeto Full Stack de Loja Virtual desenvolvido com Next.js, Prisma e MongoDB**

---

## 🚀 Visão Geral

Este projeto é uma aplicação **Full Stack** desenvolvida para consolidar conhecimentos em **Next.js**, **APIs**, **Prisma ORM** e **MongoDB**.

O sistema implementa operações completas de **CRUD (Create, Read, Update, Delete)** para gerenciamento de **categorias**, **jogos**, **ofertas** e demais entidades relacionadas a uma loja virtual.

🔹 Projeto com foco em **organização de código**, **modelagem de dados** e **integração front-end / back-end**
🔹 Estrutura pensada para simular um cenário real de aplicação web

---

## 🛠️ Tecnologias Utilizadas

* **Next.js** — Framework React (SSR / API Routes)
* **Prisma ORM** — Abstração e acesso ao banco de dados
* **MongoDB** — Banco de dados NoSQL
* **Node.js** — Ambiente de execução
* **JavaScript / TypeScript** — Linguagem da aplicação

---

## ✨ Funcionalidades

* CRUD completo de categorias
* Estrutura para gerenciamento de jogos e ofertas
* API organizada utilizando rotas do Next.js
* Integração com MongoDB via Prisma
* Separação clara entre camadas da aplicação
* Estrutura pronta para expansão de funcionalidades

---

## 🧠 Estrutura do Projeto

* **/pages/api** — Endpoints da API
* **/prisma** — Schema e configuração do Prisma
* **/pages** — Páginas da aplicação
* **/components** — Componentes reutilizáveis
* **/services** — Camada de acesso a dados e regras de negócio

---

## 📚 Aprendizados

Durante o desenvolvimento deste projeto, foram praticados:

* Desenvolvimento Full Stack com Next.js
* Criação e consumo de APIs REST
* Uso do Prisma ORM com MongoDB
* Modelagem de dados NoSQL
* Organização de projetos escaláveis
* Boas práticas de separação de responsabilidades

---

## 🔮 Melhorias Planejadas

* Ajustar relacionamento entre ofertas e jogos
* Melhorias na interface do usuário (UI/UX)
* Expansão das regras de negócio

---

## ⚙️ Como Executar o Projeto (Desenvolvimento)

### Requisitos

* **Node.js** (versão LTS recomendada)
* **NPM** ou **Yarn**
* **MongoDB Atlas** ou MongoDB local

---

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/seu-repositorio/nextjs-loja.git
cd nextjs-loja
```

2. **Instale as dependências**

```bash
npm install
```

---

### Configuração do Banco de Dados

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mongodb+srv://<USUARIO>:<SENHA>@<CLUSTER>.mongodb.net/meubanco?retryWrites=true&w=majority"
NEXTAUTH_SECRET="sua_chave_secreta"
```

> 

---

### Prisma

```bash
npx prisma generate
npx prisma validate
npx prisma db push
```

Opcional:

```bash
npx prisma studio
```

---

### Rodando o Projeto

```bash
npm run dev
```

Acesse:

```
http://localhost:3000
```

---

## 📌 Endpoints da API (Exemplo)

### Categoria

* **POST** `/api/(entidades)/categoria/adicionar`
* **GET** `/api/(entidades)/categoria/listar`
* **PUT** `/api/(entidades)/categoria/editar`
* **DELETE** `/api/(entidades)/categoria/remover`
* **GET** `/api/(entidades)/categoria/obter?id=<ID>`

---

## 🧑‍💻 Autor

**Dilvonei Lacerda**
Desenvolvedor Full Stack Júnior

---

Só falar 👊
