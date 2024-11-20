"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  obterCategorias,
  obterCategoria,
  obterCategoriaPorNome,
  inserirCategoria,
  editarCategoria,
  removerCategoria,
} from "@/data/categoriaDAO";
import Categoria from "@/app/(entidades)/categoria/categoria";

// Helper para requisições
async function post(url: string, obj: string) {
  console.log("Enviando requisição para:", url);
  console.log("Payload:", obj);

  const res = await fetch(url, { method: "POST", body: obj });
  console.log("Status da resposta:", res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erro na resposta da API:", errorText);
    throw new Error("Falha em executar a ação do formulário.");
  }
  return res.json();
}

// Adicionar nova categoria
export async function adicionarCategoria(prevState: any, formData: FormData) {
  const schema = z.object({
    nome: z.string().min(1, "Informe o nome da categoria"),
    descricao: z.string().min(1, "Informe a descrição da categoria"),
  });

  // Certifique-se de que `formData` não é `undefined`
  if (!formData) {
    return { mensagem: "Erro: Dados do formulário estão ausentes." };
  }

  const parse = schema.safeParse({
    nome: formData.get("nome"), // Acessando os campos de nome e descrição
    descricao: formData.get("descricao"),
  });

  if (!parse.success) {
    return { mensagem: "Falha ao adicionar a categoria. Verifique os dados do formulário." };
  }

  const categoria = parse.data;

  try {
    const resultado = await inserirCategoria(new Categoria(categoria.nome, categoria.descricao,""));
    if (resultado) {
      revalidatePath("/categoria");
      return { mensagem: `Categoria adicionada com sucesso: ${categoria.nome}` };
    } else {
      return { mensagem: `Não foi possível adicionar a categoria: ${categoria.nome}` };
    }
  } catch (error) {
    console.error("Erro ao adicionar categoria:", error);
    return { mensagem: "Erro ao adicionar categoria. Tente novamente." };
  }
}


// Editar categoria
export async function editarCategoriaAction(prevState: any, formData: FormData) {
  const schema = z.object({
    id: z.string().min(1, "ID inválido"),
    nome: z.string().min(1, "Informe o nome da categoria"),
    descricao: z.string().min(1, "Informe a descrição da categoria"),
  });

  const parse = schema.safeParse({
    id: formData.get("id"),
    nome: formData.get("nome"),
    descricao: formData.get("descricao"),
  });

  if (!parse.success) {
    return { mensagem: "Falha ao editar a categoria. Verifique os dados do formulário." };
  }

  const categoria = parse.data;

  const categoriaEditada = new Categoria(categoria.nome, categoria.descricao, categoria.id);

  const resultado = await editarCategoria(categoriaEditada);

  if (resultado) {
    revalidatePath("/categoria");
    return { mensagem: `Categoria com ID: ${categoria.id} foi editada.` };
  } else {
    return { mensagem: `Não foi possível editar a categoria com ID: ${categoria.id}` };
  }
}

// Remover categoria
export async function removerCategoriaAction(id: string) {
  if (!id || typeof id !== "string" || id.trim() === "") {
    return { mensagem: "ID inválido para remoção." };
  }

  const resultado = await removerCategoria(id);

  if (resultado) {
    revalidatePath("/categoria");
    return { mensagem: `Categoria com ID: ${id} foi removida.` };
  } else {
    return { mensagem: `Não foi possível remover a categoria com ID: ${id}` };
  }
}

// Obter todas as categorias
export async function listarCategorias() {
  const categorias = await obterCategorias();
  return categorias;
}

// Obter categoria por ID
export async function buscarCategoriaPorId(id: string) {
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new Error("ID inválido.");
  }

  const categoria = await obterCategoria(id);
  return categoria;
}

// Obter categoria por nome
export async function buscarCategoriaPorNome(nome: string) {
  if (!nome || typeof nome !== "string" || nome.trim() === "") {
    throw new Error("Nome inválido.");
  }

  const categoria = await obterCategoriaPorNome(nome);
  return categoria;
}
