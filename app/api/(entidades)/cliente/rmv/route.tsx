import { removerCliente } from "@/data/clienteDAO";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id || typeof id !== "string") {
      return new Response(
        JSON.stringify({ mensagem: "ID inválido fornecido." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const resultado = await removerCliente(id);

    if (resultado) {
      return new Response(
        JSON.stringify({ mensagem: "Cliente removido com sucesso." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ mensagem: "Erro ao remover cliente." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Erro no backend ao remover cliente:", error);
    return new Response(
      JSON.stringify({ mensagem: "Erro interno no servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
