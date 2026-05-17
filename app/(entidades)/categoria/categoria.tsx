export default class Categoria {
  id: string;
  nome: string;
  descricao: string;

  constructor(nome = "", descricao = "", id = "") {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
  }
}
