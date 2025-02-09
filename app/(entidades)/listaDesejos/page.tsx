'use client';

import { useEffect, useState } from 'react';
import { handleObterListaDesejos, handleRemoverJogoListaDesejos } from './action';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import styles from '../entidades.module.css';

interface Jogo {
  id: string; // ID da relação (ListaDesejos)
  idJogo: string; // ID real do jogo (Chave estrangeira)
  nomeJogo: string;
  descricao: string;
  imagemUrl: string;
}

export default function ListaDesejos() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [listaDesejos, setListaDesejos] = useState<Jogo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchListaDesejos(session.user.id);
    }
  }, [status, session]);

  const fetchListaDesejos = async (userId: string) => {
    try {
      const lista = await handleObterListaDesejos(userId);
      setListaDesejos(lista);
    } catch (err) {
      console.error('Erro ao carregar lista de desejos:', err);
      setError('Erro ao carregar a lista de desejos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemover = async (idJogo: string) => {
    if (!session?.user?.id) return;

    try {
      await handleRemoverJogoListaDesejos(session.user.id, idJogo);
      alert('Jogo removido da lista de desejos com sucesso!');
      setListaDesejos((prevLista) => prevLista.filter((jogo) => jogo.idJogo !== idJogo));
    } catch (error) {
      console.error('Erro ao remover jogo da lista de desejos:', error);
    }
  };

  if (status === "loading") {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className={styles.entidade}>
        <p>Você não está logado. <a href="/usuario/forms/lgn" className={styles.link}>Clique aqui para entrar</a></p>
      </div>
    );
  }

  return (
    <div className={styles.jogoMainContainer}>
      <h1 className={styles.title}>Minha Lista de Desejos</h1>

      {isLoading ? (
        <p className={styles.loading}>Carregando lista de desejos...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : listaDesejos.length === 0 ? (
        <p className={styles.error}>Nenhum jogo na lista de desejos.</p>
      ) : (
        listaDesejos.map((jogo) => (
          <div key={jogo.id} className={styles.jogoCard}>
            <div className={styles.jogoInfo}>
              <img src={jogo.imagemUrl} alt={jogo.nomeJogo || "Imagem do jogo"} className={styles.jogoImage} />
              <div>
                <h3 className={styles.jogoNome}>{jogo.nomeJogo}</h3>
                <p className={styles.jogoDescricao}>{jogo.descricao}</p>
              </div>
            </div>
            <div className={styles.jogoActions}>
              <button
                className={styles.viewButton}
                onClick={() => router.push(`/jogo/forms/visualizar/${jogo.idJogo}`)} // Agora usa `idJogo`
              >
                Visualizar
              </button>
              <button className={styles.deleteButton} onClick={() => handleRemover(jogo.idJogo)}>
                Remover
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
