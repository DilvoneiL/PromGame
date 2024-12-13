'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { handleEditarJogo, handleObterJogo } from '@/app/(entidades)/jogo/action';

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
}

interface Jogo {
  id: string;
  nome: string;
  ano: Date;
  publisher: string;
  descricao: string;
  categorias: string[];
}

function EditarJogo() {
  const params = useParams();
  const jogoId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data: categorias, error: categoriasError } = useSWR<Categoria[]>('/api/categoria/listar', fetcher);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [nome, setNome] = useState('');
  const [ano, setAno] = useState('');
  const [publisher, setPublisher] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);

  useEffect(() => {
    async function fetchJogo() {
      if (jogoId) {
        try {
          const jogoData = await handleObterJogo(jogoId);
          if (jogoData) {
            setJogo({
              id: jogoData.id || '', // Certifica que id nunca será undefined
              nome: jogoData.nome,
              ano: new Date(jogoData.ano),
              publisher: jogoData.publisher,
              descricao: jogoData.descricao,
              categorias: jogoData.categorias,
            });
            setNome(jogoData.nome);
            setAno(new Date(jogoData.ano).toISOString().split('T')[0]); // Formata o ano para string yyyy-mm-dd
            setPublisher(jogoData.publisher);
            setDescricao(jogoData.descricao);
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

  const handleSelecionarCategoria = (id: string) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(id)
        ? prev.filter((catId) => catId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Filtrar categorias para garantir que somente IDs válidos sejam enviados
    const categoriasFiltradas = categoriasSelecionadas.filter((catId) =>
      categorias.some((categoria) => categoria.id === catId)
    );
  
    const jogoEditado = {
      id: jogoId as string,
      nome,
      ano: new Date(ano),
      publisher,
      descricao,
      categorias: categoriasFiltradas,
    };
  
    try {
      console.log("Dados enviados para edição:", jogoEditado); // Log para depuração
      const sucesso = await handleEditarJogo(jogoEditado);
      if (sucesso) {
        alert("Jogo editado com sucesso!");
      } else {
        alert("Erro ao editar jogo.");
      }
    } catch (error) {
      console.error("Erro ao editar jogo:", error);
      alert("Erro ao editar jogo.");
    }
  };
  
  
  

  return (
    <div>
      <h1>Editar Jogo</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nome:
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Ano:
            <input
              type="date"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Publisher:
            <input
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Descrição:
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <h2>Selecione Categorias</h2>
          {categorias.map((categoria) => (
            <div key={categoria.id}>
              <label>
                <input
                  type="checkbox"
                  value={categoria.id}
                  checked={categoriasSelecionadas.includes(categoria.id)}
                  onChange={() => handleSelecionarCategoria(categoria.id)}
                />
                {categoria.nome}
              </label>
            </div>
          ))}
        </div>
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default EditarJogo;
