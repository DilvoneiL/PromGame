// app/api/jogo/obter/[id]/route.ts

import { NextResponse } from 'next/server';
import { obterJogoPorId } from '@/data/jogoDAO'; // Certifique-se de que a função esteja no caminho correto
import Jogo from '@/app/(entidades)/jogo/jogo';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Obtém o ID do jogo da URL
    const { id } = params;

    // Chama a função para obter o jogo pelo ID
    const jogo = await obterJogoPorId(id);

    if (!jogo) {
      return NextResponse.json({ message: 'Jogo não encontrado' }, { status: 404 });
    }

    // Retorna os dados do jogo em formato JSON
    return NextResponse.json(jogo, { status: 200 });
  } catch (error) {
    console.error('Erro ao obter jogo:', error);
    return NextResponse.json({ message: 'Erro ao obter jogo.' }, { status: 500 });
  }
}
