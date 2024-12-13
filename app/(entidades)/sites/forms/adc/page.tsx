'use client';
import styles from "@/app/ui/ui.module.css";
import { adicionarSite } from "@/app/(entidades)/sites/action";
import SubmitButton from "@/app/ui/submitbutton";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function FormAdcSite() {
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    try {
      const response = await adicionarSite(formData); // Usando a função adicionarSite do action
      setMensagem(response?.mensagem || "Site adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar site:", error);
      setMensagem("Erro ao adicionar site. Tente novamente.");
    }
  };

  return (
    <div className={styles.formularioDiv}>
      <h2>Adicionar Site</h2>
      <Image
        src="/Octagon.png"
        alt="PromGame"
        width={60}
        height={60}
        style={{ margin: "10px 0px 0px" }}
      />
      <form className={styles.formularioForm} onSubmit={handleSubmit}>
        <label>
          <Image
            src="/name.png"
            alt="Icon"
            width={20}
            height={20}
            style={{ margin: "0px 3px -3px" }}
          />
          <input placeholder="Nome" type="text" id="iptSiteNome" name="nome" required />
        </label>
        <label>
          <Image
            src="/site.png"
            alt="Icon"
            width={25}
            height={25}
            style={{ margin: "0px 3px -3px" }}
          />
          <input placeholder="Endereço (URL)" type="url" id="iptSiteEndereco" name="endereco" required />
        </label>
        <div className={styles.formularioPainel}>
          <SubmitButton rotulo="Confirmar" />
          <Link href="/sites">
            <button type="button">Voltar</button>
          </Link>
        </div>
        <p aria-live="polite" role="status">{mensagem}</p>
      </form>
    </div>
  );
}
