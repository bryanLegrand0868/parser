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
  function nextId() { return ++counter; }
}

start
  = decl:declaration { return decl; }

declaration
  = ids:identList _ ":" _ t:type _ ";" {
      let nodo = {};
      nodo.numero = "nodo" + nextId();

      // crear nodos para ":" y ";"
      let dosp = "nodo" + nextId();
      let pcoma = "nodo" + nextId();

      nodo.codigo = ids.codigo + t.codigo
        + dosp + "[label = \\":\\"];"
        + pcoma + "[label = \\";\\"];"
        + nodo.numero + "[label = \\"S\\"];"
        + nodo.numero + "->" + ids.numero + ";"
        + nodo.numero + "->" + dosp + ";"
        + nodo.numero + "->" + t.numero + ";"
        + nodo.numero + "->" + pcoma + ";";

      return nodo;
    }

identList
  = head:identifier tail:(_ "," _ identifier)* {
      let nodo = {};
      nodo.numero = "nodo" + nextId();
      let idsCodigo = head.codigo;
      let idsNumeros = [head.numero];
      tail.forEach(x => {
        idsCodigo += x[3].codigo;
        idsNumeros.push(x[3].numero);
      });
      nodo.codigo = idsCodigo + nodo.numero + "[label = \\"L\\"];"
        + idsNumeros.map(n => nodo.numero + "->" + n + ";").join("");
      return { numero: nodo.numero, codigo: nodo.codigo };
    }
  / id:identifier {
      let nodo = {};
      nodo.numero = "nodo" + nextId();
      nodo.codigo = id.codigo + nodo.numero + "[label = \\"L\\"];"
        + nodo.numero + "->" + id.numero + ";";
      return { numero: nodo.numero, codigo: nodo.codigo };
    }

identifier
  = id:[a-zA-Z_][a-zA-Z0-9_]* {
      let nodo = {};
      nodo.numero = "nodo" + nextId();
      let hijo = "nodo" + nextId();
      nodo.codigo = nodo.numero + "[label = \\"I\\"];"
                  + hijo + "[label = \\"" + text() + "\\"];"
                  + nodo.numero + "->" + hijo + ";";
      return { numero: nodo.numero, codigo: nodo.codigo };
    }

type
  = t:("int" / "String" / "char") {
      let nodo = {};
      nodo.numero = "nodo" + nextId();
      let hijo = "nodo" + nextId();
      nodo.codigo = nodo.numero + "[label = \\"T\\"];"
                  + hijo + "[label = \\"" + t + "\\"];"
                  + nodo.numero + "->" + hijo + ";";
      return { numero: nodo.numero, codigo: nodo.codigo };
    }

_ = [ \\t\\n\\r]* // espacios opcionales
`;

  this.parser = peggy.generate(grammar);
  }

  parse(expression: string): any {
    return this.parser.parse(expression);
  }


}
