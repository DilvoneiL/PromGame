'use client';

import { useEffect, useState } from 'react';
import { handleRemoverJogo, handleObterJogos } from './action';
import Jogo from './jogo';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"; // Importando autenticação do usuário
import styles from '../entidades.module.css';
import Filtro from '@/app/ui/seach';

function VisualizarJogos() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN"; // Verifica se o usuário é ADMIN
  const [jogos, setJogos] = useState<Jogo[] | null>(null);
  const [filteredJogos, setFilteredJogos] = useState<Jogo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const data = await handleObterJogos();
        setJogos(data);
        setFilteredJogos(data);
      } catch (err) {
        console.error('Erro ao carregar jogos:', err);
        setError('Erro ao carregar jogos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJogos();
  }, []);

  const handleRemover = async (id: string) => {
    try {
      await handleRemoverJogo(id);
      alert('Jogo removido com sucesso!');
      setFilteredJogos((prevJogos) => prevJogos.filter((jogo) => jogo.id !== id));
    } catch (error) {
      console.error('Erro ao remover jogo:', error);
      alert('Não foi possível remover o jogo. Tente novamente.');
    }
  };

  return (
    <div className={styles.jogoMainContainer}>
      <h1 className={styles.title}>Jogos</h1>

      {/* Apenas ADMIN pode adicionar jogos */}
      {isAdmin && (
        <div className={styles.actionBar}>
          <button className={styles.addButton} onClick={() => router.push('/jogo/forms/adc')}>
            Adicionar Jogo
          </button>
        </div>
      )}

      {/* Filtro */}
      <Filtro
        placeholder="Pesquisar jogos"
        dados={jogos?.map((jogo) => [jogo.nome, jogo.descricao, jogo.publisher]) || []}
        filtro={(linha, valor) =>
          linha[0].toLowerCase().includes(valor.toLowerCase()) || 
          linha[1].toLowerCase().includes(valor.toLowerCase()) || 
          linha[2].toLowerCase().includes(valor.toLowerCase()) 
        }
        onFiltrar={(linhasFiltradas) => {
          const novosJogos = jogos?.filter((jogo) =>
            linhasFiltradas.some((linha) => linha[0] === jogo.nome)
          );
          setFilteredJogos(novosJogos || []);
        }}
      />

      {/* Lista de Jogos */}
      {isLoading ? (
        <p className={styles.loading}>Carregando jogos...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        filteredJogos.map((jogo) => (
          <div key={jogo.id} className={styles.jogoCard}>
            <div className={styles.jogoInfo}>
              <img
                src={jogo.imagemUrl}
                alt={jogo.nome || "Imagem do jogo"}
                className={styles.jogoImage}
              />
              <div>
                <h3 className={styles.jogoNome}>{jogo.nome}</h3>
                <p className={styles.jogoDescricao}>{jogo.descricao}</p>
                <small className={styles.jogoAno}>
                  {jogo.publisher} - {new Date(jogo.ano).getFullYear()}
                </small>
              </div>
            </div>
            <div className={styles.jogoActions}>
              <button
                className={styles.viewButton}
                onClick={() => router.push(`/jogo/forms/visualizar/${jogo.id}`)}
              >
                Visualizar
              </button>

              {/* Apenas ADMIN pode Editar e Remover */}
              {isAdmin && (
                <>
                  <button
                    className={styles.editButton}
                    onClick={() => router.push(`/jogo/forms/edt/${jogo.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      if (jogo.id) {
                        handleRemover(jogo.id);
                      } else {
                        alert('ID inválido. Não é possível remover este jogo.');
                      }
                    }}
                  >
                    Remover
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default VisualizarJogos;
