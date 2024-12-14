'use client';
import styles from "@/app/(entidades)/entidades.module.css";

import Site from "@/app/(entidades)/sites/site";
import Tabela, { obterSelecionadas } from "@/app/ui/tabela";
import PainelCRUD from "@/app/ui/painelcrud";
import Filtro from "@/app/ui/seach";

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

  const [linhasExibidas, setLinhasExibidas] = useState<string[][]>([]);

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

  // Função de filtro para o componente Filtro
  const filtroPorNome = (linha: string[], valor: string) =>
    linha[1]?.toLowerCase().includes(valor.toLowerCase());

  return (
    <div className={styles.entidade}>
      {/* Filtro */}
      <Filtro
        placeholder="Search by name"
        dados={linhas}
        filtro={filtroPorNome}
        onFiltrar={setLinhasExibidas}
      />

      {/* Painel CRUD */}
      <PainelCRUD
        adicionar={() => router.push("/sites/forms/adc")}
        editar={() =>
          router.push("/sites/forms/edt/" + obterSelecionadas(true)[0][0])
        }
        remover={cliqueRemover}
      />

      {/* Tabela com as linhas filtradas */}
      <Tabela cabecalho={cabecalho} linhas={linhasExibidas.length > 0 ? linhasExibidas : linhas} />
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
