import { obterClientes } from "@/data/clienteDAO";

export async function GET() {
  return Response.json(await obterClientes());
}