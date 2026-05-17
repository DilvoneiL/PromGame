import type Oferta from "@/app/(entidades)/oferta/oferta";

export default class Jogo {
  constructor(
    public nome: string, // Nome do jogo
    public ano: Date, // Ano de lançamento
    public publisher: string, // Empresa responsável
    public descricao: string, // Descrição do jogo
    public categorias: string[], // Lista de nomes das categorias associadas
    public ofertas: Oferta[] = [], // Lista de ofertas relacionadas
    public imagemUrl = "/upload.png", // URL da imagem do jogo
    public id = "" // ID do jogo
  ) {}
}
