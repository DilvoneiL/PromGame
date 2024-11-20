import { NextRequest, NextResponse } from "next/server";
import { obterCategoria } from "@/data/categoriaDAO";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { mensagem: "ID é obrigatório." },
      { status: 400 }
    );
  }

  try {
    const categoria = await obterCategoria(id);

    if (!categoria) {
      return NextResponse.json(
        { mensagem: "Categoria não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(categoria, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter categoria:", error);
    return NextResponse.json(
      { mensagem: "Erro ao obter categoria." },
      { status: 500 }
    );
  }
}
