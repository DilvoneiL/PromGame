'use client';
import styles from "@/app/(entidades)/entidades.module.css";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Tabela, { obterSelecionadas } from "@/app/ui/tabela";
import PainelCRUD from "@/app/ui/painelcrud";
import { handleRemoverOferta, listarOfertasSWR } from "./action";

export default function Ofertas() {
  const router = useRouter();

  // Obter dados das ofertas com SWR
  const { data, error, isLoading } = useSWR("/api/ofertas/listar", listarOfertasSWR);

  // Estados para pesquisa e filtragem
  const [searchValue, setSearchValue] = useState(""); // Valor do input de pesquisa
  const [filteredLinhas, setFilteredLinhas] = useState<string[][]>([]); // Linhas filtradas

  if (isLoading) {
    return (
      <div className={styles.entidade}>
        <h1>Carregando...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.entidade}>
        <h1>Erro ao carregar as ofertas.</h1>
      </div>
    );
  }

  // Processa as ofertas recebidas
  const ofertas = data && data.length > 0 ? data : [];

  // Cabeçalho da tabela
  const cabecalho = ["Id", "Endereço", "Preço", "Site", "Jogo"];

  // Mapeia as ofertas em linhas da tabela
  const linhas = ofertas.map((oferta) => [
    oferta.id || "Sem ID", // ID da oferta
    oferta.endereco || "Sem endereço", // Endereço da oferta
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(oferta.preco || 0), // Preço formatado em BRL
    oferta.site?.nome || "Sem site", // Nome do site associado
    oferta.jogo?.nome || "Sem jogo", // Nome do jogo associado
  ]);

  // Função para pesquisar nas linhas
  const handleSearch = (value: string) => {
    setSearchValue(value); // Atualiza o estado da pesquisa
    const filtered = linhas.filter((linha) =>
      linha.some((coluna) =>
        coluna.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredLinhas(filtered); // Atualiza as linhas filtradas
  };

  // Define se usa as linhas filtradas ou todas
  const linhasExibidas = searchValue ? filteredLinhas : linhas;

  return (
    <div className={styles.entidade}>
      {/* Input de Pesquisa */}
      <div className={styles.searchPage}>
        <input
          className={styles.searchPage}
          type="text"
          placeholder="Pesquisar ofertas"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)} // Atualiza a pesquisa ao digitar
        />
      </div>

      {/* Painel CRUD */}
      <PainelCRUD
        adicionar={() => router.push("/oferta/forms/adc")}
        editar={() =>
          router.push("/oferta/forms/edt/" + obterSelecionadas(true)[0][0])
        }
        remover={cliqueRemover}
      />

      {/* Tabela com ofertas */}
      <Tabela cabecalho={cabecalho} linhas={linhasExibidas} />
      <p>{linhas}</p>
    </div>
  );
}

// Função para remover uma oferta
async function cliqueRemover() {
  const valores = obterSelecionadas(true); // Obtém as ofertas selecionadas
  if (valores.length === 0) {
    alert("Selecione uma oferta na tabela.");
    return;
  }

  try {
    const sucesso = await handleRemoverOferta(valores[0][0]); // Remove a oferta selecionada
    if (sucesso) {
      alert("Oferta removida com sucesso.");
    } else {
      alert("Erro ao remover oferta.");
    }
  } catch (error) {
    console.error("Erro ao remover oferta:", error);
    alert("Erro ao remover oferta.");
  }
}
