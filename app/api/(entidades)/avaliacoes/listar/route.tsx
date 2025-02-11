import { NextResponse } from "next/server";
import { obterAvaliacoesPorJogo } from "@/data/avaliacaoDAO";

// Função para lidar com requisições `GET`
export async function GET(req: Request) {
  try {
    // Pega o ID do jogo da URL (exemplo: /api/avaliacoes/listar?jogoId=123)
    const { searchParams } = new URL(req.url);
    const jogoId = searchParams.get("jogoId");

    if (!jogoId) {
      return NextResponse.json({ error: "O parâmetro 'jogoId' é obrigatório." }, { status: 400 });
    }

    const avaliacoes = await obterAvaliacoesPorJogo(jogoId);
    
    return NextResponse.json(avaliacoes, { status: 200 });

  } catch (error) {
    console.error("Erro ao listar avaliações:", error);
    return NextResponse.json({ error: "Erro ao listar avaliações." }, { status: 500 });
  }
}
