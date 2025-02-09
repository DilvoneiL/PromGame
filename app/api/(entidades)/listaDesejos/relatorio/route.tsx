import { NextResponse } from "next/server";
import { gerarRelatorioJogosMaisDesejados } from "@/data/listaDesejosDAO";

//Função para `GET` (agora qualquer usuário pode acessar)
export async function GET() {
  try {
    const relatorio = await gerarRelatorioJogosMaisDesejados();
    return NextResponse.json(relatorio, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
