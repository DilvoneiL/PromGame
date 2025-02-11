'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface AvaliacaoProps {
  jogoId: string;
}

const AvaliacaoJogo: React.FC<AvaliacaoProps> = ({ jogoId }) => {
  const { data: session } = useSession();
  const [nota, setNota] = useState<number | null>(null);
  const [media, setMedia] = useState<number | null>(null);
  const [avaliacaoId, setAvaliacaoId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  //  Buscar avaliações e atualizar quando o usuário adicionar/editar
  const fetchAvaliacoes = async () => {
    if (!jogoId) return;

    try {
      // Buscar média das avaliações
      const mediaResponse = await fetch(`/api/avaliacoes/media?jogoId=${jogoId}`);
      if (!mediaResponse.ok) throw new Error("Erro ao buscar média");
      const mediaData = await mediaResponse.json();
      setMedia(mediaData.media);

      // Se o usuário estiver logado, buscar sua avaliação
      if (session?.user?.id) {
        const response = await fetch(`/api/avaliacoes/listar?jogoId=${jogoId}`);
        if (!response.ok) throw new Error("Erro ao buscar avaliações");

        const avaliacoes = await response.json();
        const minhaAvaliacao = avaliacoes.find((av: any) => av.userId === session.user.id);

        if (minhaAvaliacao) {
          setNota(minhaAvaliacao.nota);
          setAvaliacaoId(minhaAvaliacao.id);
        } else {
          setNota(null);
          setAvaliacaoId(null);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
    }
  };

  useEffect(() => {
    fetchAvaliacoes();
  }, [jogoId, session]); //  Atualiza quando o jogo ou usuário muda

  //  Função para avaliar (Adicionar ou Editar)
  const handleAvaliacao = async (novaNota: number) => {
    if (!session?.user?.id) {
      alert("Você precisa estar logado para avaliar.");
      return;
    }

    setLoading(true);
    try {
      const url = avaliacaoId ? '/api/avaliacoes/editar' : '/api/avaliacoes/adicionar';
      const method = avaliacaoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: avaliacaoId, 
          jogoId, 
          userId: session.user.id, 
          nota: novaNota 
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar avaliação");

      setNota(novaNota);
      alert(avaliacaoId ? "Avaliação editada!" : "Avaliação enviada!");
      
      //  Atualiza as avaliações após a ação do usuário
      await fetchAvaliacoes();
      
    } catch (error) {
      console.error("Erro ao avaliar:", error);
      alert("Não foi possível salvar sua avaliação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <h2>Avaliação</h2>

      {/* Mostrar a média das avaliações */}
      <p><strong>Média:</strong> {media !== null ? media.toFixed(1) : "Carregando..."}</p>

      {/* Mostrar opções de avaliação */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => handleAvaliacao(num)}
            disabled={loading}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: nota === num ? '#ffcc00' : '#ddd',
            }}
          >
            {num} ⭐
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvaliacaoJogo;
