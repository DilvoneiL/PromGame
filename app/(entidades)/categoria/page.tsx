'use client'
import styles from "@/app/(entidades)/entidades.module.css";

import Cliente from "@/app/(entidades)/cliente/cliente";
import Tabela, { obterSelecionadas } from "@/app/ui/tabela";
import PainelCRUD from "@/app/ui/painelcrud";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { removerCliente } from "./action";


export default function Clientes() {

  const router = useRouter();

  const { data, error, isLoading } = useSWR<Cliente[]>(
    'http://localhost:3000/api/cliente/obt',
    (url: string) => fetch(url).then((res => res.json()))
  );

  if (isLoading) {
    return (
      <div className={styles.entidade}>
        <h1>Clientes</h1>
        <h1>Carregando...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.entidade}>
        <h1>Clientes</h1>
        <h1>Error ao carregar os clientes.</h1>
      </div>
    );
  }

  const clientes = data && data.length > 0 ?
    data.sort((a, b) => a.id - b.id) :
    [new Cliente()];

  const cabecalho = ["Id", "Nome", "Email"];
  const linhas = clientes.map(c => [c.id.toString(), c.nome, c.email]);

  return (
    <div className={styles.entidade}>
      <h1>Clientes</h1>
      <Tabela cabecalho={cabecalho} linhas={linhas} />
      <PainelCRUD
        adicionar={() => router.push("/cliente/forms/adc")}
        editar={() => router.push("/cliente/forms/edt/" + obterSelecionadas(true)[0][0])}
        remover={cliqueRemover}
      />
    </div>
  );
}

function cliqueRemover() {

  const valores = obterSelecionadas(true);
  if (valores.length == 0)
    alert("Selecione uma entidade na tabela.");

  removerCliente(Number(valores[0][0])).then(msn => alert(msn.mensagem));
}
