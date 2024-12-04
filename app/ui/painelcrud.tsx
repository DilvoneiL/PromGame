"use client"
import styles from "./ui.module.css";
import { useSession } from "next-auth/react"; // Hook para obter o estado da sessão

export default function PainelCRUD({
  adicionar,
  editar,
  remover
}: {
  adicionar: Function,
  editar: Function,
  remover: Function
}) {
  const { data: session} = useSession(); // status pode ser "loading", "authenticated" ou "unauthenticated"
  const role = session?.user?.role;

  return (
    <>
    {role === "ADMIN" && (
    <div className={styles.painelCRUD}>
      <button onClick={() => adicionar()}>Adicionar</button>
      <button onClick={() => editar()}>Editar</button>
      <button onClick={() => remover()}>Remover</button>
    </div>
    )}
  </>
  );
}