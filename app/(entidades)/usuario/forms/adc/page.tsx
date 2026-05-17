'use client'

import styles from "@/app/ui/ui.module.css";
import { adicionarUsuario } from "@/app/(entidades)/usuario/action";
import { useFormState } from "react-dom";
import SubmitButton from "@/app/ui/submitbutton";
import Image from "next/image";
import { useEffect } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FormAdcUsuario() {
  const router = useRouter(); // Para realizar o redirecionamento no cliente
  const initialState: { mensagem: string; redirectUrl?: string } = {
    mensagem: "",
  };
  const [state, formAction] = useFormState(adicionarUsuario, {
    ...initialState,
  });

  useEffect(() => {
    if (state.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [router, state.redirectUrl]);

  return (
    <div className={styles.formularioDiv}>
        <Image
          src="/add.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px -3px"}} // Alinha a imagem ao lado do texto
        />
        <h2>Cadastrar</h2>
      <form className={styles.formularioForm} action={formAction}>
        <input type="hidden" name="role" value="NORMAL" />
        <label>
        <Image
          src="/user.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px -3px"}} // Alinha a imagem ao lado do texto
        />
          <input placeholder="Nome" type="text" id="iptusuarionome" name="name" required />
        </label>
        <label>
        <Image
          src="/email.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px -3px"}} // Alinha a imagem ao lado do texto
        />
          <input placeholder="E-mail" type="email" id="iptusuarioemail" name="email" required />
        </label>
        <label>
        <Image
          src="/password.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px -3px"}} // Alinha a imagem ao lado do texto
        />
          <input placeholder="Senha" type="password" id="iptusuariosenha" name="password" required />
        </label>
        {/* O campo role foi removido do formulário */}
        <div className={styles.formularioPainel}>
          <SubmitButton rotulo="Confirmar" />
          <Link href="/usuario/forms/lgn">
            <button type="button">Cancelar</button>
          </Link>
        </div>
        <p aria-live="polite" role="status">
          {state?.mensagem}
        </p>
      </form>
    </div>
  );
}
