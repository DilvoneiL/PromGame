'use client'
import styles from "@/app/ui/ui.module.css";
import Cliente from "@/app/(entidades)/cliente/cliente";
import { editarCliente } from "@/app/(entidades)/cliente/action";
import SubmitButton from "@/app/ui/submitbutton";

import Link from "next/link";
import useSWR from "swr";
import { useFormState } from "react-dom";


export default function FormEdtCliente({ params }: { params: { id: number } }) {

  const [state, formAction] = useFormState(
    editarCliente,
    { mensagem: "" }
  );

  const { data, error } = useSWR<Cliente>(
    `http://localhost:3000/api/cliente/obi?id=${params.id}`,
    (url: string) => fetch(url).then((res => res.json()))
  );

  if (error) {
    return (
      <div className={styles.formularioDiv}>
        <h1>Erro ao bucar cliente com ID: {params.id}.</h1>
        <Link href="\cliente">
          <button type="button" >Voltar</button>
        </Link>
      </div>
    );
  }

  if (!data || !data.id) {
    return (
      <div className={styles.formularioDiv}>
        <h1>Cliente não encontrado.</h1>
        <Link href="\cliente">
          <button type="button" >Voltar</button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.formularioDiv}>
      <h1>Editar Cliente</h1>
      <form className={styles.formularioForm} action={formAction}>
        <label>
          <span>Id:</span>
          <input
            type="text"
            id="iptclienteid"
            name="id"
            defaultValue={data.id}
            required
          />
        </label>
        <label>
          <span>Nome:</span>
          <input
            type="text"
            id="iptclientenome"
            name="nome"
            defaultValue={data.nome}
            required
          />
        </label>
        <label>
          <span>Email:</span>
          <input
            type="email"
            id="iptclienteemail"
            name="email"
            defaultValue={data.email}
            required
          />
        </label>
        <div className={styles.formularioPainel}>
          <SubmitButton rotulo="Confirmar" />
          <Link href="\cliente">
            <button type="button" >Cancelar</button>
          </Link>
        </div>
        <p aria-live="polite" role="status">
          {state?.mensagem}
        </p>
      </form>
    </div>
  );
}