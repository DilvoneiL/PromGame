"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleObterJogos } from "../../(entidades)/jogo/action"; // Importando a função correta
import styles from "../styles/products.module.css";

interface Jogo {
  id: string;
  nome: string;
  imagemUrl: string;
  ofertas?: { preco: number }[];
}

const Products = () => {
  const [products, setProducts] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchJogos() {
      try {
        const jogos = await handleObterJogos();

        // Formatar os jogos para garantir a estrutura correta
        const jogosFormatados: Jogo[] = jogos.map((jogo) => ({
          id: jogo.id,
          nome: jogo.nome,
          imagemUrl: jogo.imagemUrl || "/placeholder.png",
          ofertas: jogo.ofertas || [], // Se não tiver ofertas, mantém um array vazio
        }));

        setProducts(jogosFormatados);
      } catch (error) {
        console.error("Erro ao carregar os jogos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJogos();
  }, []);

  if (loading) return <p>Carregando jogos...</p>;

  return (
    <div className={styles.products}>
      <h2 className={styles.title}>Confiras todos os jogos</h2>
      <div className={styles.list}>
        {products.map((product) => {
          // Encontrar a oferta mais barata do jogo
          const menorPreco = product.ofertas.length > 0
            ? Math.min(...product.ofertas.map((oferta) => oferta.preco))
            : null;

          return (
            <div
              key={product.id}
              className={styles.product}
              onClick={() => router.push(`/jogo/forms/visualizar/${product.id}`)}
            >
              <img
                src={product.imagemUrl}
                alt={product.nome}
                className={styles.image}
              />
              <h3 className={styles.name}>{product.nome}</h3>
              <p className={styles.price}>
                {menorPreco !== null ? `R$ ${menorPreco.toFixed(2)}` : "Preço indisponível"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
