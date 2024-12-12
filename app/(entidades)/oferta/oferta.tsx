export default class Oferta {
  constructor(
    public endereco: string,
    public preco: number,
    public siteId: string,
    public jogoId: string, // Campo para relacionar com o Jogo
    public id?: string, // Opcional, pois é gerado pelo banco
    public site?: { nome: string }, // Dados do site relacionado
    public jogo?: { nome: string }  // Dados do jogo relacionado
  ) {}
}
