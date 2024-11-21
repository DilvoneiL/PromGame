'use client'
import styles from "@/app/ui/ui.module.css";
import SubmitButton from "@/app/ui/submitbutton";
import { efetuarLogin } from "@/app/(entidades)/usuario/action";
import { useFormState } from "react-dom";
import Link from "next/link";
import Image from "next/image";

export default function SignIn() {

  const [state, formAction] = useFormState(
    efetuarLogin,
    { mensagem: "" }
  );

  return (
    <div className={styles.formularioDiv}>
      <form className={styles.formularioForm} action={formAction}>
      <Image
          src="/categoria.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px 20px"}} // Alinha a imagem ao lado do texto
        />
        <label>
          <input name="email" type="email" placeholder="E-mail"/>
        </label>
        <label>
          <input name="password" type="password" placeholder="Senha" />
        </label>
        <div className={styles.formularioPainel}>
          <SubmitButton rotulo="Logar" />
          <Link href="/usuario/forms/adc">
            <button type="button" >Registrar-se</button>
          </Link>
          <Link href="/">
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
