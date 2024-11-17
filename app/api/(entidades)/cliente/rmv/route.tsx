import { removerCliente } from "@/data/clienteDAO";


export async function POST(request: Request) {

  const res = await request.json();
  const id = res.id;

  if (id) {
    return Response.json({
      mensagem: removerCliente(id)
    });
  }
  else return Response.json({ mensagem: false });
}