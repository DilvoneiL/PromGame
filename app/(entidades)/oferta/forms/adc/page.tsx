'use client';

import styles from "@/app/ui/ui.module.css";
import SubmitButton from "@/app/ui/submitbutton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleInserirOferta } from "@/app/(entidades)/oferta/action";
import { handleObterJogos } from "@/app/(entidades)/jogo/action";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function FormAdcOferta() {
  const router = useRouter();
  const [mensagem, setMensagem] = useState<string>("");
  const [jogos, setJogos] = useState<{ id: string; nome: string }[]>([]);

  // Fetch para obter os sites disponíveis
  const { data: sites, error: errorSites, isLoading: isLoadingSites } = useSWR(
    '/api/sites/listar',
    (url: string) => fetch(url).then((res) => res.json())
  );

  // Fetch para obter os jogos usando handleObterJogos
  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const jogos = await handleObterJogos();
        setJogos(jogos);
      } catch (error) {
        console.error("Erro ao obter jogos:", error);
        setMensagem("Erro ao carregar os jogos.");
      }
    };

    fetchJogos();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const oferta = {
      endereco: formData.get("endereco") as string,
      preco: parseFloat(formData.get("preco") as string),
      siteId: formData.get("siteId") as string,
      jogoId: formData.get("jogoId") as string,
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

  if (isLoadingSites) {
    return <p>Carregando sites...</p>;
  }

  if (errorSites || !sites) {
    return <p>Erro ao carregar os sites.</p>;
  }

  if (!jogos.length) {
    return <p>Carregando jogos...</p>;
  }

  return (
    <div className={styles.formularioDiv}>
      <h2>Adicionar Oferta</h2>
      <Image
        src="/Octagon.png"
        alt="PromGame"
        width={60}
        height={60}
        style={{ margin: "10px 0px 0px" }}
      />
      <form className={styles.formularioForm} onSubmit={handleSubmit}>
        
        {/* Título Endereço da Oferta */}
        <p style={{ margin: "0 0 5px", color: "#ccc", fontSize: "0.8rem" }}>Endereço da Oferta:</p>
        <label>
          <Image
            src="/site.png"
            alt="Icon"
            width={20}
            height={20}
            style={{ margin: "0px 3px -3px" }}
          />
          <input
            placeholder=" Endereço da Oferta (URL)"
            type="url"
            id="iptOfertaEndereco"
            name="endereco"
            required
          />
        </label>

        {/* Título Valor da Oferta */}
        <p style={{ margin: "10px 0 5px", color: "#ccc", fontSize: "0.8rem" }}>Valor da Oferta:</p>
        <label>
          <Image
            src="/price.png"
            alt="Icon"
            width={20}
            height={20}
            style={{ margin: "0px 3px -3px" }}
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

        {/* Título Site */}
        <p style={{ margin: "10px 0 5px", color: "#ccc", fontSize: "0.8rem" }}>Site:</p>
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

        {/* Título Jogo */}
        <p style={{ margin: "10px 0 5px", color: "#ccc", fontSize: "0.8rem" }}>Jogo:</p>
        <label>
          <select name="jogoId" id="selOfertaJogo" required>
            <option value="">Selecione um jogo</option>
            {jogos.map((jogo) => (
              <option key={jogo.id} value={jogo.id}>
                {jogo.nome}
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
