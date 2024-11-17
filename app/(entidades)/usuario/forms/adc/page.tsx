'use client'
import styles from "@/app/ui/ui.module.css";
import { adicionarUsuario } from "@/app/(entidades)/usuario/action";
import { useFormState } from "react-dom";
import SubmitButton from "@/app/ui/submitbutton";

import Link from "next/link";


export default function FormAdcUsuario() {

  const [state, formAction] = useFormState(
    adicionarUsuario,
    { mensagem: "" }
  );

  return (
    <div className={styles.formularioDiv}>
      <h1>Adicionar Cliente</h1>
      <form className={styles.formularioForm} action={formAction}>
        <label>
          <span>Nome:</span>
          <input
            type="text"
            id="iptusuarionome"
            name="name"
            required
          />
        </label>
        <label>
          <span>Email:</span>
          <input
            type="email"
            id="iptusuarioemail"
            name="email"
            required
          />
        </label>
        <label>
          <span>Senha:</span>
          <input
            type="password"
            id="iptusuariosenha"
            name="password"
            required
          />
        </label>
        <div className={styles.formularioPainel}>
          <SubmitButton rotulo="Confirmar" />
          <Link href="/usuario/forms/lgn">
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