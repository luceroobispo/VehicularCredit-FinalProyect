import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from '../shared/material.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { LoginComponent } from './user-management/components/login/login.component';
import { RegisterComponent } from './user-management/components/register/register.component';
import { ClientComponent } from './payment-plan/components/client/client.component';
import { VehicularCreditComponent } from './payment-plan/components/vehicular-credit/vehicular-credit.component';
import { SavedPlansComponent } from './payment-plan/components/saved-plans/saved-plans.component';
import { ConfigurationBankComponent } from './payment-plan/components/configuration-bank/configuration-bank.component';
import { CronogramaComponent } from './payment-plan/components/cronograma/cronograma.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LoginComponent,
    RegisterComponent,
    ClientComponent,
    VehicularCreditComponent,
    SavedPlansComponent,
    ConfigurationBankComponent,
    CronogramaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
