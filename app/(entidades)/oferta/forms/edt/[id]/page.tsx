'use client';

import styles from "@/app/ui/ui.module.css";
import SubmitButton from "@/app/ui/submitbutton";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { handleEditarOferta, handleObterOfertaPorId } from "@/app/(entidades)/oferta/action";
import { handleObterJogos } from "@/app/(entidades)/jogo/action";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function FormEdtOferta() {
  const router = useRouter();
  const params = useParams();
  const ofertaId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [mensagem, setMensagem] = useState<string>("");
  const [jogos, setJogos] = useState<{ id: string; nome: string }[]>([]);
  const [oferta, setOferta] = useState<any>(null);

  // Fetch para obter os sites disponíveis
  const { data: sites, error: errorSites, isLoading: isLoadingSites } = useSWR(
    "/api/sites/listar",
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

  // Fetch para obter a oferta atual
  useEffect(() => {
    const fetchOferta = async () => {
      try {
        const ofertaData = await handleObterOfertaPorId(ofertaId);
        setOferta(ofertaData);
      } catch (error) {
        console.error("Erro ao obter a oferta:", error);
        setMensagem("Erro ao carregar a oferta.");
      }
    };

    if (ofertaId) {
      fetchOferta();
    }
  }, [ofertaId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const ofertaEditada = {
      id: ofertaId,
      endereco: formData.get("endereco") as string,
      preco: parseFloat(formData.get("preco") as string),
      siteId: formData.get("siteId") as string,
      jogoId: formData.get("jogoId") as string,
    };

    try {
      const sucesso = await handleEditarOferta(ofertaEditada);
      if (sucesso) {
        router.push("/oferta"); // Redireciona para a lista de ofertas
      } else {
        setMensagem("Erro ao editar a oferta.");
      }
    } catch (error) {
      console.error("Erro ao editar a oferta:", error);
      setMensagem("Erro ao editar a oferta.");
    }
  };

  if (isLoadingSites) {
    return <p>Carregando sites...</p>;
  }

  if (errorSites || !sites) {
    return <p>Erro ao carregar os sites.</p>;
  }

  if (!jogos.length || !oferta) {
    return <p>Carregando dados...</p>;
  }

  return (
    <div className={styles.formularioDiv}>
      <h2>Editar Oferta</h2>
      <Image
        src="/Octagon.png"
        alt="PromGame"
        width={60}
        height={60}
        style={{ margin: "10px 0px 0px" }}
      />
      <form className={styles.formularioForm} onSubmit={handleSubmit}>
        <label>
          <Image
            src="/site.png"
            alt="Icon"
            width={20}
            height={20}
            style={{ margin: "0px 3px -3px" }}
          />
          <input
            placeholder="Endereço da Oferta (URL):"
            type="url"
            id="iptOfertaEndereco"
            name="endereco"
            defaultValue={oferta.endereco}
            required
          />
        </label>
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
            defaultValue={oferta.preco}
            required
          />
        </label>
        <label>
          <select name="siteId" id="selOfertaSite" defaultValue={oferta.siteId} required>
            <option value="">Selecione um site</option>
            {sites &&
              sites.map((site: { id: string; nome: string }) => (
                <option key={site.id} value={site.id}>
                  {site.nome}
                </option>
              ))}
          </select>
        </label>
        <label>
          <select name="jogoId" id="selOfertaJogo" defaultValue={oferta.jogoId} required>
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
