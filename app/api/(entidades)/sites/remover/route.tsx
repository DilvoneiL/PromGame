import { NextResponse } from "next/server";
import { removerSite } from "@/data/siteDAO";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { mensagem: "O parâmetro 'id' é obrigatório." },
        { status: 400 }
      );
    }

    const sucesso = await removerSite(id);

    if (sucesso) {
      return NextResponse.json({
        mensagem: `Site com ID "${id}" foi removido com sucesso.`,
      });
    } else {
      return NextResponse.json(
        { mensagem: "Erro ao remover site." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao remover site:", error);
    return NextResponse.json(
      { mensagem: "Erro interno ao remover site." },
      { status: 500 }
    );
  }
}
