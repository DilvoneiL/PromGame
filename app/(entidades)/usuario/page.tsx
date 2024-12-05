"use client"; // Certifique-se de que o componente seja um "componente do cliente"

import { useSession } from "next-auth/react"; // Hook para obter o estado da sessão
import { useState, useEffect } from "react"; // Para gerenciamento de estado e otimização
import styles from "@/app/(entidades)/entidades.module.css"; // Importe seu estilo
import Link from "next/link"; // Para links de navegação
import { signOut } from "next-auth/react"; // Para realizar o logout

export default function Usuario() {
  const { data: session, status } = useSession(); // Hook para sessão
  const [usuarios, setUsuarios] = useState<any[]>([]); // Estado para armazenar a lista de usuários
  const [loading, setLoading] = useState<boolean>(false); // Estado para controle de carregamento
  const [error, setError] = useState<string | null>(null); // Estado para mensagens de erro

  const role = session?.user?.role; // Obtém o papel do usuário

  useEffect(() => {
    async function fetchUsuarios() {
      if (role === "ADMIN") { // A lógica condicional é MOVIDA para dentro da função
        setLoading(true); // Inicia o carregamento
        setError(null); // Reseta o erro anterior
        try {
          const response = await fetch("/api/usuario/listar");
          if (!response.ok) {
            throw new Error("Erro ao buscar usuários.");
          }
          const data = await response.json();
          setUsuarios(data); // Define os usuários no estado
        } catch (err) {
          console.error("Erro ao buscar usuários:", err);
          setError("Erro ao carregar a lista de usuários.");
        } finally {
          setLoading(false); // Finaliza o carregamento
        }
      }
    }

    fetchUsuarios(); // Chama a função de busca
  }, [role]); // Dependência: executa sempre que o `role` mudar

  // Aguardando a sessão carregar
  if (status === "loading") {
    return <div className={styles.loading}>Carregando...</div>;
  }

  // Caso o usuário não esteja autenticado
  if (status === "unauthenticated") {
    return (
      <div className={styles.entidade}>
        <p>
          Você não está logado. <Link href="/usuario/forms/lgn" className={styles.link}>Clique aqui para entrar</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.entidade}>
      <h1>Página de Administração do Usuário</h1>

      {/* Informações básicas do usuário */}
      <div className={styles.userInfo}>
        <p><strong>Nome:</strong> {session?.user?.name}</p>
        <p><strong>Email:</strong> {session?.user?.email}</p>
        <p><strong>Role:</strong> {role}</p>
      </div>

      {/* Conteúdo para administradores */}
      {role === "ADMIN" && (
        <div className={styles.adminPanel}>
          <h2>Bem-vindo, Administrador!</h2>
          <p>Aqui você pode gerenciar todos os usuários.</p>

          {loading && <p>Carregando a lista de usuários...</p>}
          {error && (
            <div>
              <p className={styles.errorMessage}>{error}</p>
              <button onClick={() => fetchUsuarios()}>Tentar novamente</button>
            </div>
          )}
          {!loading && !error && (
            <div>
              <h3>Lista de Usuários</h3>
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Papel</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={3}>Nenhum usuário encontrado.</td>
                    </tr>
                  ) : (
                    usuarios.map((usuario: any) => (
                      <tr key={usuario.id}>
                        <td>{usuario.name}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.role}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo para usuários normais */}
      {role === "NORMAL" && (
        <div className={styles.adminPanel}>
          <h2>Bem-vindo, {session?.user?.name}!</h2>
          <p>Você pode visualizar suas informações e editar seu perfil.</p>
          <Link href="/perfil" className={styles.link}>Editar Perfil</Link>
        </div>
      )}

      {/* Caso o papel não esteja definido */}
      {!role && (
        <div className={styles.guestPanel}>
          <h2>Papel não definido</h2>
          <p>Por favor, entre em contato com o administrador.</p>
        </div>
      )}

      {/* Botão de logout */}
      <button onClick={handleLogout} className={styles.logoutButton}>
        Sair
      </button>
    </div>
  );
}

// Função para logout
async function handleLogout() {
  try {
    await signOut({ callbackUrl: "/usuario/forms/lgn" });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    alert("Erro ao fazer logout. Tente novamente.");
  }
}
