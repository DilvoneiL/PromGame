import prisma from "@/data/prisma";

// Adicionar avaliação
export async function adicionarAvaliacao(jogoId: string, userId: string, nota: number): Promise<boolean> {
  try {
    if (nota < 1 || nota > 5) {
      throw new Error("A nota deve estar entre 1 e 5.");
    }

    await prisma.avaliacao.create({
      data: {
        jogoId,
        userId,
        nota,
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao adicionar avaliação:", error);
    throw new Error("Erro ao adicionar avaliação.");
  }
}

// Editar avaliação
export async function editarAvaliacao(id: string, nota: number): Promise<boolean> {
  try {
    if (nota < 1 || nota > 5) {
      throw new Error("A nota deve estar entre 1 e 5.");
    }

    await prisma.avaliacao.update({
      where: { id },
      data: { nota },
    });

    return true;
  } catch (error) {
    console.error("Erro ao editar avaliação:", error);
    throw new Error("Erro ao editar avaliação.");
  }
}

// Remover avaliação
export async function removerAvaliacao(id: string): Promise<boolean> {
  try {
    await prisma.avaliacao.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    console.error("Erro ao remover avaliação:", error);
    throw new Error("Erro ao remover avaliação.");
  }
}

// Obter todas as avaliações de um jogo
export async function obterAvaliacoesPorJogo(jogoId: string) {
  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      where: { jogoId },
      include: { user: true }, // Inclui os dados do usuário que avaliou
    });

    return avaliacoes.map(avaliacao => ({
      id: avaliacao.id,
      jogoId: avaliacao.jogoId,
      userId: avaliacao.userId,
      nomeUsuario: avaliacao.user.name,
      nota: avaliacao.nota,
      createdAt: avaliacao.createdAt,
    }));
  } catch (error) {
    console.error("Erro ao obter avaliações do jogo:", error);
    throw new Error("Erro ao obter avaliações.");
  }
}

// Calcular a média das avaliações de um jogo
export async function obterMediaAvaliacoes(jogoId: string): Promise<number> {
  try {
    const media = await prisma.avaliacao.aggregate({
      where: { jogoId },
      _avg: { nota: true },
    });

    return media._avg.nota || 0;
  } catch (error) {
    console.error("Erro ao calcular a média das avaliações:", error);
    throw new Error("Erro ao calcular a média.");
  }
}
