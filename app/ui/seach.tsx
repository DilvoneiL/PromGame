'use client';
import { useState } from "react";
import styles from "./ui.module.css";

interface FiltroProps {
  placeholder: string;
  dados: string[][];
  filtro: (linha: string[], valor: string) => boolean;
  onFiltrar: (linhasFiltradas: string[][]) => void;
}

export default function Filtro({ placeholder, dados, filtro, onFiltrar }: FiltroProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const filtered = dados.filter((linha) => filtro(linha, value));
    onFiltrar(filtered);
  };

  return (
    <div className={styles.searchPage}>
      <input
        className={styles.searchPage}
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
