import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Client } from '../models/client.model';
import { FinancialEntity } from '../models/FinancialEntity.model';
import { VehicularCredit } from '../models/VehicularCredit.model';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {
  base_url = environment.baseURL;

  constructor( private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`Ocurrió un error: ${error.status}, el cuerpo fue: ${error.error}`);
    }
    else {
      console.log(`El servidor respondió con el código ${error.status}, el cuerpo fue: ${error.error}`);
    }
    return throwError('Ha ocurrido un problema con la solicitud, por favor inténtalo de nuevo más tarde');
  }

  //Create
  createFinancialEntity(data: any): Observable<FinancialEntity> {
    return this.http.post<FinancialEntity>(`${this.base_url}/financial-entities`, JSON.stringify(data), this.httpOptions);
  }

  createClient(data: any): Observable<Client> {
    return this.http.post<Client>(`${this.base_url}/clients`, JSON.stringify(data), this.httpOptions);
  }

  createVehicularCredit(data: any): Observable<VehicularCredit> {
    return this.http.post<VehicularCredit>(`${this.base_url}/vehicular-credits`, JSON.stringify(data), this.httpOptions);
  }

  //Read
  getAllClientsByCompanyId(id: any): Observable<Client> {
    return this.http.get<Client>(`${this.base_url}/clients?bankId=${id}`).pipe(retry(2), catchError(this.handleError));
  }

  getAllFinancialEntities(): Observable<FinancialEntity> {
    return this.http.get<FinancialEntity>(`${this.base_url}/financial-entities`).pipe(retry(2), catchError(this.handleError));
  }

  getFinancialEntityById(id: any): Observable<FinancialEntity> {
    return this.http.get<FinancialEntity>(`${this.base_url}/financial-entities/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  getFinancialEntitiesForLogin(email:string, password:string): Observable<any> {
    return this.http.get<any>(`${this.base_url}/financial-entities?email=${email}&password=${password}`)
    .pipe(retry(2), catchError(this.handleError));
  }

  getAllVehicularCreditsByCompanyId(id: any): Observable<VehicularCredit> {
    return this.http.get<VehicularCredit>(`${this.base_url}/vehicular-credits?financialEntityId=${id}`).pipe(retry(2), catchError(this.handleError));
  }

  getClientByDNI(dni: any): Observable<Client> {
    return this.http.get<Client>(`${this.base_url}/clients?dni=${dni}`).pipe(retry(2), catchError(this.handleError));
  }

  getVehicularCreditById(id: any): Observable<VehicularCredit> {
    return this.http.get<VehicularCredit>(`${this.base_url}/vehicular-credits/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  //Update
  updateClient(id: any, item:any): Observable<Client> {
    return this.http.patch<Client>(`${this.base_url}/clients/${id}`, JSON.stringify(item), this.httpOptions);
  }

  updateFinancialEntity(id: number, item:any): Observable<FinancialEntity> { //for configuration-bank
    return this.http.patch<FinancialEntity>(`${this.base_url}/financial-entities/${id}`, JSON.stringify(item), this.httpOptions);
  }

  updateVehicularCredit(id: number, item:any): Observable<VehicularCredit> {
    return this.http.patch<VehicularCredit>(`${this.base_url}/vehicular-credits/${id}`, JSON.stringify(item), this.httpOptions);
  }

  //Delete
  deleteFinancialEntity(id: number): Observable<FinancialEntity> {
    return this.http.delete<FinancialEntity>(`${this.base_url}/financial-entities/${id}`, this.httpOptions);
  }

  deleteClient(id: number): Observable<Client> {
    return this.http.delete<Client>(`${this.base_url}/clients/${id}`, this.httpOptions);
  }

  deleteVehicularCredit(id: number): Observable<VehicularCredit> {
    return this.http.delete<VehicularCredit>(`${this.base_url}/vehicular-credits/${id}`, this.httpOptions);
  }


}
