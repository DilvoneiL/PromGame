import prisma from "@/data/prisma";
import Oferta from "@/app/(entidades)/oferta/oferta";

// Função para mapear uma oferta do Prisma para a classe Oferta
function mapearOferta(oferta: any): Oferta {
  return new Oferta(
    oferta.endereco,
    oferta.preco,
    oferta.siteId,
    oferta.jogoId,
    oferta.id,
    oferta.site ? { nome: oferta.site.nome } : undefined,
    oferta.jogo ? { nome: oferta.jogo.nome } : undefined
  );
}

// Função para mapear uma instância de `Oferta` para um objeto plano
function mapearOfertaParaObjeto(oferta: any) {
  return {
    id: oferta.id,
    endereco: oferta.endereco,
    preco: oferta.preco,
    site: oferta.site ? { nome: oferta.site.nome } : null,
    jogo: oferta.jogo ? { nome: oferta.jogo.nome } : null,
  };
}

// Função para obter todas as ofertas
export async function obterOfertas(): Promise<any[]> {
  const ofertas = await prisma.oferta.findMany({
    include: {
      site: true, // Inclui detalhes do site
      jogo: true, // Inclui detalhes do jogo
    },
  });

  // Mapeia todas as ofertas para objetos planos
  return ofertas.map(mapearOfertaParaObjeto);
}

// Função para obter uma oferta por ID
export async function obterOfertaPorId(id: string): Promise<any | null> {
  const oferta = await prisma.oferta.findUnique({
    where: { id },
    include: {
      site: true, // Inclui detalhes do site
      jogo: true, // Inclui detalhes do jogo
    },
  });

  return oferta ? mapearOfertaParaObjeto(oferta) : null;
}


// Inserir uma oferta associada a um jogo
export async function inserirOferta(oferta: Oferta): Promise<boolean> {
  try {
    // Garante que a oferta esteja associada a um jogo
    if (!oferta.jogoId) {
      throw new Error("A oferta deve estar associada a um jogo.");
    }

    const novaOferta = await prisma.oferta.create({
      data: {
        endereco: oferta.endereco,
        preco: oferta.preco,
        siteId: oferta.siteId,
        jogoId: oferta.jogoId,
      },
    });

    console.log("Oferta inserida com sucesso:", novaOferta);
    return true;
  } catch (error) {
    console.error("Erro ao inserir oferta:", error);
    throw new Error("Erro ao inserir oferta.");
  }
}

// Editar uma oferta existente
export async function editarOferta(oferta: Oferta): Promise<boolean> {
  try {
    // Garante que a oferta tenha um ID
    if (!oferta.id) {
      throw new Error("O ID da oferta é obrigatório para edição.");
    }

    const ofertaEditada = await prisma.oferta.update({
      where: { id: oferta.id },
      data: {
        endereco: oferta.endereco,
        preco: oferta.preco,
        siteId: oferta.siteId,
        jogoId: oferta.jogoId,
      },
    });

    console.log("Oferta editada com sucesso:", ofertaEditada);
    return ofertaEditada.id === oferta.id;
  } catch (error) {
    console.error("Erro ao editar oferta:", error);
    throw new Error("Erro ao editar oferta.");
  }
}

// Buscar ofertas por critérios (endereço ou preço)
export async function buscarOfertas(criterio: string): Promise<Oferta[]> {
  try {
    console.log("Critério recebido para busca:", criterio);

    const ofertas = await prisma.oferta.findMany({
      where: {
        OR: [
          { endereco: { contains: criterio, mode: "insensitive" } },
          { preco: !isNaN(parseFloat(criterio)) ? parseFloat(criterio) : undefined },
        ],
      },
      include: {
        site: true,
        jogo: true,
      },
    });

    console.log("Ofertas encontradas:", ofertas);
    return ofertas.map(mapearOferta);
  } catch (error) {
    console.error("Erro ao buscar ofertas:", error);
    throw new Error("Erro ao buscar ofertas.");
  }
}

// Remover oferta
export async function removerOferta(id: string): Promise<boolean> {
  try {
    const ofertaRemovida = await prisma.oferta.delete({
      where: {
        id: id,
      },
    });
    return ofertaRemovida.id === id;
  } catch (error) {
    console.error("Erro ao remover oferta:", error);
    throw new Error("Erro ao remover oferta.");
  }
}

// Buscar ofertas por critérios genéricos (endereço ou preço)
// export async function buscarOferta(criterio: string): Promise<Oferta[]> {
//   try {
//     console.log("Critério recebido para busca:", criterio);
//     const ofertas = await prisma.oferta.findMany({
//       where: {
//         OR: [
//           { endereco: { contains: criterio, mode: "insensitive" } },
//           { preco: isNaN(parseFloat(criterio)) ? undefined : parseFloat(criterio) }, // Busca por preço, se numérico
//         ],
//       },
//       include: {
//         site: true, // Inclui informações do site relacionado
//         jogo: true, // Inclui informações do jogo relacionado
//       },
//     });
//     console.log("Resultado da busca:", ofertas);
//     return ofertas.map((oferta) =>
//       new Oferta(oferta.endereco, oferta.preco, oferta.siteId, oferta.jogoId, oferta.id)
//     );
//   } catch (error) {
//     console.error("Erro no Prisma ao buscar ofertas:", error);
//     throw new Error("Erro ao consultar ofertas no banco de dados.");
//   }
// }

// Obter ranking de ofertas de jogos (pegando apenas a melhor oferta por jogo)
export async function obterRankingOfertas(): Promise<any[]> {
  try {
    // Agrupa por jogo e pega a oferta mais barata de cada um
    const ofertasAgrupadas = await prisma.oferta.groupBy({
      by: ["jogoId"],
      _min: { preco: true },
      orderBy: { _min: { preco: "asc" } }, // Ordena pelo menor preço
    });

    // Buscar detalhes dos jogos e sites para as ofertas mais baratas
    const ofertasDetalhadas = await Promise.all(
      ofertasAgrupadas.map(async (oferta) => {
        const detalhes = await prisma.oferta.findFirst({
          where: {
            jogoId: oferta.jogoId,
            preco: oferta._min.preco, // Pega a menor oferta do jogo
          },
          include: {
            jogo: true,
            site: true,
          },
        });

        return {
          posicao: 0, // Será definido depois
          jogo: {
            id: detalhes?.jogo?.id || "",
            nome: detalhes?.jogo?.nome || "Jogo desconhecido",
            imagemUrl: detalhes?.jogo?.imagemUrl || "/placeholder.png",
          },
          oferta: {
            preco: detalhes?.preco.toFixed(2),
            endereco: detalhes?.endereco,
          },
          site: detalhes?.site?.nome || "Site desconhecido",
        };
      })
    );

    // Ordenar manualmente e definir a posição no ranking
    ofertasDetalhadas.sort((a, b) => parseFloat(a.oferta.preco) - parseFloat(b.oferta.preco));
    ofertasDetalhadas.forEach((oferta, index) => (oferta.posicao = index + 1));

    return ofertasDetalhadas;
  } catch (error) {
    console.error("Erro ao obter ranking de ofertas:", error);
    throw new Error("Erro ao gerar ranking de ofertas.");
  }
}
