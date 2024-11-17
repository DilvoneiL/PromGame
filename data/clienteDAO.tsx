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

export async function inserirCliente(cliente: Cliente): Promise<boolean> {
  try {
    const novoCliente = await prisma.cliente.create({
      data: {
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
