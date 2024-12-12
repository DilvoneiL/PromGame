'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { handleInserirJogo } from '../../action';

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
      prev.includes(id)
        ? prev.filter((catId) => catId !== id)
        : [...prev, id]
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
    <div>
      <h1>Adicionar Jogo</h1>
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
        <button type="submit">Salvar Jogo</button>
      </form>
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default AdicionarJogo;
