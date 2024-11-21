'use client'

import styles from "@/app/ui/ui.module.css";
import { adicionarUsuario } from "@/app/(entidades)/usuario/action";
import { useFormState } from "react-dom";
import SubmitButton from "@/app/ui/submitbutton";
import Image from "next/image";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FormAdcUsuario() {
  const router = useRouter(); // Para realizar o redirecionamento no cliente
  const [state, formAction] = useFormState(adicionarUsuario, {
    mensagem: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Adicione o campo role como NORMAL diretamente
    formData.append("role", "NORMAL");

    const response = await formAction(formData);

    if (response?.redirectUrl) {
      router.push(response.redirectUrl); // Redirecione para a URL especificada
    }
  };

  return (
    <div className={styles.formularioDiv}>
        <Image
          src="/categoria.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px -3px"}} // Alinha a imagem ao lado do texto
        />
      <form className={styles.formularioForm} onSubmit={handleSubmit}>
        <label>
          <input placeholder="Name" type="text" id="iptusuarionome" name="name" required />
        </label>
        <label>
          <input placeholder="E-mail" type="email" id="iptusuarioemail" name="email" required />
        </label>
        <label>
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
