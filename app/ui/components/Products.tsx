import styles from "../styles/products.module.css";

const Products = () => {
  const products = [
    { name: "The Witcher 3", price: "R$99,90", image: "https://image.api.playstation.com/vulcan/ap/rnd/202211/0714/S1jCzktWD7XJSRkz4kNYNVM0.png" },
    { name: "Elden Ring", price: "R$199,90", image: "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phvVT0qZfcRms5qDAk0SI3CM.png" },
    { name: "God of War", price: "R$149,90", image: "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phvVT0qZfcRms5qDAk0SI3CM.png" },
  ];

  return (
    <div className={styles.products}>
      <h2 className={styles.title}>Produtos</h2>
      <div className={styles.list}>
        {products.map((product, index) => (
          <div key={index} className={styles.product}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.image}
            />
            <h3 className={styles.name}>{product.name}</h3>
            <p className={styles.price}>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
