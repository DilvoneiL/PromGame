"use server"
import prisma from "@/data/prisma";
import { signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { z } from "zod";
import { 
  inserirUsuario, 
  editarUsuario, 
  obterUsuarios, 
  obterUsuarioPorId, 
  removerUsuario,
} from "@/data/usuarioDAO";
import { revalidatePath } from "next/cache";

export async function efetuarLogin(email: string, password: string) {
  // Apenas valida os dados ou faz qualquer lógica do servidor
  if (!email || !password) {
    return { success: false, mensagem: "Email ou senha não podem estar vazios." };
  }

  return { success: true }; // Retorna para o cliente executar o login
}

export async function efetuarLogout() {
  try {
    await signOut({ redirect: false }); // Evita redirecionamento automático
    console.log("Logout efetuado");
    redirect("/usuario/forms/lgn"); // Redireciona para a página de login
  } catch (error) {
    console.error("Erro ao efetuar logout:", error);
    return { mensagem: "Erro ao efetuar logout. Tente novamente." };
  }
}

export async function adicionarUsuario(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string || "NORMAL"; // Pega o valor do campo ou usa NORMAL como padrão

  if (!name || !email || !password || !role) {
    return { mensagem: "Todos os campos são obrigatórios." };
  }

  if (role !== "ADMIN" && role !== "NORMAL") {
    return { mensagem: "Valor de role inválido. Use ADMIN ou NORMAL." };
  }

  try {
    // Criação do usuário com role
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role, // Adiciona o campo role
      },
    });

    if (!user) {
      return { mensagem: "Não foi possível cadastrar o usuário." };
    }

  return { mensagem: "Usuário cadastrado com sucesso.", redirectUrl: "/usuario/forms/lgn" };
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return { mensagem: "Erro ao cadastrar o usuário. Tente novamente." };
  }
}

// Função para editar um usuário existente
export async function editarUsuarioAction(prevState: any, formData: FormData) {
  const schema = z.object({
    id: z.string().min(1, "ID inválido"),
    name: z.string().min(1, "Informe o nome do usuário"),
    email: z.string().email("Informe um email válido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    role: z.string().min(1, "Informe o papel do usuário"),
  });

  const parse = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parse.success) {
    return { mensagem: "Falha ao editar o usuário. Verifique os dados do formulário." };
  }

  const { id, name, email, password, role } = parse.data;

  try {
    const usuarioEditado = await editarUsuario(id, name, email, password, role);
    if (usuarioEditado) {
      revalidatePath("/usuarios");
      return { mensagem: `Usuário com ID ${id} editado com sucesso.` };
    } else {
      return { mensagem: "Erro ao editar o usuário." };
    }
  } catch (error) {
    console.error("Erro ao editar o usuário:", error);
    return { mensagem: "Erro ao editar o usuário. Tente novamente." };
  }
}

// Função para listar todos os usuários
export async function listarUsuariosAction() {
  try {
    // Chama a função do DAO para obter todos os usuários
    const usuarios = await obterUsuarios();
    return usuarios; // Retorna a lista de usuários
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return { mensagem: "Erro ao listar usuários. Tente novamente." };
  }
}