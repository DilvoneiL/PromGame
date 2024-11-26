import { NextRequest, NextResponse } from "next/server";
import { obterSite } from "@/data/siteDAO";

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
    const site = await obterSite(id);

    if (!site) {
      return NextResponse.json(
        { mensagem: "Site não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(site, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter site:", error);
    return NextResponse.json(
      { mensagem: "Erro ao obter site." },
      { status: 500 }
    );
  }
}
