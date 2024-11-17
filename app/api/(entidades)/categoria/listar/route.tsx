import { NextResponse } from "next/server";
import { obterCategorias } from "@/data/categoriaDAO";

export async function GET() {
  try {
    const categorias = await obterCategorias();
    return NextResponse.json(categorias, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter categorias:", error);
    return NextResponse.json(
      { mensagem: "Erro ao obter categorias." },
      { status: 500 }
    );
  }
}
