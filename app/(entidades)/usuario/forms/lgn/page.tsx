'use client';
import styles from "@/app/ui/ui.module.css";
import SubmitButton from "@/app/ui/submitbutton";
import { signIn } from "next-auth/react"; // Usar signIn diretamente no cliente
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false, // Não redireciona automaticamente
      email,
      password,
    });

    if (result?.ok) {
      // Redireciona para a página inicial ou outra página
      setMensagem("Login efetuado com sucesso!");
      window.location.href = "/";
    } else {
      setMensagem(result?.error || "Erro ao efetuar login.");
    }
  };

  return (
    <div className={styles.formularioDiv}>
       <form className={styles.formularioForm} onSubmit={handleSubmit}>
      <Image
          src="/user.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px 20px"}} // Alinha a imagem ao lado do texto
        />
        <label>
        <Image
          src="/email.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px -3px"}} // Alinha a imagem ao lado do texto
        />
        <input
            name="email"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
            required
          />
        </label>
        <label>
        <Image
          src="/password.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px -3px"}} // Alinha a imagem ao lado do texto
        />
         <input
            name="password"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado
            required
          />
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
          {mensagem}
        </p>
      </form>
    </div>
  );
}
