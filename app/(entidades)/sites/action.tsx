"use server";
import { z } from "zod";
import Site from "@/app/(entidades)/sites/site"; // Importe a entidade Site, caso exista
import { revalidatePath } from "next/cache";
import { 
  obterSites, 
  obterSite, 
  inserirSite, 
  editarSite, 
  removerSite, 
  buscarSite 
} from "@/data/siteDAO";

// Adicionar novo site
export async function adicionarSite(formData: FormData) {
  try {
    const nome = formData.get("nome")?.toString() || "";
    const endereco = formData.get("endereco")?.toString() || "";

    if (!nome || !endereco) {
      return { mensagem: "Nome e endereço são obrigatórios." };
    }

    const sucesso = await inserirSite({ nome, endereco } as any);
    if (sucesso) {
      revalidatePath("/site");
      return { mensagem: `Site "${nome}" adicionado com sucesso.` };
    } else {
      return { mensagem: "Erro ao adicionar site." };
    }
  } catch (error) {
    console.error("Erro ao adicionar site:", error);
    return { mensagem: "Erro ao adicionar site. Tente novamente." };
  }
}

export async function editarSiteAction(prevState: any, formData: FormData) {
  const schema = z.object({
    id: z.string().min(1, "ID inválido"),
    nome: z.string().min(1, "Informe o nome do site"),
    endereco: z.string().url("Informe um endereço válido"),
  });

  const parse = schema.safeParse({
    id: formData.get("id"),
    nome: formData.get("nome"),
    endereco: formData.get("endereco"),
  });

  if (!parse.success) {
    return { mensagem: "Falha ao editar o site. Verifique os dados do formulário." };
  }

  const site = parse.data;

  const siteEditado = new Site(site.nome, site.endereco, site.id);

  const resultado = await editarSite(siteEditado);

  if (resultado) {
    revalidatePath("/sites");
    return { mensagem: `Site com ID: ${site.id} foi editado com sucesso.` };
  } else {
    return { mensagem: `Não foi possível editar o site com ID: ${site.id}` };
  }
}

// Remover site
export async function removerSiteAction(id: string) {
  try {
    if (!id) {
      return { mensagem: "ID é obrigatório." };
    }

    const sucesso = await removerSite(id);
    if (sucesso) {
      revalidatePath("/site");
      return { mensagem: `Site com ID "${id}" removido com sucesso.` };
    } else {
      return { mensagem: "Erro ao remover site." };
    }
  } catch (error) {
    console.error("Erro ao remover site:", error);
    return { mensagem: "Erro ao remover site. Tente novamente." };
  }
}

// Obter todos os sites
export async function listarSites() {
  return await obterSites();
}

// Obter site por ID
export async function buscarSitePorId(id: string) {
  return await obterSite(id);
}
