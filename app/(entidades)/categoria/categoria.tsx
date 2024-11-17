export default class Categoria {
  id?: string;
  nome: string;
  descricao: string;

  constructor(nome: string, descricao: string, id?:string) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
  }
}
