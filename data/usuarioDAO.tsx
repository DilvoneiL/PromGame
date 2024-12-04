import prisma from "@/data/prisma";
import { User } from "@prisma/client";

// Função para obter todos os usuários
export async function obterUsuarios(): Promise<User[]> {
  try {
    // Busca todos os usuários no banco de dados usando Prisma
    const usuarios = await prisma.user.findMany();

    // Retorna os usuários
    return usuarios;
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    throw new Error("Erro ao obter usuários. Tente novamente.");
  }
}
// Função para obter um usuário por ID
export async function obterUsuarioPorId(id: string) {
  try {
    const usuario = await prisma.user.findUnique({
      where: { id },
    });
    return usuario; // Retorna o usuário, ou null caso não encontre
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    throw new Error("Erro ao obter usuário. Tente novamente.");
  }
}

// Obter usuário por email
export async function obterUsuarioPorEmail(email: string): Promise<User | null> {
  const usuario = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return usuario;
}

// Inserir novo usuário
export async function inserirUsuario(
  name: string,
  email: string,
  password: string,
  role: string
): Promise<User | null> {
  try {
    const usuario = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });
    console.log("Usuário inserido com sucesso:", usuario);
    return usuario;
  } catch (error) {
    console.error("Erro ao inserir usuário:", error);
    throw new Error("Erro ao inserir usuário.");
  }
}

// Editar usuário existente
export async function editarUsuario(
  id: string,
  name?: string,
  email?: string,
  password?: string,
  role?: string
): Promise<User | null> {
  try {
    const usuarioEditado = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        password,
        role,
      },
    });
    console.log("Usuário editado com sucesso:", usuarioEditado);
    return usuarioEditado;
  } catch (error) {
    console.error("Erro ao editar usuário:", error);
    throw new Error("Erro ao editar usuário.");
  }
}

// Remover usuário
export async function removerUsuario(id: string): Promise<boolean> {
  try {
    const usuarioRemovido = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return usuarioRemovido.id === id;
  } catch (error) {
    console.error("Erro ao remover usuário:", error);
    throw new Error("Erro ao remover usuário.");
  }
}

// Buscar usuário por critérios (nome ou e-mail)
export async function buscarUsuariosPorCriterio(criterio: string): Promise<User[]> {
  try {
    const usuarios = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: criterio, mode: "insensitive" } },
          { email: { contains: criterio, mode: "insensitive" } },
        ],
      },
    });
    return usuarios;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw new Error("Erro ao consultar usuários no banco de dados.");
  }
}


