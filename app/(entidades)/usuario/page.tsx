"use client"; // Certifique-se de que o componente seja um "componente do cliente"

import { useSession } from "next-auth/react"; // Hook para obter o estado da sessão
import { useState, useEffect } from "react"; // Para gerenciamento de estado
import styles from "@/app/(entidades)/entidades.module.css"; // Importe seu estilo
import Link from "next/link"; // Para links de navegação
import { signOut } from "next-auth/react";

export default function Usuario() {
  // Obtém os dados da sessão
  const { data: session, status } = useSession(); // status pode ser "loading", "authenticated" ou "unauthenticated"
  const [message, setMessage] = useState<string | null>(null); // Mensagem de erro ou sucesso

  // Aguardando a sessão carregar
  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  // Caso o usuário não esteja autenticado, redireciona ou exibe mensagem
  if (status === "unauthenticated") {
    return (
      <div>
        <p>Você não está logado. <Link href="/usuario/forms/lgn">Clique aqui para entrar</Link></p>
      </div>
    );
  }

  // Se o usuário estiver autenticado, verifica o role
  const role = session?.user?.role;

  return (
    <div className={styles.userPage}>
      <h1>Página de Administração do Usuário</h1>

      {/* Exibir informações básicas do usuário */}
      <div className={styles.userInfo}>
        <p><strong>Nome:</strong> {session?.user?.name}</p>
        <p><strong>Email:</strong> {session?.user?.email}</p>
        <p><strong>Role:</strong> {role}</p>
      </div>

      {/* Conteúdo baseado no role */}
      {role === "ADMIN" && (
        <div className={styles.adminPanel}>
          <h2>Bem-vindo, Administrador!</h2>
          <p>Aqui você pode gerenciar todos os usuários.</p>
          <Link href="/admin/usuarios">Gerenciar Usuários</Link>
        </div>
      )}

      {role === "NORMAL" && (
        <div className={styles.userPanel}>
          <h2>Bem-vindo, {session?.user?.name}!</h2>
          <p>Você pode visualizar suas informações e editar seu perfil.</p>
          <Link href="/perfil">Editar Perfil</Link>
        </div>
      )}

      {/* Se o usuário tem outro papel */}
      {!role && (
        <div className={styles.guestPanel}>
          <h2>Papel não definido</h2>
          <p>Por favor, entre em contato com o administrador.</p>
        </div>
      )}

      {/* Se desejar implementar a opção de logout */}
      <button onClick={() => handleLogout()} className={styles.logoutButton}>
        Sair
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

// Função de logout
async function handleLogout() {
  console.log("Tentando efetuar logout...");
  
  try {
    // Use o signOut do NextAuth e permita redirecionar após o logout
    await signOut({ callbackUrl: "/usuario/forms/lgn" });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    alert("Erro ao fazer logout. Tente novamente.");
  }
}
