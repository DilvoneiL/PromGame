'use client';

import styles from "@/app/ui/ui.module.css";
import SubmitButton from "@/app/ui/submitbutton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { handleInserirOferta } from "@/app/(entidades)/oferta/action";
import { useState } from "react";
import Image from "next/image";

export default function FormAdcOferta() {
  const router = useRouter();
  const [mensagem, setMensagem] = useState<string>("");

  // Fetch para obter os sites disponíveis
  const { data: sites, error, isLoading } = useSWR('/api/sites/listar', (url: string) =>
    fetch(url).then((res) => res.json())
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const oferta = {
      endereco: formData.get("endereco") as string,
      preco: parseFloat(formData.get("preco") as string),
      siteId: formData.get("siteId") as string,
    };

    try {
      const sucesso = await handleInserirOferta(oferta);
      if (sucesso) {
        router.push("/oferta"); // Redireciona para a lista de ofertas
      } else {
        setMensagem("Erro ao adicionar a oferta.");
      }
    } catch (error) {
      console.error("Erro ao adicionar a oferta:", error);
      setMensagem("Erro ao adicionar a oferta.");
    }
  };

  if (isLoading) {
    return <p>Carregando sites...</p>;
  }

  if (error) {
    return <p>Erro ao carregar os sites.</p>;
  }

  return (
    <div className={styles.formularioDiv}>
      <h2>Adicionar Oferta</h2>
      <Image
              src="/Octagon.png"
              alt="PromGame"
              width={60}
              height={60}
              style={{ margin : "10px 0px 0px"}}
            />
      <form className={styles.formularioForm} onSubmit={handleSubmit}>
        <label>
        <Image
          src="/site.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px -3px"}} // Alinha a imagem ao lado do texto
        />
          <input
            placeholder=" Endereço da Oferta (URL):"
            type="url"
            id="iptOfertaEndereco"
            name="endereco"
            required
          />
        </label>
        <label>
        <Image
          src="/price.png"
          alt="Icon"
          width={20}
          height={20}
          style={{ margin : "0px 3px -3px"}} // Alinha a imagem ao lado do texto
        />
          <input
            placeholder="Valor da Oferta"
            type="number"
            step="0.01"
            id="iptOfertaPreco"
            name="preco"
            required
          />
        </label>
        <label>
          <select name="siteId" id="selOfertaSite" required>
            <option value="">Selecione um site</option>
            {sites &&
              sites.map((site: { id: string; nome: string }) => (
                <option key={site.id} value={site.id}>
                  {site.nome}
                </option>
              ))}
          </select>
        </label>
        <div className={styles.formularioPainel}>
          <SubmitButton rotulo="Confirmar" />
          <Link href="/oferta">
            <button type="button">Cancelar</button>
          </Link>
        </div>
        <p aria-live="polite" role="status">
          {mensagem}
        </p>
      </form>
    </div>
  );
}
