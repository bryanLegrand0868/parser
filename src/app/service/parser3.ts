import { Injectable } from '@angular/core';
import * as peggy from 'peggy';

@Injectable({
  providedIn: 'root',
})
export class Parser3 {
  private parser!: peggy.Parser;
  private variables: { [key: string]: number } = {};

  constructor() {
    this.compileGrammar();
  }

  private compileGrammar() {
    const grammar = `

{
  // Inicializador: se ejecuta una vez al generar el parser
  let counter = 0;
  let variables = options.variables || {};

  function nextId() {
    return ++counter;
  }
}

Programa = declaraciones:S+ {
    let r = {};
    r.nodo = "nodo" + nextId();

    // COMBINAR TODO EL CÓDIGO de todas las declaraciones
    let codigoCombinado = "";
    declaraciones.forEach(decl => {
        codigoCombinado += decl.codigo;
    });

    // CREAR el nodo raíz "Programa"
    codigoCombinado += r.nodo + '[label="Programa"];';

    // CONECTAR "Programa" a TODAS las declaraciones
    declaraciones.forEach(decl => {
        codigoCombinado += r.nodo + "->" + decl.nodo + ";";
    });

    r.codigo = codigoCombinado;
    r.valor = "Programa completo";
    return r;
}


S = _ "let" _ id:Identifier _ "=" _ expr:E ";" {
    variables[id.valor] = expr.valor;
    let r = {};
    r.nodo = "nodo"+nextId();
    let igual = "nodo"+nextId();
    r.codigo = expr.codigo + igual + "[label = igual];" + r.nodo + "[label = " + id.valor + "];" + r.nodo + "->" + igual + ";" + igual + "->" + expr.nodo + ";";
    r.valor = expr.valor;
    return r;
  }

E
  = a:T _ "+" _ b:E {
    let r = {};
    r.nodo = "nodo"+nextId();
    let s = "nodo"+nextId();
    r.codigo = a.codigo + b.codigo + s + "[label = mas];" + s + "->" + a.nodo + ";" + s + "->" + b.nodo + ";";
    r.valor = a.valor + b.valor;
    r.nodo = s;
    return r;
  }
  / a:T _ "-" _ b:E {
    let r = {};
    r.nodo = "nodo"+nextId();
    let s = "nodo"+nextId();
    r.codigo = a.codigo + b.codigo + s + "[label = menos];" + s + "->" + a.nodo + ";" + s + "->" + b.nodo + ";";
    r.valor = a.valor - b.valor;
    r.nodo = s;
    return r;
  }
  / a:T _ {
    return a;
  }


T
  = a:F _ "*" _ b:T {
    let r = {};
    r.nodo = "nodo"+nextId();
    let s = "nodo"+nextId();
    r.codigo = a.codigo + b.codigo + s + "[label = por];" + s + "->" + a.nodo + ";" + s + "->" + b.nodo + ";";
    r.valor = a.valor * b.valor;
    r.nodo = s;
    return r;
  }
  / a:F _ "/" _ b:T {
    let r = {};
    r.nodo = "nodo"+nextId();
    let s = "nodo"+nextId();
    r.codigo = a.codigo + b.codigo + s + "[label = div];" + s + "->" + a.nodo + ";" + s + "->" + b.nodo + ";";
    r.valor = a.valor / b.valor;
    r.nodo = s;
    return r;
  }
  / a:F _ {
    return a;
  }

F
  = "(" a:E ")" {
    return a;
  }
  / a:Number {
    return a;
    }
  / a:Identifier {
    let r = {};
    r.nodo = a.nodo;
    r.codigo = a.codigo;

    if (variables[a.valor] !== undefined) {
      r.valor = variables[a.valor];
    } else {
      r.valor = "indefinido";
    }

    return r;
  }

Identifier = [a-zA-Z_][a-zA-Z0-9_]* {
    let r = {};
    r.nodo = "nodo"+nextId();
    r.codigo = r.nodo + '[label ="' + text() + '"];';
    r.valor = text();
    return r;
  }

Number
  = a:Decimal {return a;}
  / a:Integer {return a;}

Decimal
  = int:[0-9]+ "." frac:[0-9]+ {
  let r = {};
    r.nodo = "nodo"+nextId();
    r.codigo = r.nodo + "[label ="+ int.join("") + "." + frac.join("")+"];";
    r.valor = parseFloat(int.join("") + "." + frac.join(""));
      return r;
    }

Integer
  = digits:[0-9]+ {
      let r = {};
    r.nodo = "nodo"+nextId();
    r.codigo = r.nodo + "[label ="+ digits.join("")+"];";
    r.valor = parseInt(digits.join(""), 10);
    return r;
    }
_ = [ \\t\\n\\r]*
    `;
    this.parser = peggy.generate(grammar);
  }
  parse(expression: string): any {
    const result = this.parser.parse(expression, {
      variables: this.variables,
      startRule: 'Programa',
    });
    return result;
  }

  getVariables(): { [key: string]: number } {
    return { ...this.variables };
  }

  clearVariables() {
    this.variables = {};
  }

  getVariablesList(): Array<{ name: string; value: number }> {
    return Object.entries(this.variables).map(([name, value]) => ({ name, value }));
  }
}
