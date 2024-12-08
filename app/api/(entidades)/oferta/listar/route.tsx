import { NextApiRequest, NextApiResponse } from "next";
import { handleObterOfertas } from "@/app/(entidades)/oferta/action";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const ofertas = await handleObterOfertas();
      res.status(200).json(ofertas);
    } catch (error) {
      console.error("Erro ao listar ofertas:", error);
      res.status(500).json({ error: "Erro ao listar ofertas." });
    }
  } else {
    res.status(405).json({ error: "Método não permitido." });
  }
}
