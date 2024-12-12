'use client';
import styles from "@/app/(entidades)/entidades.module.css";

import Oferta from "./oferta";
import Tabela, { obterSelecionadas } from "@/app/ui/tabela";
import PainelCRUD from "@/app/ui/painelcrud";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleRemoverOferta, listarOfertasSWR} from "./action";

export default function Ofertas() {
  const router = useRouter();

  const { data, error, isLoading } = useSWR('/api/ofertas/listar', listarOfertasSWR);

  const [searchValue, setSearchValue] = useState(""); // Estado para valor do input de pesquisa
  const [filteredLinhas, setFilteredLinhas] = useState<string[][]>([]); // Estado para linhas filtradas

  if (isLoading) {
    return (
      <div className={styles.entidade}>
        <h1>Carregando...</h1>
      </div>
    );
  }

  // Processa os dados recebidos
  const ofertas = data && data.length > 0 ? data : [];

  const cabecalho = ["Id", "Endereço", "Preço", "Site", "Jogo"];
  const linhas = ofertas.map((o) => [
    o.id || "", // Garante que o ID seja uma string
    o.endereco || "", // Garante que o endereço seja uma string
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(o.preco || 0), // Formata o preço como string
    o.site?.nome || "Sem site", // Garante que sempre será uma string
    o.jogo?.nome || "Sem jogo", // Garante que sempre será uma string
  ]);
  
  // Atualiza as linhas filtradas com base no input
  const handleSearch = (value: string) => {
    setSearchValue(value); // Atualiza o estado do input de pesquisa
    const filtered = linhas.filter((linha) =>
      linha[1]?.toLowerCase().includes(value.toLowerCase()) // Filtra pelo endereço
    );
    setFilteredLinhas(filtered); // Atualiza o estado com as linhas filtradas
  };

  // Define se deve usar as linhas filtradas ou todas as linhas
  const linhasExibidas = searchValue ? filteredLinhas : linhas;

  return (
    <div className={styles.entidade}>
      {/* Input de Pesquisa */}
      <div className={styles.searchPage}>
        <input
          className={styles.searchPage}
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)} // Chama handleSearch ao digitar
        />
      </div>

      {/* Painel CRUD */}
      <PainelCRUD
        adicionar={() => router.push("/oferta/forms/adc")}
        editar={() =>
          router.push("/ofertas/forms/edt/" + obterSelecionadas(true)[0][0])
        }
        remover={cliqueRemover}
      />

      {/* Tabela com as linhas filtradas */}
      <Tabela cabecalho={cabecalho} linhas={linhasExibidas} />
    </div>
  );
}

// Função de remoção
async function cliqueRemover() {
  const valores = obterSelecionadas(true);
  if (valores.length === 0) {
    alert("Selecione uma oferta na tabela.");
    return;
  }

  try {
    const sucesso = await handleRemoverOferta(valores[0][0]); // Atualizado para handleRemoverOferta
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
