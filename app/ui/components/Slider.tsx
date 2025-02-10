"use client";

import { useState, useEffect } from "react";
import styles from "../styles/slider.module.css"; // Importando o CSS Module

interface Jogo {
  jogo: {
    id: string;
    nome: string;
    imagemUrl: string;
  };
  oferta: {
    preco: string;
    endereco: string;
  };
}

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [sliderItems, setSliderItems] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJogos() {
      try {
        const response = await fetch("/api/oferta/ranking");
        const data = await response.json();
        setSliderItems(data.slice(0, 3)); // Pega apenas os 3 primeiros jogos
      } catch (error) {
        console.error("Erro ao carregar os jogos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJogos();
  }, []);

  const handleClick = (direction: string) => {
    if (direction === "left") {
      setSlideIndex(slideIndex > 0 ? slideIndex - 1 : sliderItems.length - 1);
    } else {
      setSlideIndex(slideIndex < sliderItems.length - 1 ? slideIndex + 1 : 0);
    }
  };

  if (loading) return <p>Carregando ofertas...</p>;

  return (
    <div className={styles.container}>
      {/* Seta para a esquerda */}
      <div
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={() => handleClick("left")}
      >
        {"<"}
      </div>

      <div
        className={styles.wrapper}
        style={{
          transform: `translateX(-${slideIndex * 100}vw)`, // Animação do slider
        }}
      >
        {sliderItems.map((item) => (
          <div key={item.jogo.id} className={styles.slide}>
            <div className={styles.imgContainer}>
              <img className={styles.image} src={item.jogo.imagemUrl} alt={item.jogo.nome} />
            </div>
            <div className={styles.infoContainer}>
              <h1 className={styles.title}>{item.jogo.nome}</h1>
              <p className={styles.desc}>Preço mais baixo: R$ {item.oferta.preco}</p>
              <a href={item.oferta.endereco} target="_blank" rel="noopener noreferrer">
                <button className={styles.button}>CONFIRA AS OFERTAS</button>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Seta para a direita */}
      <div
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={() => handleClick("right")}
      >
        {">"}
      </div>
    </div>
  );
};

export default Slider;
