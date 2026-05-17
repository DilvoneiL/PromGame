export default class Cliente {
  constructor(
    public id = "",
    public nome = "",
    public email = "",
    public senha: string | null = null
  ) {}
}
