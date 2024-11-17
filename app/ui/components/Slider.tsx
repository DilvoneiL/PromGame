"use client";

import { useState } from "react";
import styles from "../styles/slider.module.css"; // Importando o CSS Module

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  // Dados do slider
  const sliderItems = [
    {
      id: 1,
      img: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000033071/3f7ee6aa3482b514bd443e116022b038a9728f017916ed37da3f09f731a7d5f2",
      title: "The Witcher 3",
      desc: "Descrição do primeiro slide.",
      bg: "f5fafd",
    },
    {
      id: 2,
      img: "https://assets.xboxservices.com/assets/1d/5b/1d5bc84f-2135-4e2f-8ca6-bb000d97db7f.jpg?n=Elden-Ring_GLP-Poster-Image-1084_1920x1080.jpg",
      title: "Elden Rings",
      desc: "Descrição do segundo slide.",
      bg: "fcf1ed",
    },
    {
      id: 3,
      img: "https://img.hype.games/cdn/209a330a-50f4-48d1-9db7-7485e6a81d87cover.jpg",
      title: "God Of War",
      desc: "Descrição do terceiro slide.",
      bg: "fbf0f4",
    },
  ];

  const handleClick = (direction: string) => {
    if (direction === "left") {
      setSlideIndex(slideIndex > 0 ? slideIndex - 1 : sliderItems.length - 1);
    } else {
      setSlideIndex(slideIndex < sliderItems.length - 1 ? slideIndex + 1 : 0);
    }
  };

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
    transform: `translateX(-${slideIndex * 100}vw)`, // Desloca com base no índice
  }}
>
  {sliderItems.map((item) => (
    <div
      key={item.id} // Chave única para cada slide
      className={styles.slide}
    >
      <div className={styles.imgContainer}>
        <img className={styles.image} src={item.img} alt={item.title} />
      </div>
      <div className={styles.infoContainer}>
        <h1 className={styles.title}>{item.title}</h1>
        <p className={styles.desc}>{item.desc}</p>
        <button className={styles.button}>CONFIRA AS OFERTAS</button>
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
