'use client';
import styles from "@/app/(entidades)/entidades.module.css";

import Site from "@/app/(entidades)/sites/site";
import Tabela, { obterSelecionadas } from "@/app/ui/tabela";
import PainelCRUD from "@/app/ui/painelcrud";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { removerSiteAction } from "./action";

export default function Sites() {
  const router = useRouter();

  const { data, error, isLoading } = useSWR<Site[]>(
    'http://localhost:3000/api/sites/listar',
    (url: string) => fetch(url).then((res) => res.json())
  );

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
  const sites = data && data.length > 0
    ? data.sort((a, b) => a.id.localeCompare(b.id))
    : [new Site("", "", "")];

  const cabecalho = ["Id", "Nome", "Endereço"];
  const linhas = sites.map((s) => [s.id, s.nome, s.endereco]);

  // Atualiza as linhas filtradas com base no input
  const handleSearch = (value: string) => {
    setSearchValue(value); // Atualiza o estado do input de pesquisa
    const filtered = linhas.filter((linha) =>
      linha[1]?.toLowerCase().includes(value.toLowerCase()) // Filtra pelo nome
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
        adicionar={() => router.push("/sites/forms/adc")}
        editar={() =>
          router.push("/sites/forms/edt/" + obterSelecionadas(true)[0][0])
        }
        remover={cliqueRemover}
      />

      {/* Tabela com as linhas filtradas */}
      <Tabela cabecalho={cabecalho} linhas={linhasExibidas} />
    </div>
  );
}

// Função de remoção
function cliqueRemover() {
  const valores = obterSelecionadas(true);
  if (valores.length === 0) {
    alert("Selecione uma entidade na tabela.");
    return;
  }

  removerSiteAction(valores[0][0]).then((msn) => alert(msn.mensagem));
}
