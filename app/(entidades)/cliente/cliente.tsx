import Entidade from "@/app/(entidades)/entidade";

export default class Cliente extends Entidade {
  nome: string;
  email: string;
  senha: string;

  constructor(id: string = "", nome: string = "", email: string = "", senha: string = "") {
    super(id);
    this.nome = nome;
    this.email = email;
    this.senha = senha;
  }
}

