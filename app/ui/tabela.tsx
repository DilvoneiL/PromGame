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

  const ths = (
    <tr>
      <th><input type="checkbox" name="seltodos" id="seltodos" onChange={cliqueCheckTodos} /></th>
      {cabecalho.map(col => <th>{col}</th>)}
    </tr>
  );

  const tds = linhas.map(lnh => (
    <tr>
      <td><input type="checkbox" name={`sel${lnh[0]}`} id={`sel${lnh[0]}`} /></td>
      {lnh.map(col => <td>{col}</td>)}
    </tr>
  ));

  return (
    <div className={styles.tabeladiv}>
      <table id="tabelaCRUD" className={styles.tabela}>
        <thead>
          {ths}
        </thead>
        <tbody>
          {tds}
        </tbody>
      </table>
    </div>
  );
}

export function obterSelecionadas(apenasUm: boolean) {

  let x = 0;
  const entidades: string[][] = [];
  const trs: NodeListOf<HTMLTableRowElement> =
    document.querySelectorAll("#tabelaCRUD tbody tr");

  for (let t = 0; t < trs.length; t++) {

    const checkbox = trs[t].cells[0].children[0] as HTMLInputElement;

    if (checkbox.checked) {

      let entidade: string[] = [];

      for (let i = 1; i < trs[t].cells.length; i++)
        entidade.push(trs[t].cells[i].innerText);

      entidades.push(entidade);

      if (apenasUm) break;
    }
  }

  return entidades;
}