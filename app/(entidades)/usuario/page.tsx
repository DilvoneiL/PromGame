"use client"; // Certifique-se de que o componente seja um "componente do cliente"

import { useState, useEffect } from "react"; // Para gerenciamento de estado e otimização
import styles from "@/app/(entidades)/entidades.module.css"; // Importe seu estilo
import Link from "next/link"; // Para links de navegação
import { signOut, getSession, useSession } from "next-auth/react"; // Para realizar o logout

export default function Usuario() {
  const { data: session, status } = useSession(); // Hook para sessão
  const [userData, setUserData] = useState<{ name: string; email: string }>({ name: "", email: "" });
  const [usuarios, setUsuarios] = useState<any[]>([]); // Estado para armazenar a lista de usuários
  const [loading, setLoading] = useState<boolean>(false); // Estado para controle de carregamento
  const [filteredUsuarios, setFilteredUsuarios] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>(""); // Valor de pesquisa
  const [error, setError] = useState<string | null>(null); // Estado para mensagens de erro
  const [editingUserId, setEditingUserId] = useState<string | null>(null); // Estado para o usuário em modo de edição
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false); // Para controle de edição do perfil
  const [editedUser, setEditedUser] = useState<{ name: string; email: string }>({

    name: session?.user?.name || "",
    email: session?.user?.email || "",
    
  }); // Estado para os dados do usuário a ser editado

  const role = session?.user?.role; // Obtém o papel do usuário
  
  const fetchUserData = async () => {
    const updatedSession = await getSession(); // Obtém os dados mais recentes da sessão
    if (updatedSession?.user) {
      setUserData({
        name: updatedSession.user.name || "",
        email: updatedSession.user.email || "",
      });
    }
  };
  
  // Após a edição ser bem-sucedida:
  // Carregar a lista de usuários
  const fetchUsuarios = async () => {
    setLoading(true); // Inicia o carregamento
    setError(null); // Reseta o erro anterior
    try {
      const response = await fetch("/api/usuario/listar");
      if (!response.ok) {
        throw new Error("Erro ao buscar usuários.");
      }
      const data = await response.json();
      setUsuarios(data); // Define os usuários no estado
      setFilteredUsuarios(data);  // Inicializa o estado de usuários filtrados com todos os dados
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError("Erro ao carregar a lista de usuários.");
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };
  
  // Chama a função para buscar usuários ao inicializar
  useEffect(() => {
    if (role === "ADMIN") {
      fetchUsuarios();
    }
  }, [role]); // Dependência: executa sempre que o `role` mudar

  // Função para editar as informações de um usuário
  const handleEdit = async (id: string) => {
    if (!editedUser.name || !editedUser.email) {
      alert("Nome e email são obrigatórios!");
      return;
    }

    try {
      // Envia a requisição PUT para editar o usuário
      const response = await fetch(`/api/usuario/editar/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editedUser.name,
          email: editedUser.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Usuário editado com sucesso!");
        setEditingUserId(null); // Fecha o modo de edição
        fetchUsuarios(); // Atualiza a lista de usuários
        fetchUserData(); // Atualiza os dados da sessão
    
      } else {
        alert("Erro ao editar usuário!");
      }
    } catch (err) {
      console.error("Erro ao editar usuário:", err);
      alert(`Erro ao editar usuário: ${err.message}`);
    }
  };

  // Função para excluir um usuário
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Você tem certeza que deseja excluir este usuário?");
    
    if (confirmed) {
      try {
        // Adicionando logs para verificar o valor de 'session' e 'signedToken'
        console.log("Sessão:", session);  // Log da sessão completa
        const token = session?.token?.signedToken;  // Acessando o token correto
  
        console.log("Token encontrado:", token);  // Verificando o token
  
        if (!token) {
          alert("Erro: Token não encontrado. Você precisa estar logado.");
          return;
        }
  
        const response = await fetch(`/api/usuario/remover/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  // Passando o token de acesso correto
          },
        });
  
        if (response.ok) {
          alert("Usuário excluído com sucesso!");
          fetchUsuarios(); // Atualiza a lista de usuários
          fetchUserData(); // Atualiza os dados da sessão
        } else {
          const errorResponse = await response.json(); // Captura a resposta de erro da API
          alert(`Erro ao excluir usuário: ${errorResponse.message || "Erro desconhecido."}`);
        }
      } catch (err) {
        console.error("Erro ao excluir usuário:", err);
        alert(`Erro ao excluir usuário: ${err.message}`);
      }
    }
  };

// Função para filtrar os usuários com base no valor da pesquisa
const handleSearch = (value: string) => {
  setSearchValue(value); // Atualiza o valor de pesquisa
  const filtered = usuarios.filter((usuario) =>
    usuario.name.toLowerCase().includes(value.toLowerCase()) || // Filtra pelo nome
    usuario.email.toLowerCase().includes(value.toLowerCase()) // Ou pelo email
  );
  setFilteredUsuarios(filtered); // Atualiza a lista de usuários filtrados
};

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
                {/* Input de Pesquisa */}
            <div className={styles.searchPage}>
              <input
                className={styles.searchPage}
                type="text"
                placeholder="Pesquisar por nome ou email"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)} // Chama handleSearch ao digitar
              />
            </div>
          {loading && <p>Carregando a lista de usuários...</p>}
          {error && (
            <div>
              <p className={styles.errorMessage}>{error}</p>
              <button onClick={fetchUsuarios}>Tentar novamente</button>
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
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                {filteredUsuarios.length === 0 ? (
                    <tr>
                      <td colSpan={4}>Nenhum usuário encontrado.</td>
                    </tr>
                  ) : (
                    filteredUsuarios.map((usuario: any) => (
                      <tr key={usuario.id}>
                        <td>{usuario.name}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.role}</td>
                        <td>
                          {/* Botões de ação: Editar e Excluir */}
                          <button onClick={() => {
                            setEditingUserId(usuario.id);
                            setEditedUser({ name: usuario.name, email: usuario.email });
                          }}>
                            Editar
                          </button>
                          <button onClick={() => handleDelete(usuario.id)}>Excluir</button>

                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Modal de edição */}
              {editingUserId && (
                <div className={styles.editModal}>
                  <h3>Editar Usuário</h3>
                  <label>
                    Nome:
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    />
                  </label>
                  <button onClick={() => handleEdit(editingUserId)}>Salvar</button>
                  <button onClick={() => setEditingUserId(null)}>Cancelar</button>

                  
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Conteúdo para usuários normais */}
      {role === "NORMAL" && (
  <div className={styles.adminPanel}>
    <h2>Bem-vindo, {session?.user?.name}!</h2>
    <p>Você pode visualizar suas informações e editar seu perfil.</p>

    {/* Se o usuário está no modo de edição, exibe os campos de edição */}
    {isEditingProfile ? (
      <div>
        <label>
          Nome:
          <input
            type="text"
            value={editedUser.name}
            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={editedUser.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
          />
        </label>
        <button onClick={() => handleEdit(session?.user?.id)}>Salvar</button>
        <button onClick={() => setIsEditingProfile(false)}>Cancelar</button>
      </div>
    ) : (
      // Caso o usuário não esteja editando, exibe as informações de forma estática
      <div>
        <p><strong>Nome:</strong> {session?.user?.name}</p>
        <p><strong>Email:</strong> {session?.user?.email}</p>
        <button
          onClick={() => {
            // Quando o modo de edição for ativado, definimos os valores iniciais
            setEditedUser({
              name: session?.user?.name || "",
              email: session?.user?.email || "",
            });
            setIsEditingProfile(true);  // Ativa o modo de edição
          }}
        >
          Editar
        </button>
        <button onClick={() => handleDelete(session?.user?.id)}>Excluir</button>
      </div>
    )}
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
