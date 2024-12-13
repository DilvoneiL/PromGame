'use client';
import styles from "@/app/ui/ui.module.css";
import { adicionarCategoria } from "@/app/(entidades)/categoria/action";
import SubmitButton from "@/app/ui/submitbutton";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

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
      <h2>Adicionar Categoria</h2>
      <Image
              src="/Octagon.png"
              alt="PromGame"
              width={60}
              height={60}
              style={{ margin : "10px 0px 0px"}}
            />
      <form className={styles.formularioForm} onSubmit={handleSubmit}>
        <label>
        <Image
          src="/categoria.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px -3px"}} // Alinha a imagem ao lado do texto
        />
          <input placeholder="Nome" type="text" id="iptcategoriaNome" name="nome" required />
        </label>
        <label>
        <Image
          src="/descrição.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px -3px"}} // Alinha a imagem ao lado do texto
        />
          <input placeholder="Descrição" type="text" id="iptcategoriaDescricao" name="descricao" required />
        </label>
        <div className={styles.formularioPainel}>
          <SubmitButton rotulo="Confirmar" />
          <Link href="/categoria">
            <button type="button">Voltar</button>
          </Link>
        </div>
        <p aria-live="polite" role="status">{mensagem}</p>
      </form>
    </div>
  );
}
