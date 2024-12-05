// app/api/usuario/buscar/route.ts
import { NextResponse } from 'next/server';
import { buscarUsuariosPorCriterio } from '@/data/usuarioDAO'; // Função de busca de usuários

export async function GET(request: Request) {
  try {
    // Pega o parâmetro de consulta (query parameter) da URL
    const url = new URL(request.url);
    const criterio = url.searchParams.get('criterio'); // Recebe o critério de busca (nome ou email)

    // Verifica se o critério foi informado
    if (!criterio) {
      return NextResponse.json({ message: 'Criterio de busca não fornecido.' }, { status: 400 });
    }

    // Chama a função para buscar os usuários
    const usuarios = await buscarUsuariosPorCriterio(criterio);

    // Se nenhum usuário for encontrado, retorna 404
    if (usuarios.length === 0) {
      return NextResponse.json({ message: 'Nenhum usuário encontrado.' }, { status: 404 });
    }

    // Retorna os usuários encontrados
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ message: 'Erro ao consultar usuários no banco de dados.' }, { status: 500 });
  }
}
