import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user-management/components/login/login.component';
import { RegisterComponent } from './user-management/components/register/register.component';
import { ClientComponent } from './payment-plan/components/client/client.component';
import { SavedPlansComponent } from './payment-plan/components/saved-plans/saved-plans.component';
import { VehicularCreditComponent } from './payment-plan/components/vehicular-credit/vehicular-credit.component';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { ConfigurationBankComponent } from './payment-plan/components/configuration-bank/configuration-bank.component';
import { CronogramaComponent } from './payment-plan/components/cronograma/cronograma.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}, 
    
  {
    path: 'bank/:id', component: ToolbarComponent,
    children: [ // '/'
      {path: 'clients', component: ClientComponent},
      {path: 'saved-plans', component: SavedPlansComponent},
      {path: 'vehicular-credit', component: VehicularCreditComponent},
      {path: 'configuration', component: ConfigurationBankComponent},
      {path: 'payment-schedule/:id', component: CronogramaComponent}
    ]
    
  },

  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
