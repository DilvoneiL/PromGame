"use server"
import { revalidatePath } from "next/cache";
import { z } from "zod";


export async function post(url: string, obj: string) {
  console.log("Enviando requisição para:", url);
  console.log("Payload:", obj);

  const res = await fetch(url, { method: "POST", body: obj });
  console.log("Status da resposta:", res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erro na resposta da API:", errorText);
    throw new Error("Falha em executar a ação do formulário.");
  }
  return res.json();
}


export async function adicionarCliente(prevState: any, formData: FormData) {
  const schema = z.object({
    id: z.string().min(1, "ID inválido. Deve ser uma string."),
    nome: z.string().min(1, "Informe o nome do cliente"),
    email: z.string().email("Email inválido"),
  });

  const parse = schema.safeParse({
    id: formData.get("id"),
    nome: formData.get("nome"),
    email: formData.get("email"),
  });

  if (!parse.success) {
    return { mensagem: "Falha ao adicionar o cliente. Verifique os dados do formulário." };
  }

  const cliente = parse.data;

  const res = await post("http://localhost:3000/api/cliente/adc", JSON.stringify(cliente));

  if (res.mensagem) {
    revalidatePath("/cliente");
    return { mensagem: `Cliente adicionado com sucesso: ${cliente.nome}` };
  } else {
    return { mensagem: `Não foi possível adicionar o cliente: ${cliente.nome}` };
  }
}


export async function editarCliente(prevState: any, formData: FormData) {

  const schema = z.object({
    id: z.string().min(1),
    nome: z.string().min(1, "Informe o nome do cliente"),
    email: z.string().min(1, "Informe o email do cliente").email("Email inválido"),
  });

  const parse = schema.safeParse({
    id: formData.get("id"),
    nome: formData.get("nome"),
    email: formData.get("email"),
  });

  if (!parse.success) {
    return { mensagem: "Falha ao editar o cliente a partir dos dados do formulário." }
  }

  const cliente = parse.data;

  const res = await post(
    "http://localhost:3000/api/cliente/edt",
    `{"id":"${cliente.id}","nome":"${cliente.nome}","email":"${cliente.email}"}`
  );

  if (res.mensagem) {
    revalidatePath("/cliente");
    return { mensagem: `O cliente com ID: ${cliente.id} foi editado.` };
  }
  else {
    return { mensagem: `Não foi possível editar o cliente com ID: ${cliente.id}` };
  }
}


export async function removerCliente(id: string) {
  // Verifica se o ID é válido para MongoDB
  if (!id) { // Valide se o ID é válido (exemplo para IDs numéricos)
    alert(`ID inválido: ${id}`);
    return;
  }

  const res = await post(
    "http://localhost:3000/api/cliente/rmv",
    `{"id":"${id}"}`
  );

  if (res.mensagem) {
    return { mensagem: `O cliente com ID: ${id} foi removido.` };
  } else {
    return { mensagem: `Não foi possível remover o cliente com ID: ${id}` };
  }
}