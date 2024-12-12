'use server';

import {
  obterJogos,
  obterJogoPorId,
  inserirJogo,
  editarJogo,
  removerJogo
} from '@/data/jogoDAO';
import Jogo from '@/app/(entidades)/jogo/jogo';

// Função para obter todos os jogos
export async function handleObterJogos(): Promise<Jogo[]> {
  try {
    return await obterJogos();
  } catch (error) {
    console.error("Erro ao obter jogos:", error);
    throw new Error("Erro ao obter jogos.");
  }
}

// Função compatível com useSWR
export async function listarJogosSWR(): Promise<Jogo[]> {
  return await handleObterJogos();
}

// Função para obter um jogo por ID
export async function handleObterJogoPorId(id: string): Promise<Jogo | null> {
  try {
    return await obterJogoPorId(id);
  } catch (error) {
    console.error('Erro ao obter jogo por ID:', error);
    throw new Error('Erro ao obter jogo.');
  }
}

// Função para criar um novo jogo
export async function handleInserirJogo(jogo: Jogo): Promise<boolean> {
  try {
    return await inserirJogo(jogo);
  } catch (error) {
    console.error('Erro ao inserir jogo:', error);
    throw new Error('Erro ao inserir jogo.');
  }
}

// Função para editar um jogo existente
export async function handleEditarJogo(jogo: Jogo): Promise<boolean> {
  try {
    return await editarJogo(jogo);
  } catch (error) {
    console.error('Erro ao editar jogo:', error);
    throw new Error('Erro ao editar jogo.');
  }
}

// Função para remover um jogo
export async function handleRemoverJogo(id: string) {
  try {
    // Aqui, você está removendo diretamente do banco, usando o jogoDAO
    const resultado = await removerJogo(id);

    if (!resultado) {
      throw new Error(`Falha ao remover o jogo com id ${id}`);
    }

    // Caso a remoção seja bem-sucedida, você pode adicionar qualquer lógica pós-sucesso, se necessário.
  } catch (error: unknown) {
    // Verifica se o erro é uma instância de Error
    if (error instanceof Error) {
      console.error('Erro ao remover jogo:', error.message);
      // Lançar um erro mais informativo, sem redundância
      throw new Error(`Erro ao remover jogo com id ${id}: ${error.message}`);
    } else {
      console.error('Erro desconhecido ao remover jogo');
      throw new Error('Erro desconhecido ao remover jogo.');
    }
  }
}

