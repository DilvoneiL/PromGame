import { NextResponse } from "next/server";
import { removerCategoria } from "@/data/categoriaDAO";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  console.log("ID recebido:", id);

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { mensagem: "ID é obrigatório e deve ser uma string válida." },
      { status: 400 }
    );
  }

  try {
    const sucesso = await removerCategoria(id);
    if (sucesso) {
      return NextResponse.json(
        { mensagem: "Categoria removida com sucesso." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { mensagem: "Categoria não encontrada." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao remover categoria:", error);
    return NextResponse.json(
      { mensagem: "Erro ao remover categoria." },
      { status: 500 }
    );
  }
}
