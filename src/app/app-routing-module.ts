import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Pagina } from './pagina/pagina';
import { LeftPage } from './left-page/left-page';

const routes: Routes = [
  {path:'', component: Pagina},
  {path:'left', component: LeftPage}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
