import { inserirCliente } from "@/data/clienteDAO";
import Cliente from "@/app/(entidades)/cliente/cliente";

export async function POST(request: Request) {
  const { nome, email, senha } = await request.json(); // Removido `id` do corpo da requisição

  if (nome && email) { // Verifica apenas `nome` e `email`, já que `id` será gerado automaticamente
    const novoCliente = new Cliente(undefined, nome, email, senha || ""); // `id` como undefined
    console.log("Objeto Cliente criado para o banco:", novoCliente);

    try {
      const resultado = await inserirCliente(novoCliente); // Insere o cliente
      return new Response(JSON.stringify({ mensagem: resultado }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Erro ao inserir cliente no banco:", error);
      return new Response(
        JSON.stringify({ mensagem: "Erro interno no servidor." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } else {
    return new Response(
      JSON.stringify({ mensagem: "Dados inválidos." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
