'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import styles from '@/app/(entidades)/entidades.module.css';

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
}

interface Oferta {
  id: string;
  plataforma: string;
  url: string;
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

  const { data: categorias, error: categoriasError } = useSWR<Categoria[]>('/api/categoria/listar', fetcher);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Estado do Dropdown

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
              categorias: jogoData.categorias,
              ofertas: jogoData.ofertas || [],
            });
            setCategoriasSelecionadas(jogoData.categorias);
          }
        } catch (error) {
          console.error('Erro ao obter jogo:', error);
        }
      }
    }
    fetchJogo();
  }, [jogoId]);

  if (categoriasError) return <div>Erro ao carregar categorias.</div>;
  if (!categorias || !jogo) return <div>Carregando...</div>;

  const handleSelecionarCategoria = async (id: string) => {
    const jaSelecionada = categoriasSelecionadas.includes(id);
    const atualizadas = jaSelecionada
      ? categoriasSelecionadas.filter((catId) => catId !== id)
      : [...categoriasSelecionadas, id];

    setCategoriasSelecionadas(atualizadas);

    try {
      const response = await fetch(`/api/jogo/${jogoId}/categorias`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categorias: atualizadas }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar categorias.');
      }
    } catch (error) {
      console.error('Erro ao atualizar categorias:', error);
      alert('Não foi possível atualizar as categorias.');
    }
  };

  const handleAdicionarOferta = async () => {
    const novaOferta = {
      id: Date.now().toString(),
      plataforma: 'Nova Plataforma',
      url: '',
      preco: 'R$0,00',
    };
    const ofertasAtualizadas = [...jogo.ofertas, novaOferta];
    setJogo({ ...jogo, ofertas: ofertasAtualizadas });
  };

  const handleEditarOferta = (id: string, campo: string, valor: string) => {
    if (jogo) {
      const ofertasAtualizadas = jogo.ofertas.map((oferta) =>
        oferta.id === id ? { ...oferta, [campo]: valor } : oferta
      );
      setJogo({ ...jogo, ofertas: ofertasAtualizadas });
    }
  };

  const handleExcluirOferta = (id: string) => {
    if (jogo) {
      const ofertasAtualizadas = jogo.ofertas.filter((oferta) => oferta.id !== id);
      setJogo({ ...jogo, ofertas: ofertasAtualizadas });
    }
  };

  return (
    <div className={styles['VisualizarEditarJogo-container']}>
      {/* Detalhes do Jogo */}
      <div className={styles['VisualizarEditarJogo-detalhes']}>
        <img
          src={jogo.imagemUrl || "https://img.hype.games/cdn/209a330a-50f4-48d1-9db7-7485e6a81d87cover.jpg"}
          alt={jogo.titulo}
          className={styles['VisualizarEditarJogo-imagem']}
        />
        <div className={styles['VisualizarEditarJogo-informacoes']}>
          <h1>{jogo.titulo}</h1>
          <div className={styles['VisualizarEditarJogo-descricao']}>
            <p>{jogo.descricao}</p>
          </div>

          {/* Botão Dropdown de Categorias */}
          <div className={styles['VisualizarEditarJogo-categorias']}>
            <button
              className={styles['VisualizarEditarJogo-dropdownButton']}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Adicionar ▼
            </button>
            {dropdownOpen && (
              <div className={styles['VisualizarEditarJogo-dropdownMenu']}>
                {categorias.map((categoria) => (
                  <div
                    key={categoria.id}
                    className={styles['VisualizarEditarJogo-dropdownItem']}
                    onClick={() => handleSelecionarCategoria(categoria.id)}
                  >
                    {categoriasSelecionadas.includes(categoria.id) ? "✅" : ""} {categoria.nome}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gerenciar Ofertas */}
      <div className={styles['VisualizarEditarJogo-plataformas']}>
        <button
          className={styles['VisualizarEditarJogo-adicionar']}
          onClick={handleAdicionarOferta}
        >
          +
        </button>
        {jogo.ofertas.map((oferta) => (
          <div key={oferta.id} className={styles['VisualizarEditarJogo-plataforma']}>
            <div className={styles['VisualizarEditarJogo-plataforma-info']}>
              <input
                type="text"
                value={oferta.plataforma}
                onChange={(e) =>
                  handleEditarOferta(oferta.id, 'plataforma', e.target.value)
                }
                className={styles['VisualizarEditarJogo-input']}
              />
              <input
                type="text"
                value={oferta.url}
                onChange={(e) =>
                  handleEditarOferta(oferta.id, 'url', e.target.value)
                }
                className={styles['VisualizarEditarJogo-input']}
              />
              <input
                type="text"
                value={oferta.preco}
                onChange={(e) =>
                  handleEditarOferta(oferta.id, 'preco', e.target.value)
                }
                className={styles['VisualizarEditarJogo-input']}
              />
            </div>
            <div className={styles['VisualizarEditarJogo-plataforma-acoes']}>
              <button
                onClick={() => handleExcluirOferta(oferta.id)}
                className={styles['VisualizarEditarJogo-excluir']}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default VisualizarEditarJogo;
