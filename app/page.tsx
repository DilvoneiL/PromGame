import Slider from "./ui/components/Slider";
import Categories from "./ui/components/Categories";
import Products from "./ui/components/Products";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <Slider />
      {/* <Categories /> */}
      <Products />
    </div>
  );
}
