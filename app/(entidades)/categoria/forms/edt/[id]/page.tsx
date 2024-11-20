'use client';

import styles from "@/app/ui/ui.module.css";
import Categoria from "@/app/(entidades)/categoria/categoria";
import { editarCategoriaAction } from "@/app/(entidades)/categoria/action";
import SubmitButton from "@/app/ui/submitbutton";

import Link from "next/link";
import useSWR from "swr";
import { useFormState } from "react-dom";

export default function FormEdtCategoria({ params }: { params: { id: string } }) {
  const [state, formAction] = useFormState(editarCategoriaAction, { mensagem: "" });
  console.log("ID recebido via params:", params.id);

  // Fetch data for the selected category
  const { data, error } = useSWR<Categoria>(
    `http://localhost:3000/api/categoria/obter?id=${params.id}`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  if (error) {
    return (
      <div className={styles.formularioDiv}>
        <h1>Erro ao buscar categoria com ID: {params.id}.</h1>
        <Link href="/categoria">
          <button type="button">Voltar</button>
        </Link>
      </div>
    );
  }

  if (!data || !data.id) {
    return (
      <div className={styles.formularioDiv}>
        <h1>Categoria não encontrada.</h1>
        <Link href="/categoria">
          <button type="button">Voltar</button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.formularioDiv}>
      <h1>Editar Categoria</h1>
      <form className={styles.formularioForm} action={formAction}>
    <label>
      <span>Id:</span>
      <input
        type="text"
        id="iptcategoriaid"
        name="id" // O nome precisa ser "id"
        defaultValue={data.id}
        readOnly // O ID não deve ser editado
        required
      />
    </label>
  <label>
    <span>Nome:</span>
    <input
      type="text"
      id="iptcategorianome"
      name="nome" // O nome precisa ser "nome"
      defaultValue={data.nome}
      required
    />
  </label>
  <label>
    <span>Descrição:</span>
    <input
      type="text"
      id="iptcategoriadescricao"
      name="descricao" // O nome precisa ser "descricao"
      defaultValue={data.descricao}
      required
    />
  </label>
  <div className={styles.formularioPainel}>
    <SubmitButton rotulo="Confirmar" />
    <Link href="/categoria">
      <button type="button">Cancelar</button>
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
