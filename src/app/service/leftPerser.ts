import { Injectable } from '@angular/core';
import * as peggy from 'peggy';

@Injectable({
  providedIn: 'root'
})
export class LeftPerser {

  private parser!: peggy.Parser;

  constructor() {
    this.compileGrammar();
  }

  private compileGrammar() {
    const grammar = `
{
  let counter = 0;
  function nextId() {
    return counter++;
  }
}

start = lista:L {
  return lista;
}

// L -> L , id | T id
L = tipo:TIPO ids:ID_LIST pcoma:PCOMA {
  // Array invertido: [c, b, a] para int a, b, c
  let idsInvertidos = ids.reverse();

  // Caso base: T id
  let primerID = idsInvertidos[0];
  let nodoBase = {};
  let numBase = "L" + nextId();

  nodoBase.codigo = tipo.codigo
                  + primerID.codigo
                  + pcoma.codigo
                  + numBase + " [label=\\"L\\"];\\n"
                  + numBase + " -> " + tipo.numero + ";\\n"
                  + numBase + " -> " + primerID.numero + ";\\n"
                  + tipo.numero + " -> " + pcoma.numero + ";\\n";

  nodoBase.numero = numBase;
  let nodoActual = nodoBase;

  // Construir L -> L , id
  for (let i = 1; i < idsInvertidos.length; i++) {
    let nodoL = {};
    let numL = "L" + nextId();
    let idActual = idsInvertidos[i];

    nodoL.codigo = nodoActual.codigo
                 + idActual.codigo
                 + numL + " [label=\\"L\\"];\\n"
                 + numL + " -> " + nodoActual.numero + ";\\n"
                 + numL + " -> " + idActual.numero + ";\\n";

    nodoL.numero = numL;
    nodoActual = nodoL;
  }

  return nodoActual;
}

TIPO = tipo:("int" / "char" / "String") " " {
  let nodo = {};
  let tipoNodo = "T" + nextId();

  nodo.codigo = tipoNodo + " [label=\\"T\\"];\\n"
              + tipoNodo + " -> \\"" + tipo + "\\";\\n";

  nodo.numero = tipoNodo;
  return nodo;
}

ID_LIST = primer:ID resto:("," " " id:ID { return id; })* {
  return [primer, ...resto];
}

ID = id:[a-zA-Z][a-zA-Z0-9_]* {
  let nodo = {};
  let idNodo = "id" + nextId();
  let valor = text();
  let comaNodo = "comma" + nextId();

  nodo.codigo = idNodo + " [label=\\"id\\"];\\n"
              + idNodo + " -> \\"" + valor + "\\";\\n"
              + comaNodo + " [label=\\",\\"];\\n"
              + idNodo + " -> " + comaNodo + ";\\n";

  nodo.numero = idNodo;
  return nodo;
}

PCOMA = ";" {
   let nodo = {};
   let pcomaNodo = "semicolon" + nextId();

   nodo.codigo = pcomaNodo + " [label=\\";\\"];\\n";
   nodo.numero = pcomaNodo;
   return nodo;
}
`;
    this.parser = peggy.generate(grammar);
  }
  parse(expression: string): any {
    return this.parser.parse(expression);
  }
}
