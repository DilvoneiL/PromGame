import { NextResponse } from "next/server";
import { obterListaDesejosUsuario } from "@/data/listaDesejosDAO";

// 📌 Função para `GET`
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Parâmetro userId ausente." }, { status: 400 });
  }

  try {
    const lista = await obterListaDesejosUsuario(userId);
    return NextResponse.json({ lista }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
