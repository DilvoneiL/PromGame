import { gerarRelatorioJogosMaisDesejados } from "@/data/listaDesejosDAO";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { adminId } = req.query;

  if (!adminId || typeof adminId !== "string") {
    return res.status(400).json({ error: "Parâmetro adminId ausente ou inválido." });
  }

  try {
    const relatorio = await gerarRelatorioJogosMaisDesejados(adminId);
    return res.status(200).json({ relatorio });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
