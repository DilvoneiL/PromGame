'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { handleInserirJogo } from '../../action';
import styles from '@/app/(entidades)/entidades.module.css';

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
}

function AdicionarJogo() {
  const { data: categorias, error } = useSWR<Categoria[]>('/api/categoria/listar', fetcher);
  const [nome, setNome] = useState('');
  const [ano, setAno] = useState('');
  const [publisher, setPublisher] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);

  if (error) return <div>Erro ao carregar categorias.</div>;
  if (!categorias) return <div>Carregando categorias...</div>;

  const handleSelecionarCategoria = (id: string) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jogo = {
      nome,
      ano: new Date(ano),
      publisher,
      descricao,
      categorias: categoriasSelecionadas,
    };

    try {
      const sucesso = await handleInserirJogo(jogo);
      if (sucesso) {
        alert('Jogo adicionado com sucesso!');
        setNome('');
        setAno('');
        setPublisher('');
        setDescricao('');
        setCategoriasSelecionadas([]);
      } else {
        alert('Erro ao adicionar jogo.');
      }
    } catch (error) {
      console.error('Erro ao adicionar jogo:', error);
      alert('Erro ao adicionar jogo.');
    }
  };

  return (
    <div className={styles['AdcJogo-container']}>
      <form className={styles['AdcJogo-form-container']} onSubmit={handleSubmit}>
        <h1 className={styles['AdcJogo-title']}>Cadastrar Novo Jogo</h1>

        <div className={styles['AdcJogo-upload-section']}>
          <div className={styles['AdcJogo-upload-icon']}>⤴</div>
          <p className={styles['AdcJogo-upload-description']}>
            Clique para enviar a imagem do jogo
          </p>
        </div>

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
          Cadastrar
        </button>
      </form>
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default AdicionarJogo;
