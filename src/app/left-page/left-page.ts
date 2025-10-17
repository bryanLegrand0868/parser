import { LeftPerser } from './../service/leftPerser';
import { Component, ViewChild, ElementRef} from '@angular/core';
import { graphviz } from 'd3-graphviz';

@Component({
  selector: 'app-left-page',
  standalone: false,
  templateUrl: './left-page.html',
  styleUrl: './left-page.css'
})
export class LeftPage {

  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;

  texto: string = "";

  LeftPerser: LeftPerser;

  constructor(LeftPerser: LeftPerser){
    this.LeftPerser = LeftPerser;
  }

  leftCompilar(){
    try{
      // ✅ PARSEAR EL TEXTO
      let nodo: any = this.LeftPerser.parse(this.texto);

      console.log("Nodo completo:", nodo);
      console.log("Código Graphviz:", nodo.codigo);
      console.log("Número nodo:", nodo.numero);

      const container = this.graphContainer.nativeElement;
      (graphviz as any)(container).renderDot('digraph { ' + nodo.codigo + ' }');

      alert("Son identificadores válidos");
    } catch(e: any){
      console.error("Error de parsing:", e);
      console.error("Mensaje:", e.message);
      console.error("Location:", e.location);
      alert("Error: " + e.message);
    }
  }
}
