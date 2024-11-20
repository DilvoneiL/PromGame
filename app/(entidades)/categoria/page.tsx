'use client'
import styles from "@/app/(entidades)/entidades.module.css";

import Categoria from "@/app/(entidades)/categoria/categoria";
import Tabela, { obterSelecionadas } from "@/app/ui/tabela";
import PainelCRUD from "@/app/ui/painelcrud";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { removerCategoriaAction } from "./action";

export default function Categorias() {
  const router = useRouter();

  const { data, error, isLoading } = useSWR<Categoria[]>(
    'http://localhost:3000/api/categoria/listar',
    (url: string) => fetch(url).then((res) => res.json())
  );

  if (isLoading) {
    return (
      <div className={styles.entidade}>
        <h1>Categorias</h1>
        <h1>Carregando...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.entidade}>
        <h1>Categorias</h1>
        <h1>Erro ao carregar as categorias.</h1>
      </div>
    );
  }

  const categorias = data && data.length > 0
    ? data.sort((a, b) => a.id.localeCompare(b.id))
    : [new Categoria()];

  const cabecalho = ["Id", "Nome", "Descrição"];
  const linhas = categorias.map((c) => [c.id.toString(), c.nome, c.descricao]);



  return (
    <div className={styles.entidade}>
      <h1>Categorias</h1>  
      <Tabela cabecalho={cabecalho} linhas={linhas} />
      <PainelCRUD
        adicionar={() => router.push("/categoria/forms/adc")}
        editar={() =>    
          router.push("/categoria/forms/edt/" + obterSelecionadas(true)[0][0])
        }
        remover={cliqueRemover}
      />
    </div>
  );
}

function cliqueRemover() {
  const valores = obterSelecionadas(true);
  if (valores.length === 0) {
    alert("Selecione uma entidade na tabela.");
    return;
  }

  removerCategoriaAction(valores[0][0]).then((msn) => alert(msn.mensagem));
}
