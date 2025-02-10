import { NextRequest, NextResponse } from "next/server";
import { obterRankingOfertas } from "@/data/ofertaDAO";

// Exportação nomeada para o método GET
export async function GET(req: NextRequest) {
  try {
    const ranking = await obterRankingOfertas();
    return NextResponse.json(ranking, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter ranking de ofertas:", error);
    return NextResponse.json({ error: "Erro ao obter ranking de ofertas." }, { status: 500 });
  }
}
