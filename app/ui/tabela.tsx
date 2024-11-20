'use client'
import styles from "./ui.module.css";
export default function Tabela({ cabecalho, linhas }: { cabecalho: string[], linhas: string[][] }) {

  function cliqueCheckTodos() {

    const checks: NodeListOf<HTMLInputElement> =
      document.querySelectorAll("#tabelaCRUD tbody input[type='checkbox']");

    for (let i = 0; i < checks.length; i++) {
      checks[i].checked = (document.getElementById("seltodos")! as HTMLInputElement).checked;
    }
  }



  const tds = linhas.map((lnh, index) => (
    <tr key={index} >
      {/* Mantendo os dados dentro das células da tabela */}
      <td className={styles.card}>
        <div className={styles.card_content}>
          <div className={styles.card_header}>
            <div className={styles.card_image }>
            <img src="../favicon.png" alt=" " />
            <h3>{lnh[1]}</h3> {/* O título */}
            </div>
            <p>{lnh[2]}</p> {/* O texto descritivo */}
          </div>
        </div>
      </td>
      <td>
        {/* Certifique-se de que o value seja uma string para evitar cortar IDs longos */}
        <input
          type="checkbox"
          name={`sel${lnh[0]}`} // Opcional manter no `name`
          id={lnh[0]} // Usar apenas o ID real
          value={lnh[0]} // Garantir que o valor seja o ID real
        />
      </td>
    </tr>
  ));
  
  return (
    <div className={styles.tabeladiv}>
      <table id="tabelaCRUD" className={styles.tabela}>
        <thead>
          
        </thead>
        <tbody>
          {tds}
        </tbody>
      </table>
    </div>
  );
  };
  
  // Função para obter apenas os IDs selecionados
export function obterSelecionadas(apenasUm: boolean): string[][] {
  console.log('Iniciando a função obterSelecionadas...');
  console.log('Parâmetro apenasUm:', apenasUm);

  const entidades: string[][] = [];
  const trs: NodeListOf<HTMLTableRowElement> =
    document.querySelectorAll("#tabelaCRUD tbody tr");

  console.log('Linhas encontradas na tabela:', trs.length);

  for (let t = 0; t < trs.length; t++) {
    console.log(`Processando linha ${t + 1} de ${trs.length}...`);

    const checkbox = trs[t].cells[1]?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    if (checkbox && checkbox.checked) {
      console.log(`Checkbox na linha ${t + 1} está marcado.`);
      console.log(`ID do checkbox (usando atributo 'id'):`, checkbox.id);

      const entidade: string[] = [checkbox.id]; // Adiciona o ID do checkbox como o primeiro elemento

      // Percorre as células (exceto a coluna do checkbox) para capturar seus valores
      for (let i = 1; i < trs[t].cells.length; i++) {
        entidade.push(trs[t].cells[i].innerText);
      }

      entidades.push(entidade);

      if (apenasUm) {
        console.log('Parâmetro apenasUm é true. Interrompendo a execução...');
        break;
      }
    }
  }

  console.log('Entidades retornadas:', entidades);

  return entidades;
}

  