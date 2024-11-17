import styles from "../styles/categories.module.css";

const Categories = () => {
  const categories = [
    "Ação",
    "Aventura",
    "RPG",
    "Corrida",
    "Esportes",
    "Estratégia",
  ];

  return (
    <div className={styles.categories}>
      <h2 className={styles.title}>Categorias</h2>
      <div className={styles.list}>
        {categories.map((category, index) => (
          <div key={index} className={styles.category}>
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
