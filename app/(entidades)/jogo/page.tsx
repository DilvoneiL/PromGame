'use client';

import { useEffect, useState } from 'react';
import { handleRemoverJogo, handleObterJogos } from './action';
import Jogo from "./jogo"
import PainelCRUD from '@/app/ui/painelcrud';
import { useRouter } from 'next/navigation';

function VisualizarJogos() {
  const [jogos, setJogos] = useState<Jogo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const data = await handleObterJogos();
        setJogos(data);
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
      await handleRemoverJogo(id); // Tenta remover o jogo
      alert("Jogo removido com sucesso!"); // Sucesso
    } catch (error) {
      console.error("Erro ao remover jogo:", error);
      alert("Não foi possível remover o jogo. Tente novamente.");
    }
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Jogos</h1>
      
      {/* Painel CRUD */}
            <PainelCRUD
              adicionar={() => router.push("jogo/forms/adc") }
              editar={() =>
                router.push("/jogo/forms/edt/")
              }
              remover={handleRemoverJogo}
            />

      {jogos?.map((jogo) => (
        <div
          key={jogo.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#333',
            color: '#fff',
            padding: '15px',
            borderRadius: '10px',
            marginTop: '20px',
            marginBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {jogo.imagemUrl && (
              <img
                src={jogo.imagemUrl}
                alt={jogo.nome}
                style={{ width: '80px', height: '80px', marginRight: '15px', borderRadius: '5px' }}
              />
            )}
            <div>
              <h3 style={{ margin: 0 }}>{jogo.nome}</h3>
              <p style={{ margin: '5px 0' }}>{jogo.descricao}</p>
              <small>{jogo.publisher} - {new Date(jogo.ano).getFullYear()}</small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 15px',
                cursor: 'pointer',
              }}
              onClick={() => alert('Ver oferta para o jogo: ' + jogo.nome)}
            >
              Ver Oferta
            </button>
            <button
              style={{
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 15px',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (jogo.id) {
                  handleRemover(jogo.id);
                } else {
                  alert("ID inválido. Não é possível remover este jogo.");
                }
              }}              
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default VisualizarJogos;