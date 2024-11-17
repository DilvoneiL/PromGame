import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PromGame",
  applicationName: "PromGame",
  description: "Sistema web exemplo de Loja criado com NextJS",
  generator: "Next.js",
  keywords: ["Next.js", "React", "JavaScript", "Loja"],
  authors: [{ name: "PromGame" }],
  publisher: " ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
