// app/api/usuario/obter/[id]/route.ts
import { NextResponse } from 'next/server';
import { obterUsuarioPorId } from '@/data/usuarioDAO';  // Função que faz a consulta no banco de dados

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;  // Captura o id da URL

  if (!id) {
    return NextResponse.json({ message: 'ID do usuário não fornecido.' }, { status: 400 });
  }

  try {
    const usuario = await obterUsuarioPorId(id);

    if (!usuario) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return NextResponse.json({ message: 'Erro ao obter usuário. Tente novamente.' }, { status: 500 });
  }
}
