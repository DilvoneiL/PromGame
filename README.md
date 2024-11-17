Main (corresponde à Aula01)
 - Descrição:
  Projeto Next, Layout, Template, Page
  

Aula02
 - Descrição
  Componentes


Aula03
 - Descrição
  Tratamento de Eventos e useState


Aula04
 - Descrição
  Persistência dos dados em arquivo json e routes


Aula05
 - Descrição
  Formulário com Zod e useFormState

 - Instalar
  mpm i zod


Aula06
 - Descrição
  Persistência dos dados com Prisma e Postgres

 - Instalar
  mpm i prisma --save-dev
  npm i @prisma/client

 - Executar (novamente a cada alteração no schema.prisma)   
   npx prisma migrate dev
   npx prisma generate (somente se o anterior não tiver feito)
   npx prisma studio (abre uma página no navegador que permite acessar o bd)


Aula07
 - Descrição
  Autenticação com nextauth, inclui tabelas no BD

 - Instalar
  npm i next-auth@beta
  npm i @auth/prisma-adapter
  npm i --save @types/bcrypt (não utilizei)

 - Executar  
  npx auth secret
