import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Pagina } from './pagina/pagina';
import { LeftPage } from './left-page/left-page';
import { Pagina3 } from './pagina3/pagina3';

const routes: Routes = [
  {path:'', component: Pagina},
  {path:'left', component: LeftPage},
  {path:'final', component: Pagina3}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
