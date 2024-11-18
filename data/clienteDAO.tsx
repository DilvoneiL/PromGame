import { Cliente } from "prisma/prisma-client";
import prisma from "@/data/prisma";

export async function obterClientes(): Promise<Cliente[]> {
  return await prisma.cliente.findMany();
}

export async function obterClientePorNome(nome: string): Promise<Cliente> {

  const cliente = await prisma.cliente.findFirst({
    where: {
      nome: nome
    }
  });

  return cliente ?? { id: 0, nome: "", email: "" };
}

export async function obterCliente(id: string): Promise<Cliente> {

  const cliente = await prisma.cliente.findUnique({
    where: {
      id: id
    }
  });

  return cliente ?? { id: 0, nome: "", email: "" };
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
    });

    if (result.ok === 1 && result.nModified > 0) {
      // Busca o valor atualizado do contador
      const counter = await prisma.$runCommandRaw({
        find: "counters",
        filter: { _id: name },
      });

      if (counter.cursor?.firstBatch?.length > 0) {
        return counter.cursor.firstBatch[0].sequence_value;
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
export async function inserirCliente(cliente: Cliente): Promise<boolean> {
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


export async function editarCliente(cliente: Cliente): Promise<boolean> {

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


export async function removerCliente(id: string): Promise<boolean> {

  const clienteRemovido = await prisma.cliente.delete({
    where: {
      id: id
    }
  });

  return clienteRemovido.id === id;
}
