import { NextResponse } from "next/server";
import { inserirSite } from "@/data/siteDAO";
import Site from "@/app/(entidades)/sites/site";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação básica dos campos
    const nome = body.nome?.toString();
    const endereco = body.endereco?.toString();

    if (!nome || !endereco) {
      return NextResponse.json(
        { mensagem: "Nome e endereço são obrigatórios." },
        { status: 400 }
      );
    }

    // Criando a instância do site
    const site = new Site(nome, endereco);

    // Inserindo no banco de dados
    const sucesso = await inserirSite(site);

    if (sucesso) {
      return NextResponse.json({
        mensagem: `Site "${nome}" foi adicionado com sucesso.`,
      });
    } else {
      return NextResponse.json(
        { mensagem: "Erro ao adicionar site." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao adicionar site:", error);
    return NextResponse.json(
      { mensagem: "Erro interno ao adicionar site." },
      { status: 500 }
    );
  }
}
