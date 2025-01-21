'use client';
import styles from "@/app/(entidades)/entidades.module.css";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Tabela, { obterSelecionadas } from "@/app/ui/tabela";
import PainelCRUD from "@/app/ui/painelcrud";
import Filtro from "@/app/ui/seach"; // Importando o componente de filtro
import { handleRemoverOferta, listarOfertasSWR } from "./action";

export default function Ofertas() {
  const router = useRouter();

  // Obter dados das ofertas com SWR
  const { data, error, isLoading } = useSWR("/api/ofertas/listar", listarOfertasSWR);

  // Estado para as linhas exibidas na tabela
  const [linhasExibidas, setLinhasExibidas] = useState<string[][]>([]);

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
    oferta.preco
      ? (
        <span style={{ fontWeight: "bold", color: "#39ff14" }}>
          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(oferta.preco)}
        </span>
      )
      : "Sem preço", // Preço formatado com destaque
    oferta.site?.nome || "Sem site", // Nome do site (sem link clicável)
    oferta.jogo?.nome || "Sem jogo", // Nome do jogo associado
  ]);

  // Função de filtro para buscar por endereço
  const filtroPorEndereco = (linha: string[], valor: string) =>
    linha[1]?.toLowerCase().includes(valor.toLowerCase()); // Filtra pela coluna "Endereço"

  return (
    <div className={styles.entidade}>
      {/* Filtro */}
      <Filtro
        placeholder="Pesquisar por endereço"
        dados={linhas}
        filtro={filtroPorEndereco}
        onFiltrar={setLinhasExibidas}
      />

      {/* Painel CRUD */}
      <PainelCRUD
        adicionar={() => router.push("/oferta/forms/adc")}
        editar={() =>
          router.push("/oferta/forms/edt/" + obterSelecionadas(true)[0][0])
        }
        remover={cliqueRemover}
      />

      {/* Tabela com ofertas */}
      <Tabela cabecalho={cabecalho} linhas={linhasExibidas.length > 0 ? linhasExibidas : linhas} />
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
