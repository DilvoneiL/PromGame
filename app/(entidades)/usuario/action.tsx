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

  const user = await prisma.user.create({
    data: {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    },
  });

  if (!user) {
    return { mensagem: "Não foi possível cadastrar o usuário." };
  }

  redirect("/usuario/forms/lgn");
}