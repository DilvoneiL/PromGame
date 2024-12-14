'use server';

import { obterOfertas, obterOfertaPorId, inserirOferta, editarOferta, removerOferta,buscarOfertas } from '@/data/ofertaDAO';
import Oferta from '@/app/(entidades)/oferta/oferta';

// Função para obter todas as ofertas
export async function handleObterOfertas(): Promise<Oferta[]> {
  try {
    return await obterOfertas();
  } catch (error) {
    console.error("Erro ao obter ofertas:", error);
    throw new Error("Erro ao obter ofertas.");
  }
}

// Função compatível com useSWR
export async function listarOfertasSWR(): Promise<Oferta[]> {
  return await handleObterOfertas();
}

// Função para obter uma oferta por ID
export async function handleObterOfertaPorId(id: string): Promise<Oferta | null> {
  try {
    return await obterOfertaPorId(id);
  } catch (error) {
    console.error('Erro ao obter oferta por ID:', error);
    throw new Error('Erro ao obter oferta.');
  }
}

// Função para criar uma nova oferta
export async function handleInserirOferta(oferta: Oferta): Promise<boolean> {
  try {
    return await inserirOferta(oferta);
  } catch (error) {
    console.error('Erro ao inserir oferta:', error);
    throw new Error('Erro ao inserir oferta.');
  }
}

// Função para editar uma oferta existente
export async function handleEditarOferta(oferta: Oferta): Promise<boolean> {
  try {
    return await editarOferta(oferta);
  } catch (error) {
    console.error('Erro ao editar oferta:', error);
    throw new Error('Erro ao editar oferta.');
  }
}

// Função para remover uma oferta
export async function handleRemoverOferta(id: string): Promise<boolean> {
  try {
    return await removerOferta(id);
  } catch (error) {
    console.error('Erro ao remover oferta:', error);
    throw new Error('Erro ao remover oferta.');
  }
}

// Função para buscar ofertas por um critério
export async function handleBuscarOferta(criterio: string): Promise<Oferta[]> {
  try {
    return await buscarOfertas(criterio);
  } catch (error) {
    console.error('Erro ao buscar ofertas:', error);
    throw new Error('Erro ao buscar ofertas.');
  }
}
