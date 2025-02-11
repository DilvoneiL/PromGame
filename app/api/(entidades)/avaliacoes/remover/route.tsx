import { NextResponse } from "next/server";
import { removerAvaliacao } from "@/data/avaliacaoDAO";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "O parâmetro 'id' é obrigatório." }, { status: 400 });
    }

    const sucesso = await removerAvaliacao(id);

    if (sucesso) {
      return NextResponse.json({ message: "Avaliação removida com sucesso!" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Erro ao remover avaliação." }, { status: 500 });
    }
  } catch (error) {
    console.error("Erro ao remover avaliação:", error);
    return NextResponse.json({ error: "Erro ao remover avaliação." }, { status: 500 });
  }
}
