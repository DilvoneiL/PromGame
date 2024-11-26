'use client';

import styles from "@/app/ui/ui.module.css";
import Site from "@/app/(entidades)/sites/site";
import { editarSiteAction } from "@/app/(entidades)/sites/action";
import SubmitButton from "@/app/ui/submitbutton";
import Image from "next/image";

import Link from "next/link";
import useSWR from "swr";
import { useFormState } from "react-dom";

export default function FormEdtSite({ params }: { params: { id: string } }) {
  const [state, formAction] = useFormState(editarSiteAction, { mensagem: "" });
  console.log("ID recebido via params:", params.id);

  // Fetch data for the selected site
  const { data, error } = useSWR<Site>(
    `http://localhost:3000/api/sites/obter?id=${params.id}`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  if (error) {
    return (
      <div className={styles.formularioDiv}>
        <h1>Erro ao buscar site com ID: {params.id}.</h1>
        <Link href="/sites">
          <button type="button">Voltar</button>
        </Link>
      </div>
    );
  }

  if (!data || !data.id) {
    return (
      <div className={styles.formularioDiv}>
        <h1>Site não encontrado.</h1>
        <Link href="/sites">
          <button type="button">Voltar</button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.formularioDiv}>
      <Image
        src="/Octagon.png"
        alt="PromGame"
        width={60}
        height={60}
        style={{ margin: "10px 0px 0px" }}
      />
      <form className={styles.formularioForm} action={formAction}>
        <label>
          <input
            type="text"
            id="iptSiteId"
            name="id"
            defaultValue={data.id}
            readOnly // O ID não deve ser editado
            required
          />
        </label>
        <label>
          <input
            type="text"
            id="iptSiteNome"
            name="nome"
            defaultValue={data.nome}
            required
          />
        </label>
        <label>
          <input
            type="url"
            id="iptSiteEndereco"
            name="endereco"
            defaultValue={data.endereco}
            required
          />
        </label>
        <div className={styles.formularioPainel}>
          <SubmitButton rotulo="Confirmar" />
          <Link href="/sites">
            <button type="button">Voltar</button>
          </Link>
        </div>
        {state.mensagem && (
          <p aria-live="polite" role="status" className={styles.mensagem}>
            {state.mensagem}
          </p>
        )}
      </form>
    </div>
  );
}
