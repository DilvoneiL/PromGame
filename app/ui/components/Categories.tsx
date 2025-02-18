'use client';

import { useEffect, useState } from "react";
import styles from "../styles/categories.module.css";

interface CategoriesProps {
  onSelectCategory: (category: string | null) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categorias/listar");
        if (!response.ok) throw new Error("Erro ao buscar categorias");

        const data = await response.json();
        setCategories(data.map((cat: any) => cat.nome)); // Ajusta para exibir os nomes corretamente
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    onSelectCategory(category === selectedCategory ? null : category);
  };

  return (
    <div className={styles.categories}>
      <h2 className={styles.title}>Categorias</h2>
      <div className={styles.list}>
        {categories.map((category, index) => (
          <div
            key={index}
            className={`${styles.category} ${selectedCategory === category ? styles.active : ""}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
