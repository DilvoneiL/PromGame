"use server"
import prisma from "@/data/prisma";
import { signIn, signOut } from "@/app/lib/auth/auth";
import { redirect } from "next/navigation";


export async function efetuarLogin(prevState: any, formData: FormData) {

  let success = false;

  try {
    await signIn("credentials", {
      redirect: false,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    success = true;
  }
  catch (error) {
    success = false;
    return { mensagem: "Email ou senha incorretos." };
  }

  if (success) {
    console.log("Login efetuado: " + formData.get("email"));
    redirect("/");
  }

  return { mensagem: "Não foi possível efetuar o login." };
}

export async function efetuarLogout() {
  await signOut({ redirect: false });
  console.log("Logout efetuado");
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
