import type { Cliente } from "@prisma/client";
import prisma from "@/data/prisma";

type ClienteInput = {
  id?: string;
  nome: string;
  email: string;
  senha?: string | null;
};

export async function obterClientes(): Promise<Cliente[]> {
  return await prisma.cliente.findMany();
}

export async function obterClientePorNome(nome: string): Promise<Cliente> {

  const cliente = await prisma.cliente.findFirst({
    where: {
      nome: nome
    }
  });

  return cliente ?? { id: "", nome: "", email: "", senha: null };
}

export async function obterCliente(id: string): Promise<Cliente> {

  const cliente = await prisma.cliente.findUnique({
    where: {
      id: id
    }
  });

  return cliente ?? { id: "", nome: "", email: "", senha: null };
}

// Função para obter o próximo valor da sequência para IDs incrementais
async function getNextSequence(name: string): Promise<number> {
  try {
    const result = await prisma.$runCommandRaw({
      update: "counters", // Nome da coleção de contadores
      updates: [
        {
          q: { _id: name },
          u: { $inc: { sequence_value: 1 } },
          upsert: true, // Cria o documento se ele não existir
        },
      ],
    }) as { ok?: number; n?: number; nModified?: number };

    if (result.ok === 1 && ((result.nModified ?? result.n ?? 0) > 0)) {
      // Busca o valor atualizado do contador
      const counter = await prisma.$runCommandRaw({
        find: "counters",
        filter: { _id: name },
      }) as { cursor?: { firstBatch?: Array<{ sequence_value: number }> } };

      const counterDocument = counter.cursor?.firstBatch?.[0];
      if (counterDocument) {
        return counterDocument.sequence_value;
      } else {
        throw new Error(`Erro ao buscar o contador atualizado para ${name}`);
      }
    } else {
      throw new Error(`Erro ao incrementar o contador para ${name}`);
    }
  } catch (error) {
    console.error("Erro ao obter a sequência para IDs incrementais:", error);
    throw error;
  }
}

// Função para inserir um cliente com ID incremental
export async function inserirCliente(cliente: ClienteInput): Promise<boolean> {
  try {
    // Obtém o próximo valor da sequência
    const nextId = await getNextSequence("clienteId");

    // Insere o cliente no banco de dados
    const novoCliente = await prisma.cliente.create({
      data: {
        id: nextId.toString(), // Converte o ID para string
        nome: cliente.nome,
        email: cliente.email,
        senha: cliente.senha,
      },
    });

    console.log("Cliente inserido com sucesso:", novoCliente);
    return true;
  } catch (error) {
    console.error("Erro ao inserir cliente no banco de dados:", error);
    throw new Error("Erro ao inserir cliente no banco.");
  }
}


export async function editarCliente(cliente: ClienteInput): Promise<boolean> {

  const clienteEditado = await prisma.cliente.update({
    where: {
      id: cliente.id,
    },
    data: {
      nome: cliente.nome,
      email: cliente.email,
    },
  })

  return clienteEditado.id === cliente.id;
}

export async function login(email: string, senha: string): Promise<boolean> {
  const cliente = await prisma.cliente.findUnique({
    where: { email },
  });

  return cliente?.senha === senha;
}


export async function removerCliente(id: string): Promise<boolean> {

  const clienteRemovido = await prisma.cliente.delete({
    where: {
      id: id
    }
  });

  return clienteRemovido.id === id;
}
