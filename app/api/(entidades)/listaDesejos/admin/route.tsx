import { NextResponse } from "next/server";
import { obterTodasListasDesejos } from "@/data/listaDesejosDAO";

// 📌 Função para `GET`
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("adminId");

  if (!adminId) {
    return NextResponse.json({ error: "Parâmetro adminId ausente." }, { status: 400 });
  }

  try {
    const listas = await obterTodasListasDesejos(adminId);
    return NextResponse.json({ listas }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
