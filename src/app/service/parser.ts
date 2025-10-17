import { Injectable } from '@angular/core';
import * as peggy from 'peggy';

@Injectable({
  providedIn: 'root'
})
export class ParserServicio {

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

start = _ lista:L _ {
  return lista;
}

L = id1:ID _ coma:COMA _ resto:L {
  let nodo = {};
  let listaActual = "L" + nextId();

  nodo.codigo = id1.codigo
              + coma.codigo
              + resto.codigo
              + listaActual + " [label=\\"L\\"];\\n"
              + listaActual + " -> " + id1.numero + ";\\n"
              + listaActual + " -> " + resto.numero + ";\\n"
              + id1.numero + " -> " + coma.numero + ";\\n";

  nodo.numero = listaActual;
  return nodo;
}
/ id1:ID _ dospuntos:DOSPUNTOS _ tipo:TIPO {
  let nodo = {};
  let listaActual = "L" + nextId();

  nodo.codigo = id1.codigo
              + dospuntos.codigo
              + tipo.codigo
              + listaActual + " [label=\\"L\\"];\\n"
              + listaActual + " -> " + id1.numero + ";\\n"
              + listaActual + " -> " + tipo.numero + ";\\n"
              + id1.numero + " -> " + dospuntos.numero + ";\\n";

  nodo.numero = listaActual;
  return nodo;
}

ID = id:[a-zA-Z-Z0-9_]+ {
  let nodo = {};
  let idNodo = "id" + nextId();

  nodo.codigo = idNodo + " [label=\\"id\\"];\\n"
              + idNodo + " -> \\"" + text() + "\\";\\n";

  nodo.numero = idNodo;
  return nodo;
}

COMA = "," {
  let nodo = {};
  let comaNodo = "comma" + nextId();

  nodo.codigo = comaNodo + " [label=\\",\\"];\\n";

  nodo.numero = comaNodo;
  return nodo;
}

DOSPUNTOS = ":" {
   let nodo = {};
   let dospuntosNodo = "colon" + nextId();

   nodo.codigo = dospuntosNodo + " [label=\\":\\"];\\n";

   nodo.numero = dospuntosNodo;
   return nodo;
}

PCOMA = ";" {
   let nodo = {};
   let pcomaNodo = "semicolon" + nextId();

   nodo.codigo = pcomaNodo + " [label=\\";\\"];\\n";

   nodo.numero = pcomaNodo;
   return nodo;
}

TIPO = tipo:("int" / "char" / "String") _ pcoma:PCOMA {
  let nodo = {};
  let tipoNodo = "T" + nextId();

  nodo.codigo = tipoNodo + " [label=\\"T\\"];\\n"
              + tipoNodo + " -> \\"" + tipo + "\\";\\n"
              + pcoma.codigo
              + tipoNodo + " -> " + pcoma.numero + ";\\n";

  nodo.numero = tipoNodo;
  return nodo;
}

_ = [ \\t\\n\\r]*
`;

  this.parser = peggy.generate(grammar);
  }

  parse(expression: string): any {
    return this.parser.parse(expression);
  }


}
