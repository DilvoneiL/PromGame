import { NextResponse } from "next/server";
import { editarSite } from "@/data/siteDAO";
import Site from "@/app/(entidades)/sites/site";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Validação básica dos campos
    const id = body.id?.toString();
    const nome = body.nome?.toString();
    const endereco = body.endereco?.toString();

    if (!id || !nome || !endereco) {
      return NextResponse.json(
        { mensagem: "Os campos 'id', 'nome' e 'endereco' são obrigatórios." },
        { status: 400 }
      );
    }

    // Criando a instância do site
    const site = new Site(nome, endereco, id);

    // Editando o site no banco de dados
    const sucesso = await editarSite(site);

    if (sucesso) {
      return NextResponse.json({
        mensagem: `Site com ID "${id}" foi editado com sucesso.`,
      });
    } else {
      return NextResponse.json(
        { mensagem: "Erro ao editar site." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao editar site:", error);
    return NextResponse.json(
      { mensagem: "Erro interno ao editar site." },
      { status: 500 }
    );
  }
}
