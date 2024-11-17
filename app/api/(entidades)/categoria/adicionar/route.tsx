import { inserirCategoria } from "@/data/categoriaDAO";
import Categoria from "@/app/(entidades)/categoria/categoria";

export async function POST(request: Request) {
  const { nome, descricao } = await request.json(); // Removendo `id` do JSON recebido

  // Verificando apenas os campos necessários (id será gerado automaticamente)
  if (nome && descricao) {
    // Criando o objeto Categoria sem `id`, pois será gerado pelo MongoDB
    const novaCategoria = new Categoria(nome, descricao);
    console.log("Objeto Categoria criado para o banco:", novaCategoria);

    try {
      const resultado = await inserirCategoria(novaCategoria);
      return new Response(JSON.stringify({ mensagem: resultado, novaCategoria }), { status: 200 }); // Use `new Response`
    } catch (error) {
      console.error("Erro ao inserir categoria no banco:", error);
      return new Response(JSON.stringify({ mensagem: "Erro interno no servidor." }), { status: 500 });
    }
  } else {
    return new Response(JSON.stringify({ mensagem: "Dados inválidos." }), { status: 400 });
  }
}
