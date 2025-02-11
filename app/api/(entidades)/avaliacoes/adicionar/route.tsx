import { NextResponse } from "next/server";
import { adicionarAvaliacao } from "@/data/avaliacaoDAO";

// Função para lidar com requisições `POST`
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jogoId, userId, nota } = body;

    if (!jogoId || !userId || nota === undefined) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
    }

    if (nota < 1 || nota > 5) {
      return NextResponse.json({ error: "A nota deve estar entre 1 e 5." }, { status: 400 });
    }

    await adicionarAvaliacao(jogoId, userId, nota);
    return NextResponse.json({ message: "Avaliação adicionada com sucesso!" }, { status: 201 });

  } catch (error) {
    console.error("Erro ao adicionar avaliação:", error);
    return NextResponse.json({ error: "Erro ao adicionar avaliação." }, { status: 500 });
  }
}
