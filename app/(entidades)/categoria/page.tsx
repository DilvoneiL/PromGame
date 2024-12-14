'use client';
import styles from "@/app/(entidades)/entidades.module.css";

import Categoria from "@/app/(entidades)/categoria/categoria";
import Tabela, { obterSelecionadas } from "@/app/ui/tabela";
import PainelCRUD from "@/app/ui/painelcrud";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { removerCategoriaAction } from "./action";
import Filtro from "@/app/ui/seach";

export default function Categorias() {
  const router = useRouter();

  const { data, error, isLoading } = useSWR<Categoria[]>(
    "http://localhost:3000/api/categoria/listar",
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

  const categorias = data && data.length > 0
    ? data.sort((a, b) => a.id.localeCompare(b.id))
    : [new Categoria()];

  const cabecalho = ["Id", "Nome", "Descrição"];
  const linhas = categorias.map((c) => [c.id, c.nome, c.descricao]);

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
        adicionar={() => router.push("/categoria/forms/adc")}
        editar={() =>
          router.push("/categoria/forms/edt/" + obterSelecionadas(true)[0][0])
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

  removerCategoriaAction(valores[0][0]).then((msn) => alert(msn.mensagem));
}
