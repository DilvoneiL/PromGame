"use client"
import styles from "./ui.module.css";
import { efetuarLogout } from "../(entidades)/usuario/action";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'

export default function Login() {

  const router = useRouter();
  const session = useSession();


  function cliqueLogin() {

    switch (session.status) {

      case "unauthenticated":
        router.push("/usuario/forms/lgn");
        break;

      case "authenticated":
        efetuarLogout().then(() => router.push("/usuario/forms/lgn"));
    }
  }

  return (
    <div className={styles.login} onClick={cliqueLogin}>
      {session.status == "authenticated" ? "" + session.data.user!.name : "Login"}
    </div>
  );

}

