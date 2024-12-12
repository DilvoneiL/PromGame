import { NextResponse } from 'next/server';
import { removerJogo } from '../../../../../data/jogoDAO'; // Importa a função de remoção do jogo


// app/jogo/remover/route.ts

export async function DELETE(req: Request) {
  try {
    // Obtenha o corpo da requisição
    const body = await req.json();

    // Verifique se o corpo contém o ID
    const { id } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID do jogo não fornecido ou inválido' }, { status: 400 });
    }

    // Chama a função de remoção do jogo
    const resultado = await removerJogo(id);

    if (!resultado) {
      return NextResponse.json({ error: `Falha ao remover o jogo com ID ${id}` }, { status: 400 });
    }

    // Se a remoção for bem-sucedida
    return NextResponse.json({ message: `Jogo com ID ${id} removido com sucesso` }, { status: 200 });
  } catch (error) {
    console.error('Erro ao remover jogo:', error);
    return NextResponse.json({ error: 'Erro interno ao remover o jogo' }, { status: 500 });
  }
}
