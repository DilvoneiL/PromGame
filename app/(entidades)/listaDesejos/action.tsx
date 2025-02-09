export async function handleObterListaDesejos(userId: string) {
  try {
    const response = await fetch(`/api/listaDesejos/usuario?userId=${userId}`, { method: 'GET' });

    if (!response.ok) {
      throw new Error('Erro ao obter lista de desejos');
    }

    const data = await response.json();
    return data.lista;
  } catch (error) {
    console.error('Erro ao obter lista de desejos:', error);
    throw error;
  }
}

export async function handleAdicionarJogoListaDesejos(userId: string, jogoId: string) {
  try {
    const response = await fetch('/api/listaDesejos/adicionar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, jogoId }),
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar jogo à lista de desejos');
    }

    return true;
  } catch (error) {
    console.error('Erro ao adicionar jogo à lista de desejos:', error);
    throw error;
  }
}

export async function handleRemoverJogoListaDesejos(userId: string, jogoId: string) {
  try {
    const response = await fetch('/api/listaDesejos/remover', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, jogoId }),
    });

    if (!response.ok) {
      throw new Error('Erro ao remover jogo da lista de desejos');
    }

    return true;
  } catch (error) {
    console.error('Erro ao remover jogo da lista de desejos:', error);
    throw error;
  }
}
