import { NextResponse } from 'next/server';
import { editarUsuario } from '@/data/usuarioDAO'; // Função para editar o usuário
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'ID do usuário não fornecido.' }, { status: 400 });
  }

  // Lê os dados do corpo da requisição
  const { name, email, password, role } = await request.json();

  try {
    // Busca o usuário logado (usuário que está fazendo a requisição)
    const userLogado = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!userLogado) {
      return NextResponse.json({ message: 'Usuário logado não encontrado.' }, { status: 404 });
    }

    // Verifica se o usuário logado está tentando editar outro usuário
    console.log("Id do usario do parametro ", id);
    console.log("Id do usuario logago", userLogado.id);
    if (userLogado.role !== 'ADMIN' && userLogado.id !== id) {
      return NextResponse.json({ message: 'Você não tem permissão para editar outro usuário.' }, { status: 403 });
    }

    // Se o usuário logado for normal e está tentando alterar a role, retorna erro
    if (userLogado.role === 'NORMAL' && role !== undefined) {
      return NextResponse.json({ message: 'Usuários normais não podem alterar a própria role.' }, { status: 403 });
    }

    // Se o usuário logado for admin, ele pode editar qualquer usuário
    if (userLogado.role === 'ADMIN') {
      const usuarioEditado = await editarUsuario(id, name, email, password, role); // Pode editar a role
      if (!usuarioEditado) {
        return NextResponse.json({ message: 'Usuário não encontrado para editar.' }, { status: 404 });
      }
      return NextResponse.json(usuarioEditado); // Retorna o usuário editado
    }

    // Caso o usuário logado seja normal e está editando a si mesmo
    const usuarioEditado = await editarUsuario(id, name, email, password); // Não altera a role
    if (!usuarioEditado) {
      return NextResponse.json({ message: 'Usuário não encontrado para editar.' }, { status: 404 });
    }

    return NextResponse.json(usuarioEditado); // Retorna o usuário editado

  } catch (error) {
    console.error('Erro ao editar usuário:', error);
    return NextResponse.json({ message: 'Erro ao editar usuário. Tente novamente.' }, { status: 500 });
  }
}
