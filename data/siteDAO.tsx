import prisma from "@/data/prisma";
import Site from "@/app/(entidades)/sites/site";

// Obter todos os sites
export async function obterSites(): Promise<Site[]> {
  const sites = await prisma.site.findMany();
  return sites.map((site) => new Site(site.nome, site.endereco, site.id));
}

// Obter site por nome
export async function obterSitePorNome(nome: string): Promise<Site | null> {
  const site = await prisma.site.findFirst({
    where: {
      nome: nome,
    },
  });

  return site ? new Site(site.nome, site.endereco, site.id) : null;
}

// Obter site por ID
export async function obterSite(id: string): Promise<Site | null> {
  const site = await prisma.site.findUnique({
    where: {
      id: id,
    },
  });

  return site ? new Site(site.nome, site.endereco, site.id) : null;
}

// Inserir novo site
export async function inserirSite(site: Site): Promise<boolean> {
  try {
    const novoSite = await prisma.site.create({
      data: {
        nome: site.nome,
        endereco: site.endereco,
      },
    });
    console.log("Site inserido com sucesso:", novoSite);
    return true;
  } catch (error) {
    console.error("Erro ao inserir site no banco de dados:", error);
    throw new Error("Erro ao inserir site no banco.");
  }
}

// Editar site existente
export async function editarSite(site: Site): Promise<boolean> {
  try {
    console.log("Site recebido para edição:", site);
    const siteEditado = await prisma.site.update({
      where: {
        id: site.id,
      },
      data: {
        nome: site.nome,
        endereco: site.endereco,
      },
    });
    return siteEditado.id === site.id;
  } catch (error) {
    console.error("Erro ao editar site:", error);
    throw new Error("Erro ao editar site.");
  }
}

// Remover site
export async function removerSite(id: string): Promise<boolean> {
  try {
    const siteRemovido = await prisma.site.delete({
      where: {
        id: id,
      },
    });
    return siteRemovido.id === id;
  } catch (error) {
    console.error("Erro ao remover site:", error);
    throw new Error("Erro ao remover site.");
  }
}

// Buscar sites por critérios genéricos (nome ou URL)
export async function buscarSite(criterio: string): Promise<Site[]> {
  try {
    console.log("Critério recebido para busca:", criterio);
    const sites = await prisma.site.findMany({
      where: {
        OR: [
          { nome: { contains: criterio, mode: "insensitive" } },
          { endereco: { contains: criterio, mode: "insensitive" } },
        ],
      },
    });
    console.log("Resultado da busca:", sites);
    return sites.map((site) => new Site(site.nome, site.endereco, site.id));
  } catch (error) {
    console.error("Erro no Prisma ao buscar sites:", error);
    throw new Error("Erro ao consultar sites no banco de dados.");
  }
}
