import { NextResponse } from "next/server";
import { buscarCategoria } from "@/data/categoriaDAO";

export async function GET(request: Request) {
  try {
    console.log("Início da requisição");
    const { searchParams } = new URL(request.url);
    const criterio = searchParams.get("criterio");
    console.log("Critério recebido:", criterio);

    const categorias = await buscarCategoria(criterio || "");
    console.log("Resultado da busca:", categorias);

    return NextResponse.json(categorias);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
