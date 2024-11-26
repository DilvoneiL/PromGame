import { NextResponse } from "next/server";
import { obterSites } from "@/data/siteDAO";

export async function GET() {
  try {
    const sites = await obterSites(); // Chama diretamente o DAO
    return NextResponse.json(sites); // Retorna os sites como JSON
  } catch (error) {
    console.error("Erro ao listar sites:", error);
    return NextResponse.json(
      { mensagem: "Erro ao listar sites." },
      { status: 500 }
    );
  }
}
