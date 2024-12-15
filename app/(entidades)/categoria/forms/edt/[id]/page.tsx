'use client';

import styles from "@/app/ui/ui.module.css";
import Categoria from "@/app/(entidades)/categoria/categoria";
import { editarCategoriaAction } from "@/app/(entidades)/categoria/action";
import SubmitButton from "@/app/ui/submitbutton";
import Image from "next/image";
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
      <Image
        src="/Octagon.png"
        alt="PromGame"
        width={60}
        height={60}
        style={{ margin: "10px 0px 0px" }}
      />
      <form className={styles.formularioForm} action={formAction}>
        {/* Campo ID */}
        <p style={{ margin: "0 0 5px", color: "#ccc", fontSize: "0.8rem" }}>ID:</p>
        <label>
          <input
            type="text"
            id="iptcategoriaid"
            name="id"
            defaultValue={data.id}
            readOnly
            required
          />
        </label>

        {/* Campo Categoria */}
        <p style={{ margin: "10px 0 5px", color: "#ccc", fontSize: "0.8rem" }}>Categoria:</p>
        <label>
          <input
            type="text"
            id="iptcategorianome"
            name="nome"
            defaultValue={data.nome}
            required
          />
        </label>

        {/* Campo Descrição */}
        <p style={{ margin: "10px 0 5px", color: "#ccc", fontSize: "0.8rem" }}>Descrição:</p>
        <label>
          <input
            type="text"
            id="iptcategoriadescricao"
            name="descricao"
            defaultValue={data.descricao}
            required
          />
        </label>

        <div className={styles.formularioPainel}>
          <SubmitButton rotulo="Confirmar" />
          <Link href="/categoria">
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
