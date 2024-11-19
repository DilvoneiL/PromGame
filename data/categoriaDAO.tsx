import prisma from "@/data/prisma";
import Categoria from "@/app/(entidades)/categoria/categoria";

// Obter todas as categorias
export async function obterCategorias(): Promise<Categoria[]> {
  const categorias = await prisma.categoria.findMany();
  return categorias.map((cat) => new Categoria(cat.nome, cat.descricao, cat.id));
}


// Obter categoria por nome
export async function obterCategoriaPorNome(nome: string): Promise<Categoria | null> {
  const categoria = await prisma.categoria.findFirst({
    where: {
      nome: nome,
    },
  });

  return categoria ? new Categoria(categoria.id, categoria.nome, categoria.descricao) : null;
}

// Obter categoria por ID
export async function obterCategoria(id: string): Promise<Categoria | null> {
  const categoria = await prisma.categoria.findUnique({
    where: {
      id: id,
    },
  });

  return categoria ? new Categoria(categoria.id, categoria.nome, categoria.descricao) : null;
}

// Inserir nova categoria
export async function inserirCategoria(categoria: Categoria): Promise<boolean> {
  try {
    const novaCategoria = await prisma.categoria.create({
      data: {
        nome: categoria.nome,
        descricao: categoria.descricao,
      },
    });
    console.log("Categoria inserida com sucesso:", novaCategoria);
    return true;
  } catch (error) {
    console.error("Erro ao inserir categoria no banco de dados:", error);
    throw new Error("Erro ao inserir categoria no banco.");
  }
}

// Editar categoria existente
export async function editarCategoria(categoria: Categoria): Promise<boolean> {
  try {
    const categoriaEditada = await prisma.categoria.update({
      where: {
        id: categoria.id,
      },
      data: {
        nome: categoria.nome,
        descricao: categoria.descricao,
      },
    });
    return categoriaEditada.id === categoria.id;
  } catch (error) {
    console.error("Erro ao editar categoria:", error);
    throw new Error("Erro ao editar categoria.");
  }
}

// Remover categoria
export async function removerCategoria(id: string): Promise<boolean> {
  try {
    const categoriaRemovida = await prisma.categoria.delete({
      where: {
        id: id,
      },
    });
    return categoriaRemovida.id === id;
  } catch (error) {
    console.error("Erro ao remover categoria:", error);
    throw new Error("Erro ao remover categoria.");
  }
}
