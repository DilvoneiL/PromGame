import { NextResponse } from "next/server";
import { removerJogoListaDesejos } from "@/data/listaDesejosDAO";

//  Função para `DELETE`
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId, jogoId } = body;

    if (!userId || !jogoId) {
      return NextResponse.json({ error: "Parâmetros ausentes." }, { status: 400 });
    }

    const sucesso = await removerJogoListaDesejos(userId, jogoId);
    return NextResponse.json({ sucesso }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
