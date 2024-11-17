import { login } from "@/data/clienteDAO";

export const POST = async (request: Request) => {

  const { email, senha } = await request.json();

  if (email && senha) {
    return Response.json({ login: await login(email, senha) });
  }
  else return Response.json({ login: false });

};