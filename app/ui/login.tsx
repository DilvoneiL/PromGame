"use client";
import styles from "./ui.module.css";
import { signOut } from "next-auth/react"; // Use signOut para deslogar
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated") {
      console.log("Informações detalhadas do usuário autenticado:", session.data?.user);
    } else if (session.status === "unauthenticated") {
      console.log("Usuário não autenticado.");
    }
  }, [session]);

  async function cliqueLogout() {
    console.log("Tentando efetuar logout...");
    setIsLoading(true);

    try {
      await signOut({ redirect: false }); // Use signOut do next-auth
      console.log("Logout realizado com sucesso!");
      router.refresh(); // Atualiza a página para sincronizar o estado
    } catch (error) {
      console.error("Erro ao tentar deslogar:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function cliqueLogin() {
    switch (session.status) {
      case "unauthenticated":
        console.log("Redirecionando para o login...");
        router.push("/usuario/forms/lgn");
        break;

      case "authenticated":
        console.log("Redirecionando para a página de usuário...");
        router.push("/usuario");
    }
  }

  return (
    <div>
      <div className={styles.login} onClick={cliqueLogin}>
        {isLoading
          ? "Carregando..."
          : session.status === "authenticated"
          ? session.data?.user?.name ?? "Usuário"
          : "Login"}
      </div>
      {session.status === "authenticated" && (
        <button
          className={styles.logoutButton}
          onClick={cliqueLogout}
          disabled={isLoading}
        >
          {isLoading ? "Saindo..." : "Logout"}
        </button>
      )}
    </div>
  );
}
