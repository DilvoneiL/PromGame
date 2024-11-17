import { obterCliente } from "@/data/clienteDAO";


export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    return Response.json(await obterCliente(id));
  }
  else return Response.json({ id: false });
}