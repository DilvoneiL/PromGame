import { NextResponse } from "next/server";
import { obterOfertas } from "@/data/ofertaDAO";

export async function GET(request: Request) {
  try {
    // Obtém o parâmetro `jogoId` da URL, se existir
    const { searchParams } = new URL(request.url);
    const jogoId = searchParams.get("jogoId") || undefined;

    // Chama a função obterOfertas passando o jogoId (se fornecido)
    const ofertas = await obterOfertas(jogoId);

    // Retorna as ofertas em formato JSON
    return NextResponse.json(ofertas, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar ofertas:", error);
    return NextResponse.json(
      { mensagem: "Erro ao listar ofertas." },
      { status: 500 }
    );
  }
}
