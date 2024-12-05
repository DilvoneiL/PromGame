import { NextResponse } from 'next/server';
import { removerUsuario } from '@/data/usuarioDAO'; // Função para remover o usuário
import { auth } from "@/app/lib/auth/auth"; // Função para pegar a sessão
import jwt from 'jsonwebtoken'; // Para verificar o token JWT

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Extrair o token JWT do cabeçalho Authorization
    const authorizationHeader = request.headers.get('Authorization');
    
    if (!authorizationHeader) {
      return NextResponse.json({ message: 'Token não fornecido.' }, { status: 401 });
    }

    const token = authorizationHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
      return NextResponse.json({ message: 'Token inválido.' }, { status: 401 });
    }

    // Verificar e decodificar o token JWT
    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!); // Verifica a assinatura do token e decodifica

    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 401 });
    }

    // Agora podemos acessar os dados do usuário do token decodificado
    const userIdLogged = decoded.id; // ID do usuário logado
    const userRole = decoded.role; // Papel do usuário (por exemplo, ADMIN)
    const userIdToDelete = params.id; // ID do usuário a ser deletado

    // Verifica se o usuário é um admin ou está tentando remover a si mesmo
    if (userIdLogged !== userIdToDelete && userRole !== 'ADMIN') {
      return NextResponse.json({ message: 'Você não tem permissão para remover este usuário.' }, { status: 403 });
    }

    // Chama a função para remover o usuário
    const sucesso = await removerUsuario(userIdToDelete);

    if (sucesso) {
      return NextResponse.json({ message: 'Usuário removido com sucesso.' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Erro ao remover usuário.' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro ao tentar remover o usuário:', error);
    return NextResponse.json({ message: 'Erro ao tentar remover o usuário.' }, { status: 500 });
  }
}
