"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css"
import Login from "./login";
import { useSession } from "next-auth/react";

export default function Topo() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN"; // Verifica se o usuário é ADMIN

  return (
    <div className={styles.topo}>
      {/* Container Principal */}
      <div className={styles.wrapper}>
        {/* Esquerda: Logo */}
        <div className={styles.left}>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="PromGame"
              width={60}
              height={60}
              style={{ cursor: "pointer" }}
            />
          </Link>
        </div>

        {/* Centro: Nome e Pesquisa */}
        <div className={styles.center}>
          <h1>PromGame</h1>
          {/* <div className={styles.searchContainer}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search"
            />
          </div> */}
        </div>

        {/* Direita: Menu */}
    <div className={styles.right}>
      <ul className={styles.mainmenu}>
        <li>
          <Link href="/">Home</Link>
        </li>
        {isAdmin && (
          <>
            <li>
              <Link href="/sites">Sites</Link>
            </li>
            <li>
              <Link href="/categoria">Categorias</Link>
            </li>
            <li>
              <Link href="/oferta">Ofertas</Link>
            </li>
          </>
        )}
        <li>
          <Link href="/jogo">Jogos</Link>
        </li>
        <li>
          <Link href="/listaDesejos">Lista de Desejos</Link>
        </li>
            {/* <li>
              <Image
                src="/wishlist.png"
                alt="wishlist"
                width={20}
                height={20}
                style={{ marginLeft: "15px", cursor: "pointer" }}
              />
            </li> */}
            <Login />
          </ul>
        </div>
      </div>
    </div>
  );
}
