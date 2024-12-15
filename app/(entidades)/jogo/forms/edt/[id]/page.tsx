'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { handleEditarJogo, handleObterJogo } from '@/app/(entidades)/jogo/action';
import styles from '@/app/(entidades)/entidades.module.css';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  useEffect(() => {
    async function fetchJogo() {
      if (jogoId) {
        try {
          const jogoData = await handleObterJogo(jogoId);
          if (jogoData) {
            setJogo({
              id: jogoData.id || '',
              nome: jogoData.nome,
              ano: new Date(jogoData.ano),
              publisher: jogoData.publisher,
              descricao: jogoData.descricao,
              categorias: jogoData.categorias,
            });
            setNome(jogoData.nome);
            setAno(new Date(jogoData.ano).toISOString().split('T')[0]);
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
      const sucesso = await handleEditarJogo(jogoEditado);
      if (sucesso) {
        alert('Jogo editado com sucesso!');
        router.push('/jogo');
      } else {
        alert('Erro ao editar jogo.');
      }
    } catch (error) {
      console.error('Erro ao editar jogo:', error);
      alert('Erro ao editar jogo.');
    }
  };

  return (
    <div className={styles['AdcJogo-container']}>
      <form className={styles['AdcJogo-form-container']} onSubmit={handleSubmit}>
        <h1 className={styles['AdcJogo-title']}>Editar Jogo</h1>

        <div className={styles['AdcJogo-form-group']}>
          <label>Nome do Jogo:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className={styles['AdcJogo-form-group']}>
          <label>Ano de Lançamento:</label>
          <input
            type="date"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            required
          />
        </div>

        <div className={styles['AdcJogo-form-group']}>
          <label>Publisher:</label>
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            required
          />
        </div>

        <div className={styles['AdcJogo-form-group']}>
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        <div className={styles['AdcJogo-categories']}>
          <h2>Selecione Categorias</h2>
          {categorias.map((categoria) => (
            <div className={styles['AdcJogo-category-item']} key={categoria.id}>
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

        <button className={styles['AdcJogo-submit-button']} type="submit">
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default EditarJogo;
