import { obterUsuarios } from "@/data/usuarioDAO";
import { NextResponse } from "next/server";

// GET /api/usuario/listar
export async function GET() {
  try {
    const usuarios = await obterUsuarios();
    return NextResponse.json(usuarios, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ mensagem: "Erro ao obter usuários", erro: message }, { status: 500 });
  }
}
