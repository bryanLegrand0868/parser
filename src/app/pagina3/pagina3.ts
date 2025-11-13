import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import 'd3-graphviz';
import { Parser3 } from '../service/parser3';
import { graphviz } from 'd3-graphviz';
@Component({
  selector: 'app-pagina3',
  standalone: false,
  templateUrl: './pagina3.html',
  styleUrl: './pagina3.css',
})
export class Pagina3 implements AfterViewInit {
  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;


  expression = '';
  resultado: any = {};
  variables: Array<{name: string, value: number}> = [];

  constructor(private parser3: Parser3) {}

  ngAfterViewInit() {}

  calcular() {
    try {
      this.resultado = this.parser3.parse(this.expression);
      this.variables = this.parser3.getVariablesList();

      console.log('Resultado: ', this.resultado);
      console.log('Variables: ',this.variables);

      const grafo = this.graphContainer.nativeElement;
      (graphviz as any)(grafo).renderDot('digraph { ' + this.resultado.codigo + ' }');
    } catch (e) {
      alert('Error en el análisis: ' + e);
      console.log(e);
    }
  }

  limpiarVariables() {
    this.parser3.clearVariables();
    this.variables = [];
    this.resultado = {};
  }
}
