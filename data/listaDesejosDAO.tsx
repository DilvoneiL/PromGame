import prisma from "@/data/prisma";

// Adicionar um jogo à lista de desejos do usuário
export async function adicionarJogoListaDesejos(userId: string, jogoId: string): Promise<boolean> {
  try {
    // Verifica se o jogo já está na lista de desejos do usuário
    const existente = await prisma.listaDesejos.findFirst({
      where: { userId, jogoId },
    });

    if (existente) {
      throw new Error("Jogo já está na lista de desejos.");
    }

    await prisma.listaDesejos.create({
      data: {
        userId,
        jogoId,
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao adicionar jogo à lista de desejos:", error);
    throw new Error("Erro ao adicionar jogo à lista de desejos.");
  }
}

// Remover um jogo da lista de desejos do usuário
export async function removerJogoListaDesejos(userId: string, jogoId: string): Promise<boolean> {
  try {
    const deletado = await prisma.listaDesejos.deleteMany({
      where: { userId, jogoId },
    });

    return deletado.count > 0;
  } catch (error) {
    console.error("Erro ao remover jogo da lista de desejos:", error);
    throw new Error("Erro ao remover jogo da lista de desejos.");
  }
}

// Obter a lista de desejos de um usuário (Apenas para o próprio usuário)
export async function obterListaDesejosUsuario(userId: string) {
  try {
    const lista = await prisma.listaDesejos.findMany({
      where: { userId },
      include: { jogo: true },
    });

    return lista.map((item) => ({
      id: item.id,
      idJogo: item.jogoId,
      nomeJogo: item.jogo.nome,
      descricao: item.jogo.descricao,
      imagemUrl: item.jogo.imagemUrl,
    }));
  } catch (error) {
    console.error("Erro ao obter lista de desejos:", error);
    throw new Error("Erro ao obter lista de desejos.");
  }
}

// Obter todas as listas de desejos (Apenas para Administradores)
export async function obterTodasListasDesejos(adminId: string) {
  try {
    // Verifica se o usuário é administrador
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== "ADMIN") {
      throw new Error("Acesso negado. Apenas administradores podem visualizar todas as listas.");
    }

    const listas = await prisma.listaDesejos.findMany({
      include: {
        user: true,
        jogo: true,
      },
    });

    return listas.map((item) => ({
      id: item.id,
      usuario: item.user.name,
      emailUsuario: item.user.email,
      nomeJogo: item.jogo.nome,
      descricao: item.jogo.descricao,
      imagemUrl: item.jogo.imagemUrl,
    }));
  } catch (error) {
    console.error("Erro ao obter todas as listas de desejos:", error);
    throw new Error("Erro ao obter todas as listas de desejos.");
  }
}



// Gerar relatório dos jogos mais adicionados às listas de desejos (Acesso aberto)
export async function gerarRelatorioJogosMaisDesejados() {
  try {
    // Agrupa os jogos mais desejados com a contagem de listas de desejos
    const jogosMaisDesejados = await prisma.listaDesejos.groupBy({
      by: ["jogoId"],
      _count: { jogoId: true },
      orderBy: { _count: { jogoId: "desc" } },
      take: 10, // Retorna os 10 jogos mais desejados
    });

    // Buscar detalhes completos dos jogos
    const jogosDetalhes = await Promise.all(
      jogosMaisDesejados.map(async (jogo) => {
        const detalhes = await prisma.jogo.findUnique({
          where: { id: jogo.jogoId },
          include: {
            categorias: {
              include: { categoria: true },
            },
            ofertas: true,
          },
        });

        return {
          id: detalhes?.id,
          nome: detalhes?.nome,
          descricao: detalhes?.descricao,
          ano: detalhes?.ano,
          publisher: detalhes?.publisher,
          imagemUrl: detalhes?.imagemUrl || "/upload.png",
          categorias: detalhes?.categorias.map((c) => c.categoria.nome) || [],
          ofertas: detalhes?.ofertas.map((oferta) => ({
            id: oferta.id,
            endereco: oferta.endereco,
            preco: oferta.preco,
          })) || [],
          quantidadeDesejos: jogo._count.jogoId, // Número de vezes que apareceu na lista de desejos
        };
      })
    );

    // Ordenando os jogos corretamente do mais desejado para o menos desejado
    jogosDetalhes.sort((a, b) => b.quantidadeDesejos - a.quantidadeDesejos);

    return jogosDetalhes;
  } catch (error) {
    console.error("Erro ao gerar relatório de jogos mais desejados:", error);
    throw new Error("Erro ao gerar relatório.");
  }
}

