import prisma from "@/data/prisma";
import Jogo from "@/app/(entidades)/jogo/jogo";

// Função para obter todos os jogos
export async function obterJogos(): Promise<Jogo[]> {
  const jogos = await prisma.jogo.findMany({
    include: {
      categorias: {
        include: {
          categoria: true, // Inclui os detalhes da categoria
        },
      },
      ofertas: true, // Inclui ofertas relacionadas ao jogo
    },
  });

  return jogos.map((jogo) => ({
    id: jogo.id,
    nome: jogo.nome,
    ano: jogo.ano,
    publisher: jogo.publisher,
    descricao: jogo.descricao,
    categorias: jogo.categorias.map((jc) => jc.categoria?.nome || ""), // Retorna apenas os nomes das categorias
    ofertas: jogo.ofertas,
    // imagemUrl: jogo.imagemUrl || null, // URL da imagem opcional
  }));
}

// Função para obter um jogo por ID
export async function obterJogoPorId(id: string): Promise<Jogo | null> {
  const jogo = await prisma.jogo.findUnique({
    where: { id },
    include: {
      categorias: {
        include: {
          categoria: true,
        },
      },
      ofertas: true,
    },
  });

  if (!jogo) return null;

  return new Jogo(
    jogo.nome,
    jogo.ano,
    jogo.publisher,
    jogo.descricao,
    jogo.categorias.map((jc) => jc.categoria?.nome || ""),
    jogo.ofertas,
    // jogo.imagemUrl || null,
    jogo.id
  );
}

// Função para inserir um novo jogo
export async function inserirJogo(jogo: Jogo): Promise<boolean> {
  try {
    await prisma.jogo.create({
      data: {
        nome: jogo.nome,
        ano: jogo.ano,
        publisher: jogo.publisher,
        descricao: jogo.descricao,
        // imagemUrl: jogo.imagemUrl || null,
        categorias: {
          create: jogo.categorias.map((categoriaId) => ({
            categoria: {
              connect: { id: categoriaId }, // Conecta pelo ID da categoria selecionada
            },
          })),
        },
      },
    });
    return true;
  } catch (error) {
    console.error("Erro ao inserir jogo:", error);
    throw new Error("Erro ao inserir jogo.");
  }
}


// Função para editar um jogo existente
export async function editarJogo(jogo: Jogo): Promise<boolean> {
  try {
    await prisma.jogo.update({
      where: { id: jogo.id },
      data: {
        nome: jogo.nome,
        ano: jogo.ano,
        publisher: jogo.publisher,
        descricao: jogo.descricao,
        // imagemUrl: jogo.imagemUrl || null,
        categorias: {
          create: jogo.categorias.map((categoriaId) => ({
            categoria: {
              connect: { id: categoriaId }, // Conecta pelo ID da categoria selecionada
            },
          })),
        },
      },
    });
    return true;
  } catch (error) {
    console.error("Erro ao editar jogo:", error);
    throw new Error("Erro ao editar jogo.");
  }
}



export async function desconectarJogoDasCategorias(id: string): Promise<void> {
  try {
    console.log(`Desconectando o jogo com ID ${id} de suas categorias...`);

    // Atualizar registros, removendo a referência de categoria
    const updateResult = await prisma.jogosCategorias.updateMany({
      where: { jogoId: id },
      data: { categoriaId: { set: null } },
    });

    console.log(`Desconectados ${updateResult.count} registros de categorias do jogo com ID ${id}.`);

    // Remover registros onde categoriaId é null
    const deleteResult = await prisma.jogosCategorias.deleteMany({
      where: { jogoId: id, categoriaId: null },
    });

    console.log(`Removidos ${deleteResult.count} registros com categoriaId null para o jogo ${id}.`);
    
  } catch (error) {
    console.error("Erro ao desconectar o jogo das categorias:", error);
    throw new Error("Erro ao desconectar o jogo das categorias.");
  }
}


// Função para remover um jogo
export async function removerJogo(id: string): Promise<boolean> {
  try {
    // Passo 1: Desconectar o jogo das categorias associadas
    console.log(`Desconectando jogo com ID ${id} de suas categorias...`);
    await desconectarJogoDasCategorias(id);

    // Verificar se o jogo foi desconectado
    const categoriasRestantes = await prisma.jogosCategorias.findMany({
      where: { jogoId: id },
    });

    console.log(`Categorias restantes associadas ao jogo ${id}:`, categoriasRestantes);

    // Se o jogo ainda tiver categorias associadas, não pode ser removido
    if (categoriasRestantes.length > 0) {
      console.log(`O jogo com ID ${id} ainda está associado a categorias.`);
      return false;
    }

    // Passo 2: Remover o jogo
    console.log(`Removendo jogo com ID ${id}...`);
    await prisma.jogo.delete({
      where: { id },
    });

    console.log(`Jogo com ID ${id} removido com sucesso.`);
    return true;

  } catch (error) {
    console.error('Erro ao remover jogo:', error);
    throw new Error('Erro ao remover jogo.');
  }
}

