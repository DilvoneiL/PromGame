export default class Jogo {
  constructor(
    public nome: string, // Nome do jogo
    public ano: Date, // Ano de lançamento
    public publisher: string, // Empresa responsável
    public descricao: string, // Descrição do jogo
    public categorias: string[], // Lista de nomes das categorias associadas
    public ofertas?: any[], // Lista de ofertas relacionadas (opcional)
    public imagemUrl?: string, // URL da imagem do jogo (opcional)
    public id?: string // ID do jogo (opcional, gerado pelo banco)
  ) {}
}
