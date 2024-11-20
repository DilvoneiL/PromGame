import { NextRequest, NextResponse } from "next/server";
import { editarCategoria } from "@/data/categoriaDAO";
import Categoria from "@/app/(entidades)/categoria/categoria";

export async function PUT(req: NextRequest) {
  try {
    // Recebendo o corpo da requisição
    const body = await req.json();
    console.log("Corpo da requisição recebido:", body);

    const { id, nome, descricao } = body;

    // Validação dos dados recebidos
    if (!id || typeof id !== "string" || id.trim() === "") {
      return NextResponse.json(
        { mensagem: "ID inválido ou ausente." },
        { status: 400 }
      );
    }

    if (!nome || typeof nome !== "string" || nome.trim() === "") {
      return NextResponse.json(
        { mensagem: "Nome inválido ou ausente." },
        { status: 400 }
      );
    }

    if (!descricao || typeof descricao !== "string" || descricao.trim() === "") {
      return NextResponse.json(
        { mensagem: "Descrição inválida ou ausente." },
        { status: 400 }
      );
    }

    // Criando instância de Categoria com a ordem correta
    const categoriaEditada = new Categoria(nome, descricao, id);

    console.log("Categoria a ser editada:", categoriaEditada);

    // Chamando o DAO para editar a categoria
    const resultado = await editarCategoria(categoriaEditada);

    if (resultado) {
      return NextResponse.json(
        { mensagem: `Categoria com ID ${id} foi editada com sucesso.` },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { mensagem: `Categoria com ID ${id} não foi encontrada.` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao editar categoria:", error);

    return NextResponse.json(
      { mensagem: "Erro ao editar categoria." },
      { status: 500 }
    );
  }
}
