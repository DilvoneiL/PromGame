'use client'
import styles from "@/app/ui/ui.module.css";
import SubmitButton from "@/app/ui/submitbutton";
import { efetuarLogin } from "@/app/(entidades)/usuario/action";
import { useFormState } from "react-dom";
import Link from "next/link";


export default function SignIn() {

  const [state, formAction] = useFormState(
    efetuarLogin,
    { mensagem: "" }
  );

  return (
    <div className={styles.formularioDiv}>
      <form className={styles.formularioForm} action={formAction}>
        <h1>Login</h1>
        <label>
          <span>Email:</span>
          <input name="email" type="email" />
        </label>
        <label>
          <span>Senha:</span>
          <input name="password" type="password" />
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
