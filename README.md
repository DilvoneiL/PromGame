Next.js Loja
Um sistema de loja desenvolvido com Next.js e Prisma, utilizando MongoDB como banco de dados. Este projeto exemplifica como criar um sistema básico com operações de CRUD (Create, Read, Update e Delete) para gerenciar categorias, jogos, ofertas e outros dados relacionados.

Requisitos
Certifique-se de ter as seguintes ferramentas instaladas:

Node.js (recomendado: versão LTS)
NPM ou Yarn
MongoDB Atlas ou instância local do MongoDB
Conta no MongoDB Atlas (se optar por usar a nuvem)
Instalação
Clone este repositório:

bash
Copiar código
git clone https://github.com/seu-repositorio/nextjs-loja.git
cd nextjs-loja
Instale as dependências:

bash
Copiar código
npm install
Configuração do Banco de Dados
Crie uma conta no MongoDB Atlas (se necessário):

Siga as instruções para criar um cluster gratuito.
Crie uma nova coleção chamada meubanco no seu cluster.
Configure a conexão com o MongoDB no arquivo .env:

Crie um arquivo .env na raiz do projeto e adicione o seguinte:

env
Copiar código
DATABASE_URL="mongodb+srv://<USUARIO>:<SENHA>@cluster0.mongodb.net/meubanco?retryWrites=true&w=majority"
Substitua <USUARIO> e <SENHA> pelas credenciais do seu MongoDB Atlas.
Verifique o arquivo Prisma:

Certifique-se de que o prisma/schema.prisma está configurado com o provedor mongodb.

prisma
Copiar código
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Categoria {
  id        String   @id @default(auto()) @map("_id")
  nome      String
  descricao String
}

// Outros modelos aqui...
Gerar o Cliente Prisma
Gerar o Cliente Prisma para o banco de dados:

bash
Copiar código
npx prisma generate
Sincronizar modelos com o banco de dados (se necessário):

O MongoDB não suporta migrate, mas você pode criar seus modelos no MongoDB manualmente ou utilizar ferramentas gráficas (como o MongoDB Compass).

Rodando o Projeto
Inicie o servidor de desenvolvimento:

bash
Copiar código
npm run dev
Acesse o projeto:

Abra o navegador e acesse: http://localhost:3000.
Endpoints da API
Os endpoints seguem a estrutura organizada da pasta api. Os principais endpoints estão disponíveis para:

Categoria
Adicionar Categoria:

Método: POST

URL: /api/(entidades)/categoria/adicionar

Corpo esperado:

json
Copiar código
{
  "nome": "Nome da Categoria",
  "descricao": "Descrição da Categoria"
}
Listar Categorias:

Método: GET
URL: /api/(entidades)/categoria/listar
Editar Categoria:

Método: PUT
URL: /api/(entidades)/categoria/editar
Remover Categoria:

Método: DELETE
URL: /api/(entidades)/categoria/remover
Obter Categoria por ID:

Método: GET
URL: /api/(entidades)/categoria/obter?id=<ID>
Jogos
Adicione endpoints de acordo com a necessidade.
Dependências Principais
Next.js: Framework React para renderização do lado do servidor.
Prisma: ORM para trabalhar com MongoDB.
MongoDB: Banco de dados NoSQL para armazenamento.
Dúvidas ou Problemas?
Entre em contato ou abra uma issue.
