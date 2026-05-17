
export default class Site {
  id: string;
  nome: string;
  endereco: string;

  constructor(nome = "", endereco = "", id = "") {
    this.id = id;
    this.nome = nome;
    this.endereco = endereco;
  }
}
