"use client"
import styles from "./ui.module.css";

export default function PainelCRUD({
  adicionar,
  editar,
  remover
}: {
  adicionar: Function,
  editar: Function,
  remover: Function
}) {

  return (
    <div className={styles.painelCRUD}>
      <button onClick={() => adicionar()}>Adicionar</button>
      <button onClick={() => editar()}>Editar</button>
      <button onClick={() => remover()}>Remover</button>
    </div>
  );
}