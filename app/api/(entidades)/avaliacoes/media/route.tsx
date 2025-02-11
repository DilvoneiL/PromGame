import { NextResponse } from "next/server";
import { obterMediaAvaliacoes } from "@/data/avaliacaoDAO";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jogoId = searchParams.get("jogoId");

    if (!jogoId) {
      return NextResponse.json({ error: "O parâmetro 'jogoId' é obrigatório." }, { status: 400 });
    }

    const media = await obterMediaAvaliacoes(jogoId);

    return NextResponse.json({ media }, { status: 200 });

  } catch (error) {
    console.error("Erro ao obter média das avaliações:", error);
    return NextResponse.json({ error: "Erro ao obter média." }, { status: 500 });
  }
}
