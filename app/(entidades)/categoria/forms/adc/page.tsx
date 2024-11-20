'use client';
import styles from "@/app/ui/ui.module.css";
import { adicionarCategoria } from "@/app/(entidades)/categoria/action";
import SubmitButton from "@/app/ui/submitbutton";
import Link from "next/link";
import { useState } from "react";

export default function FormAdcCategoria() {
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const response = await adicionarCategoria(null, formData);
      setMensagem(response?.mensagem || "Categoria adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      setMensagem("Erro ao adicionar categoria. Tente novamente.");
    }
  };

  return (
    <div className={styles.formularioDiv}>
      <h1>Adicionar Categoria</h1>
      <form className={styles.formularioForm} onSubmit={handleSubmit}>
        <label>
          <span>Nome:</span>
          <input type="text" id="iptcategoriaNome" name="nome" required />
        </label>
        <label>
          <span>Descrição:</span>
          <input type="text" id="iptcategoriaDescricao" name="descricao" required />
        </label>
        <div className={styles.formularioPainel}>
          <SubmitButton rotulo="Confirmar" />
          <Link href="/categoria">
            <button type="button">Cancelar</button>
          </Link>
        </div>
        <p aria-live="polite" role="status">{mensagem}</p>
      </form>
    </div>
  );
}
