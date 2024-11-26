
export default class Site {
  id?: string;
  nome: string;
  endereco: string;

  constructor(nome: string, endereco: string, id?: string) {
    this.id = id;
    this.nome = nome;
    this.endereco = endereco;
  }
}
