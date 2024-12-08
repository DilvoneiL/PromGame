export default class Oferta {
  constructor(
    public endereco: string,
    public preco: number,
    public siteId: string,
    public id?: string // Opcional, pois é gerado pelo banco
  ) {}
}
