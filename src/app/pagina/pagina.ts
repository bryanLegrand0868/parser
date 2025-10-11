import { Component,ElementRef, ViewChild } from '@angular/core';
import { ParserServicio } from '../service/parser';
import * as d3 from 'd3';
import { graphviz } from 'd3-graphviz';

@Component({
  selector: 'app-pagina',
  standalone: false,
  templateUrl: './pagina.html',
  styleUrl: './pagina.css'
})
export class Pagina {

  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;

  texto:string="";

  parserServicio:ParserServicio

  constructor(parserServicio:ParserServicio){
    this.parserServicio = parserServicio;
  }

  compilar(){
    try{
      let nodo:any = this.parserServicio.parse(this.texto);
      console.log(nodo);
      console.log(nodo.codigo);
      console.log(nodo.numero);

  const container = this.graphContainer.nativeElement;
  // Use the exported graphviz function to ensure we use the correct instance
  (graphviz as any)(container).renderDot('digraph { ' + nodo.codigo + ' }');

      alert("Son identificadores");
    }
    catch(e:any){
      console.log(e);
      alert("No son identificadores");
    }
  }

}
