'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import styles from '@/app/(entidades)/entidades.module.css';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AvaliacaoJogo from '../../../../../ui/components/avaliarJogos';


interface Categoria {
  id: string;
  nome: string;
  descricao: string;
}

interface Oferta {
  id: string;
  plataforma: string;
  endereco: string;
  preco: string;
}

interface Jogo {
  id: string;
  titulo: string;
  descricao: string;
  imagemUrl: string;
  categorias: string[];
  ofertas: Oferta[];
}

function VisualizarEditarJogo() {
  const params = useParams();
  const jogoId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const { data: session } = useSession();
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [naListaDesejos, setNaListaDesejos] = useState<boolean>(false); // Verifica se o jogo já está na lista

  useEffect(() => {
    async function fetchJogo() {
      if (jogoId) {
        try {
          const response = await fetch(`/api/jogo/obter/${jogoId}`);
          const jogoData = await response.json();
          if (jogoData) {
            setJogo({
              id: jogoData.id,
              titulo: jogoData.nome,
              descricao: jogoData.descricao,
              imagemUrl: jogoData.imagemUrl,
              categorias: jogoData.categorias || [],
              ofertas: jogoData.ofertas || [],
            });

            console.log('Jogo carregado no frontend:', JSON.stringify(jogoData, null, 2));
          }
        } catch (error) {
          console.error('Erro ao obter jogo:', error);
        }
      }
    }

    async function verificarListaDesejos() {
      if (!session?.user?.id || !jogoId) return;

      try {
        const response = await fetch(`/api/listaDesejos/usuario?userId=${session.user.id}`);
        if (!response.ok) throw new Error("Erro ao buscar lista de desejos");

        const data = await response.json();
        const jogoNaLista = data.lista.some((item: any) => item.idJogo === jogoId);
        setNaListaDesejos(jogoNaLista);
      } catch (error) {
        console.error("Erro ao verificar lista de desejos:", error);
      }
    }

    fetchJogo();
    verificarListaDesejos();
  }, [jogoId, session]);

  if (!jogo) return <div>Carregando...</div>;

  const handleListaDesejos = async () => {
    if (!session?.user?.id || !jogoId) {
      alert("Usuário não autenticado ou jogo inválido.");
      return;
    }

    setIsProcessing(true);
    try {
      const url = naListaDesejos ? '/api/listaDesejos/remover' : '/api/listaDesejos/adicionar';
      const method = naListaDesejos ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, jogoId }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao ${naListaDesejos ? "remover" : "adicionar"} jogo à lista de desejos.`);
      }

      setNaListaDesejos(!naListaDesejos);
      alert(`Jogo ${naListaDesejos ? "removido" : "adicionado"} da lista de desejos!`);
    } catch (error) {
      console.error("Erro ao atualizar lista de desejos:", error);
      alert(`Não foi possível ${naListaDesejos ? "remover" : "adicionar"} o jogo.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles['VisualizarEditarJogo-container']}>

      {/* Detalhes do Jogo */}
      <div className={styles['VisualizarEditarJogo-detalhes']}>
        <img
          src={jogo.imagemUrl}
          alt={jogo.titulo}
          className={styles['VisualizarEditarJogo-imagem']}
        />
        <div className={styles['VisualizarEditarJogo-informacoes']}>
          <h1>{jogo.titulo}</h1>
          <div className={styles['VisualizarEditarJogo-descricao']}>
            <p>{jogo.descricao}</p>
          </div>

          {/* 📌 Botão para Adicionar/Remover da Lista de Desejos */}
          <button
            className={styles['VisualizarEditarJogo-favoritar']}
            onClick={handleListaDesejos}
            disabled={isProcessing}
          >
            {isProcessing ? "Processando..." : naListaDesejos ? "Remover da Lista de Desejos" : "Adicionar à Lista de Desejos"}
          </button>

          {/* 📌 Exibir Categorias */}
          <div className={styles['VisualizarEditarJogo-categorias']}>
            <h2>Categorias</h2>
            {jogo.categorias.length === 0 ? (
              <p>Nenhuma categoria associada.</p>
            ) : (
              jogo.categorias.map((categoria, index) => ( // 🔥 Agora renderiza corretamente
                <span key={index} className={styles['VisualizarEditarJogo-categoriaItem']}>
                  {categoria}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
      {/*  Adiciona o componente de avaliação */}
    <AvaliacaoJogo jogoId={jogo.id} />
      {/*  Gerenciar Ofertas */}
      <div className={styles['VisualizarEditarJogo-plataformas']}>
      {session?.user?.role === "ADMIN" && (
        <button
          className={styles['VisualizarEditarJogo-adminButton']}
          onClick={() => router.push("/oferta/")}
        >
          Gerenciar Ofertas
        </button>
      )}

        {jogo.ofertas.map((oferta) => (
          <div key={oferta.id} className={styles['VisualizarEditarJogo-plataforma']}>
            <a
              href={oferta.endereco}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['VisualizarEditarJogo-link']}
            >
              {oferta.endereco || 'Clique para acessar'}
            </a>
            <span className={styles['VisualizarEditarJogo-preco']}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(oferta.preco))}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default VisualizarEditarJogo;
