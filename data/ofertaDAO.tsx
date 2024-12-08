import prisma from "@/data/prisma";
import Oferta from "@/app/(entidades)/oferta/oferta";

// Função para obter todas as ofertas
export async function obterOfertas(): Promise<Oferta[]> {
  const ofertas = await prisma.oferta.findMany({
    include: {
      site: true, // Inclui detalhes do site relacionado
    },
  });

  return ofertas.map((oferta) => ({
    id: oferta.id,
    endereco: oferta.endereco,
    preco: oferta.preco,
    siteId: oferta.siteId,
    site: oferta.site, // Detalhes do site
  }));
}

// Obter oferta por ID
export async function obterOferta(id: string): Promise<Oferta | null> {
  const oferta = await prisma.oferta.findUnique({
    where: {
      id: id,
    },
    include: {
      site: true, // Inclui informações do site relacionado
    },
  });

  return oferta
    ? new Oferta(oferta.endereco, oferta.preco, oferta.siteId, oferta.id)
    : null;
}

// Inserir nova oferta
export async function inserirOferta(oferta: Oferta): Promise<boolean> {
  try {
    const novaOferta = await prisma.oferta.create({
      data: {
        endereco: oferta.endereco,
        preco: oferta.preco,
        siteId: oferta.siteId, // Relaciona com o site
      },
    });
    console.log("Oferta inserida com sucesso:", novaOferta);
    return true;
  } catch (error) {
    console.error("Erro ao inserir oferta no banco de dados:", error);
    throw new Error("Erro ao inserir oferta no banco.");
  }
}

// Editar oferta existente
export async function editarOferta(oferta: Oferta): Promise<boolean> {
  try {
    console.log("Oferta recebida para edição:", oferta);
    const ofertaEditada = await prisma.oferta.update({
      where: {
        id: oferta.id,
      },
      data: {
        endereco: oferta.endereco,
        preco: oferta.preco,
        siteId: oferta.siteId, // Atualiza o relacionamento com o site, se necessário
      },
    });
    return ofertaEditada.id === oferta.id;
  } catch (error) {
    console.error("Erro ao editar oferta:", error);
    throw new Error("Erro ao editar oferta.");
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
export async function buscarOferta(criterio: string): Promise<Oferta[]> {
  try {
    console.log("Critério recebido para busca:", criterio);
    const ofertas = await prisma.oferta.findMany({
      where: {
        OR: [
          { endereco: { contains: criterio, mode: "insensitive" } },
          { preco: parseFloat(criterio) || 0 }, // Busca por preço, se numérico
        ],
      },
      include: {
        site: true, // Inclui informações do site relacionado
      },
    });
    console.log("Resultado da busca:", ofertas);
    return ofertas.map((oferta) =>
      new Oferta(oferta.endereco, oferta.preco, oferta.siteId, oferta.id)
    );
  } catch (error) {
    console.error("Erro no Prisma ao buscar ofertas:", error);
    throw new Error("Erro ao consultar ofertas no banco de dados.");
  }
}
