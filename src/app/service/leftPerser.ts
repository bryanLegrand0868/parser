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
        return ++counter;
      }
    }


    L = t:T " " i:ID ";"{
      let nodo = {};
      nodo.numero = "nodo" + nextId();
      nodo.codigo = i.codigo + t.codigo + nodo.numero + "[label = L];\\n"
                  + nodo.numero + "->" + t.numero + ";\\n"
                  + nodo.numero + "->" + i.numero + ";\\n";
      return nodo;
    }

    ID = i:ID2 ", " l:ID{
      let nodo = {};
      nodo.numero = "nodo" + nextId();
      nodo.codigo = l.codigo + i.codigo + nodo.numero + "[label = L];\\n"
                + nodo.numero + "->" + i.numero + ";\\n"
                + nodo.numero + "->" + l.numero + ";\\n";
      return nodo;
    }

      / i:ID3{
      let nodo = {};
      nodo.numero = "nodo" + nextId();
      nodo.codigo = i.codigo + nodo.numero + "[label = L];\\n"
                + nodo.numero + "->" + i.numero + ";\\n";
      return nodo;
    }

      ID2 = [a-zA-Z-Z0-9_]*  {
      let nodo = {};
      nodo.numero = "nodo" + nextId();
      let identificador = "nodo" + nextId();
      let coma = "nodo" + nextId();
      nodo.codigo = nodo.numero + "[label = id];\\n"
                   + identificador + '[label = "' + text() + '"];\\n'
                   + nodo.numero + "->" + identificador + ";\\n"
                   + coma + "[label = \\",\\"];\\n"
                   + nodo.numero + "->" + coma + ";\\n";
      return nodo;
    }

    ID3 = [a-zA-Z-Z0-9_]* {
      let nodo = {};
      nodo.numero = "nodo" + nextId();
      let identificador = "nodo" + nextId();
      let pcoma = "nodo" + nextId();
      nodo.codigo = nodo.numero + "[label = id];\\n"
                   + identificador + '[label = "' + text() + '"];\\n'
                   + nodo.numero + "->" + identificador + ";\\n"
                   + pcoma + "[label = \\";\\"];\\n"
                   + nodo.numero + "->" + pcoma + ";\\n";
      return nodo;
    }

    T = "int"{
    let nodo = {};
    nodo.numero = "nodo" + nextId();
      let identificador = "nodo" + nextId();
      nodo.codigo = nodo.numero + "[label = T];\\n"
                   + identificador + '[label = "' + text() + '"];\\n'
                   + nodo.numero + "->" + identificador + ";\\n"
      return nodo;
    }

    / "char"{
    let nodo = {};
    nodo.numero = "nodo" + nextId();
      let identificador = "nodo" + nextId();
      nodo.codigo = nodo.numero + "[label = T];\\n"
                   + identificador + '[label = "' + text() + '"];\\n'
                   + nodo.numero + "->" + identificador + ";\\n"
      return nodo;
  }
      / "String"{
    let nodo = {};
    nodo.numero = "nodo" + nextId();
      let identificador = "nodo" + nextId();
      nodo.codigo = nodo.numero + "[label = T];\\n"
                   + identificador + '[label = "' + text() + '"];\\n'
                   + nodo.numero + "->" + identificador + ";\\n"
      return nodo;
  }
`;
    this.parser = peggy.generate(grammar);
  }
  parse(expression: string): any {
    return this.parser.parse(expression);
  }
}
