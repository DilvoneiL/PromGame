'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import styles from '@/app/(entidades)/entidades.module.css';
import { useRouter } from "next/navigation";

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

            // Log detalhado do jogo no console
            console.log('Jogo carregado no frontend:', JSON.stringify(jogoData, null, 2));
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



  const handleAdicionarOferta = () => {
    // Redireciona para a página de Gerenciar Ofertas
    router.push("/oferta/");
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
          Gerenciar Ofertas
        </button>
        {jogo.ofertas.map((oferta) => (
          <div key={oferta.id} className={styles['VisualizarEditarJogo-plataforma']}>
           
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
          </div>
        ))}
      </div>
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default VisualizarEditarJogo;
