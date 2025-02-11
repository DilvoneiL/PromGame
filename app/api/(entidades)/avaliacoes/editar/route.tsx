import { NextResponse } from "next/server";
import { editarAvaliacao } from "@/data/avaliacaoDAO";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nota } = body;

    if (!id || nota === undefined) {
      return NextResponse.json({ error: "ID e nota são obrigatórios." }, { status: 400 });
    }

    if (nota < 1 || nota > 5) {
      return NextResponse.json({ error: "A nota deve estar entre 1 e 5." }, { status: 400 });
    }

    const sucesso = await editarAvaliacao(id, nota);

    if (sucesso) {
      return NextResponse.json({ message: "Avaliação editada com sucesso!" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Erro ao editar avaliação." }, { status: 500 });
    }
  } catch (error) {
    console.error("Erro ao editar avaliação:", error);
    return NextResponse.json({ error: "Erro ao editar avaliação." }, { status: 500 });
  }
}
