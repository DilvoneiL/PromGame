import { NextResponse } from "next/server";
import { gerarRelatorioJogosMaisDesejados } from "@/data/listaDesejosDAO";

// Função para `GET`
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("adminId");

  if (!adminId) {
    return NextResponse.json({ error: "Parâmetro adminId ausente." }, { status: 400 });
  }

  try {
    const relatorio = await gerarRelatorioJogosMaisDesejados(adminId);
    return NextResponse.json({ relatorio }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
