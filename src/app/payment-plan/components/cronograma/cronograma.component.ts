import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpDataService } from 'src/app/services/http-data.service';
import { Cupo } from 'src/app/models/Cupo.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import { MatPaginator } from '@angular/material/paginator'; 
import {MatDialog, MatDialogModule,MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css']
})
export class CronogramaComponent{

  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true }) 
  sort!: MatSort;

  displayedColumns: string[] = ['Periodo', 'P-G', 'SaldoInicialCuotaFinal', 'InteresCuotaFinal' , 'AmortCuotaFinal', 'SeguroDesgCuotaFinal' , 'SaldoFinalCuotaFinal'
   , 'SaldoInicialCuota', 'Interes', 'Cuota', 'Amortizacion',  'SeguroDesg', 'SeguroRiesg', 'GPS', 'Portes', 'GastosAdm', 'SaldoFinal', 'Flujo'];

  bankId: string = "";
  creditId: string = "";
  data: any = [];
  cupos: any = [];
  cashFlows: any = [];

  //Datos Iniciales de Financiamiento
  TEA: number = 0;
  seguroDesgravamenPer: number = 0;
  seguroRiesgoPer: number = 0;
  
  //Costes de operación
  GPS: number = 0;
  Portes: number = 0;
  GastosAdm: number = 0;
  costesNotariales: number = 0;
  costesRegistrales: number = 0;
  
  //Resultados de compra inteligente
  interesesTotales: number = 0;
  amortizacionCapitalTotal: number = 0;
  TIR: number = 0;
  TCEA: number = 0;
  segDesgTotal: number = 0;
  segRiesgoTotal: number = 0;
  gpsTotal: number = 0;
  portesTotal: number = 0;
  gastosAdmTotal: number = 0;
  VAN: number = 0;

  constructor(private service: HttpDataService, private router: Router, private route: ActivatedRoute, public dialog: MatDialog) { 
    this.route.params.subscribe(
      params => {
        this.creditId= params['id'];
      }
    );

    this.route.pathFromRoot[1].url.subscribe(
      url => {
        this.bankId = url[1].path;
      }
    );
  }
  
  dataSource : any ;

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.creditId = params['id'];
        this.route.pathFromRoot[1].url.subscribe(
          url => {
            this.bankId = url[1].path;
            this.getVehicularCreditInput();
          }
        );
      }
    );
  }
  
  getVehicularCreditInput() {
    this.service.getVehicularCreditById(this.creditId).subscribe(
      response => {
        this.data = response;
        console.log("Data esta de aqui: ", this.data);
        this.GPS = this.data.GPS;
        this.Portes = this.data.portes;
        this.GastosAdm = this.data.gastosAdministracion;
        this.costesNotariales = this.data.costesNotariales;
        this.costesRegistrales = this.data.costesRegistrales;
        

        this.calcSeguroDesgPer();
        this.calcSeguroRiesgoPer();
        this.calcCronograma();
        this.interesesTotales = this.calcInteresesTotales();
        this.amortizacionCapitalTotal = this.calcAmortizacionCapitalTotal();
        this.segDesgTotal = this.calcSeguroDesgTotal();
        this.VAN = this.calcularVAN();
        this.calcCompraInteligente();
            
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = this.cupos;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }
  
  getVehicularCredit(id: any){ //data
    this.service.getVehicularCreditById(id).subscribe(
      response => {
        this.data = response;
        console.log("Data esta de aqui: ", this.data);
      }
    );
    console.log("Data 2: ", this.data);
  }

  calcSeguroDesgPer(){
    //seguro desgravamen * frecuencia de pago / 30
    this.seguroDesgravamenPer = this.data.seguroDesgravamen * this.data.frecuenciaDePago / 30;
  }

  calcSeguroRiesgoPer(){
    //seguro riesgo * precio del vehiculo/ nro cuotas por anio
    this.seguroRiesgoPer = this.data.seguroRiesgo * this.data.vehiclePrice / this.data.nCuotasXAnio;
  }



  calcCronograma(){ //--------------------------------------------------------------------------
    this.cashFlows.push(this.data.vehiclePrice*(1-(this.data.cuotaInicial)));
    console.log("nro de cuotas: ", this.data.nDeCuotas);
    for (let index = 0; index <= this.data.nDeCuotas; index++) {

      var id = index+1; //arreglo comienza desde 0
      var PeriodoGracia: string = this.designarPeriodoGracia(index);

      // CALCULOS DE CRONOGRAMA DE LA CUOTA FINAL O CUOTON

      var SaldoInicialCuotaFinal: number = this.calcSaldoInicialCuotaFinal(index);
      var InteresCuotaFinal: number = this.calcInteresCuotaFinal(SaldoInicialCuotaFinal);
      var SeguroDesgravamenCuotaFinal: number = this.calcSeguroDesgravamenCuotaFinal(SaldoInicialCuotaFinal);
      var AmortizacionCuotaFinal: number = this.calcAmortizacionCuotaFinal(index, SaldoInicialCuotaFinal, InteresCuotaFinal, SeguroDesgravamenCuotaFinal);
      var SaldoFinalCuotaFinal: number = this.calcSaldoFinalCuotaFinal(SaldoInicialCuotaFinal, InteresCuotaFinal, AmortizacionCuotaFinal, SeguroDesgravamenCuotaFinal);

      // CALCULOS DE CRONOGRAMA DE LA CUOTA REGULAR
      var SaldoInicial: number = this.calcSaldoInicialCuota(index);
      var Interes: number = this.calcInteres(SaldoInicial);
      var SeguroDesg: number = this.calcSeguroDesg(SaldoInicial);
      var Cuota: number = this.calcCuota(index, PeriodoGracia, SaldoInicial, Interes, SeguroDesg);
      var Amortizacion: number = this.calcAmortizacion(index, PeriodoGracia, Cuota, Interes, SeguroDesg);

      // CALCULOS DE COSTES DE OPERACION DE CUOTA REGULAR
      var SeguroRies: number = this.calcSeguroRiesgo(index);
      var GPS: number = this.calcGPS(index);
      var Portes: number = this.calcPortes(index);
      var GastosAdm: number =this.calcGastosAdministrativos(index);
      var SaldoFinal: number = this.calcSaldoFinal(PeriodoGracia, SaldoInicial, Interes, SaldoFinalCuotaFinal, Amortizacion, index);
      var Flujo: number = this.calcFlujo(Cuota, SeguroDesg, SeguroRies, GPS, Portes, GastosAdm, PeriodoGracia, SeguroDesgravamenCuotaFinal, index, AmortizacionCuotaFinal);

      this.cashFlows.push(Flujo);

      const cupo = {
        id: id,
        PeriodoGracia: PeriodoGracia,
        SaldoInicial: SaldoInicial,
        Interes: Interes,
        Cuota: Cuota,
        Amortizacion: Amortizacion,
        SeguroDesg: SeguroDesg,
        SeguroRies: SeguroRies,

        GPS: GPS,
        Portes: Portes,
        GastosAdm: GastosAdm,
        
        SaldoFinal: SaldoFinal,
        Flujo: Flujo,

        SaldoInicialCuotaFinal: SaldoInicialCuotaFinal,
        InteresCuotaFinal: InteresCuotaFinal,
        AmortizacionCuotaFinal: AmortizacionCuotaFinal,
        SeguroDesgCuotaFinal: SeguroDesgravamenCuotaFinal,
        SaldoFinalCuotaFinal: SaldoFinalCuotaFinal
      }

      this.cupos.push(cupo);
    }
    this.TIR = this.calcTIR(this.cashFlows);
    this.TCEA = this.calcTCEA();  
  }

  designarPeriodoGracia(nroCuota: number){
    console.log("nroCuota+1: ", nroCuota+1, ", numero de cuota :", nroCuota)
    var periodoGracia: string = "";

    if(nroCuota+1 <= this.data.periodosGraciaTotal){
      periodoGracia = "T";
      return periodoGracia;
    }
    if(nroCuota+1-this.data.periodosGraciaTotal <= this.data.periodosGraciaParcial){
      periodoGracia = "P";
      return periodoGracia;
    }

    periodoGracia = "S";
    return periodoGracia;
    
  }

  // ------ CRONOGRAMA DE LA CUOTA FINAL O CUOTON ---------------------
  
  calcSaldoInicialCuotaFinal(nroCuota: number){
    //=SI(@NC=1;CF/(1+TEM+pSegDes)^(N+1);G31)
    var saldoInicialCuotaFinal: number = 0;
    if(nroCuota == 0){
      //CF/(1+TEM+pSegDes)^(N+1)
      saldoInicialCuotaFinal = (this.data.cuotaFinal*this.data.vehiclePrice)/ Math.pow(1+this.data.TEM+this.data.seguroDesgravamen, this.data.nDeCuotas+1);
    }
    else{
      //console.log("saldoFinalAnterior:", this.cupos[nroCuota-1].SaldoFinalCuotaFinal, ", nroCuota:", nroCuota)
      saldoInicialCuotaFinal = this.cupos[nroCuota-1].SaldoFinalCuotaFinal; //uno antes
    }
    
    return saldoInicialCuotaFinal;
  }

  calcInteresCuotaFinal(SaldoInicialCuotaFinal: number){
    //=-SaldoInicialCuotaFinal*TEM
    var interesCuotaFinal: number = 0;
    interesCuotaFinal = -1*SaldoInicialCuotaFinal*this.data.TEM;

    return interesCuotaFinal;
  }

  calcAmortizacionCuotaFinal(nroCuota: number, saldoInicialCuotaFinal: number, interesCuotaFinal: number, seguroDesgravamenCuotaFinal: number){
    var amortizacionCuotaFinal: number = 0;
    if(nroCuota == this.data.nDeCuotas){
      amortizacionCuotaFinal = (-1*saldoInicialCuotaFinal)/(1+this.data.TEM+this.data.seguroDesgravamen)**(this.data.nDeCuotas+1);
    }
    else{
      amortizacionCuotaFinal = 0;
    }
    
    return amortizacionCuotaFinal;
  }

  calcSeguroDesgravamenCuotaFinal(saldoInicialCuotaFinal: number){
    //=-@SICF*pSegDesPer
    var seguroDesgravamenCuotaFinal = -1*saldoInicialCuotaFinal*this.data.seguroDesgravamen;
    //seguroDesgravamenCuotaFinal = -1*saldoInicialCuotaFinal*this.data.segDesgravamen;
    return seguroDesgravamenCuotaFinal;
  }

  calcSaldoFinalCuotaFinal(saldoInicialCuotaFinal: number, interesCuotaFinal: number, amortizacionCuotaFinal: number, seguroDesgravamenCuotaFinal: number){
    //=@SICF-@ICF-@SegDesCF+@ACF
    var saldoFinalCuotaFinal: number = 0;
    saldoFinalCuotaFinal = saldoInicialCuotaFinal - interesCuotaFinal - seguroDesgravamenCuotaFinal + amortizacionCuotaFinal;
    return saldoFinalCuotaFinal;
  }

  // -------- CRONOGRAMA DE LA CUOTA REGULAR ---------------------

  calcSaldoInicialCuota(nroCuota: number){
    //=SI(@NC=1;Saldo;SI(@NC<=N;Q32;0))
    var saldoInicialCuota: number = 0;
    if(nroCuota == 0){
      saldoInicialCuota = this.data.saldoFinanciar;
    }
    else if(nroCuota < this.data.nDeCuotas){
      //console.log("saldoFinalAnterior:", this.cupos[nroCuota-1].SaldoFinal, ", nroCuota:", nroCuota)
      saldoInicialCuota = this.cupos[nroCuota-1].SaldoFinal;
    }
    else{
      saldoInicialCuota = 0;
    }
    return saldoInicialCuota;
  }

  calcInteres(saldoInicialCuota: number){
    //-saldo inicial * TEM
    return (-1*saldoInicialCuota) * this.data.TEM;
  }

  calcCuota(nroCuota: number, periodoGracia: string, saldoInicialCuota: number, interes: number, segDesgravamenValor : number){
    if(nroCuota <= this.data.nDeCuotas){
      //console.log("nroCuota: ", nroCuota, ", periodoGracia: ", periodoGracia, ", saldoInicialCuota: ", saldoInicialCuota, ", interes: ", interes)
      if(periodoGracia == "T"){
        return 0;
      }
      if(periodoGracia == "P"){
        return interes;
      }
      if(nroCuota < this.data.nDeCuotas){
        //console.log("Cuota:", saldoInicialCuota ," * ",  (this.data.TEM+this.data.seguroDesgravamen), "  /  ", (1-(1+(this.data.TEM+this.data.seguroDesgravamen))**(-1*(this.data.nDeCuotas-nroCuota))) );
        return (-1*saldoInicialCuota)*(this.data.TEM + this.data.seguroDesgravamen)/(1-(1+(this.data.TEM+this.data.seguroDesgravamen))**(-1*(this.data.nDeCuotas-nroCuota)) );
      }
    }
    return 0
  }

  calcAmortizacion(nroCuota: number, periodoGracia: string, cuota:number, interes: number, seguroDesgravamen: number){
    if(nroCuota < this.data.nDeCuotas){
      if(periodoGracia == "T" || periodoGracia == "P"){
        return 0;
      }
      else{
        //console.log("Amortizacion: ", cuota, " - ", interes, " - ", seguroDesgravamen,"|| nroCuota: ", nroCuota);
        return cuota-interes-seguroDesgravamen;
      }
    }
    else{ //cuota, amortización, saldoFinal, Flujo
      return 0;
    }
  }

  calcSeguroDesg(saldoInicialCuota: number){
    return -1*saldoInicialCuota*this.data.seguroDesgravamen;
  }

  calcSeguroRiesgo(nroCuota: number){
    if(nroCuota <= this.data.nDeCuotas + 1){
      return -1*this.seguroRiesgoPer;
    }
    else{
      return 0;
    }
  }

  calcSaldoFinal(periodoGracia: string, saldoInicialCuota: number, interes: number, saldoFinalCuotaFinal: number, amortizacion: number, nroCuota: number){
    if(periodoGracia == "T"){
      return saldoInicialCuota-interes;
    }
    if(nroCuota == this.data.nDeCuotas-1){
      return 0;
    }
    //console.log("Saldo Final: ", saldoInicialCuota, " - ", interes, " - ", saldoFinalCuotaFinal, " + ", amortizacion)
    return saldoInicialCuota+amortizacion;
  }

  calcFlujo(cuota: number,seguroDesgravamen: number, seguroRiesgo: number, GPS: number, Portes: number, GastosAdm: number, periodoGracia: string, seguroDesgravamenCuotaFinal: number, nroCuota: number, amortizacionCuotaFinal: number){
    //console.log("Flujo: ", cuota, " + seguroRies ", seguroRiesgo, " + GPS ", GPS, " + Portes", Portes, " + Gastos", GastosAdm, " || Periodo:", nroCuota)
    var Flujo = cuota + seguroRiesgo + GPS + Portes + GastosAdm;

    if(periodoGracia == "T" || periodoGracia == "P"){ //cuotas de gracia
      return Flujo + seguroDesgravamen;
    }
    if(nroCuota == this.data.nDeCuotas){ //ultima cuota
      return Flujo+amortizacionCuotaFinal;
    }
    return Flujo;
  }

  calcGPS(nroCuota: number){
    //suma del GPS de todas las cuotas
    if(nroCuota<=this.data.nDeCuotas+1){
      return -1*this.GPS;
    }
    else {
      //if(nroCuota<5)console.log("GPS: ", 0);
      return 0;
    }
  }

  calcPortes(nroCuota: number){
    if(nroCuota<=this.data.nDeCuotas+1){
      return -1*this.Portes;
    }
    else {
      return 0;
    }
  }

  calcGastosAdministrativos(nroCuota: number){
    if(nroCuota<=this.data.nDeCuotas+1){
      return -1*this.GastosAdm;
    }
    else {
      return 0;
    }
  }

  /*INDICADORES DE RENTABILIDAD ----------------------  */

  calculateNPV(rate: number, cashFlows: number[]): number {
    let npv = 0;

    for (let i = 0; i < cashFlows.length; i++) {
        npv += cashFlows[i] / Math.pow(1 + rate, i);
    }

    return npv;
  }
  
  calculateDerivative(rate: number, cashFlows: number[]): number {
    let derivative = 0;

    for (let i = 1; i < cashFlows.length; i++) {
        derivative -= i * cashFlows[i] / Math.pow(1 + rate, i + 1);
    }

    return derivative;
  }
  
  calculateIRR(cashFlows: number[], initialGuess: number, maxIterations: number = 350, tolerance: number = 0.1): number{
    let tir = initialGuess;
    let iteration = 0;
    
    while (iteration < maxIterations) {
        const npv = this.calculateNPV(tir, cashFlows);
        const derivative = this.calculateDerivative(tir, cashFlows);

        tir = tir - npv / derivative;

        if (Math.abs(npv) < tolerance) {
            return tir;
        }

        iteration++;
    }
  
    // No convergence within the specified iterations
    return 0;
  }

  calcTIR(cashFlows : number[]){
    const tolerance = 0.0001; // Tolerancia para la precisión de la aproximación
    let lowerBound = -1.0;
    let upperBound = 1.0;
    let guess = (lowerBound + upperBound) / 2;

    let irr = 0;

    for (let i = 0; i < 500; i++) { // Número máximo de iteraciones (ajusta según sea necesario)
      let npv = 0;

      for (let j = 0; j < cashFlows.length; j++) {
        npv += cashFlows[j] / Math.pow(1 + guess, j);
      }

      //console.log("npv: ", npv);
      if (Math.abs(npv) < tolerance) { //lowerBound - upperBound
        irr = guess;
        break;
      } else if (npv > 0) {
        upperBound = guess;
      } else {
        lowerBound = guess;
      }

      guess = (lowerBound + upperBound) / 2;
      //console.log("guess: ", guess);
    }

    return irr*100;
  }

  calcTCEA(){
    var TCEA = ((1+this.TIR/100)**12)-1;
    return TCEA;
  }


  calcularVAN(): number {
    let van = 0;
    let tasaDescuentoMensual: number;
    tasaDescuentoMensual = Math.pow(1 + this.data.tasaDescuento, 1 / 12) - 1;

    for (let i = 0; i < this.cupos.length; i++) {
        van += this.cupos[i].Flujo / Math.pow(1 + tasaDescuentoMensual, i + 1);
    }
    var MontoPrestamo = this.data.vehiclePrice*(1-this.data.cuotaInicial);
    van += MontoPrestamo;
    console.log("VAN 2: ", van)
    return van;
  }

  /* CALCULO DE RESULTADOS DE COMPRA INTELIGENTE */
  calcInteresesTotales(){
    var CuotaSuma = 0;
    var AmortizacionSuma = 0;
    var SeguroDesgSuma = 0;

    for(let index = 0; index<=this.data.nDeCuotas; index++){
      CuotaSuma += this.cupos[index].Cuota;
      AmortizacionSuma += this.cupos[index].Amortizacion;
      SeguroDesgSuma += this.cupos[index].SeguroDesg;
    }
    return -1*(CuotaSuma - AmortizacionSuma - SeguroDesgSuma);
  }

  calcAmortizacionCapitalTotal(){
    var AmortizacionSuma = 0;
    var AmortizacionCuotaFinalSuma = 0;

    for(let index = 0; index<=this.data.nDeCuotas; index++){
      AmortizacionSuma += this.cupos[index].Amortizacion;
      AmortizacionCuotaFinalSuma += this.cupos[index].AmortizacionCuotaFinal;
    }

    return -1*(AmortizacionSuma)-AmortizacionCuotaFinalSuma;
    
  }

  calcSeguroDesgTotal(){
    var SeguroDesgSuma = 0;
    for(let index = 0; index<=this.data.nDeCuotas; index++){
      SeguroDesgSuma += this.cupos[index].SeguroDesg;
    }

    return -1*SeguroDesgSuma;
  }

  calcCompraInteligente(){
    this.segRiesgoTotal = -1*(this.cupos[1].SeguroRies*(this.data.nDeCuotas+1));
    this.gpsTotal = -1*(this.cupos[1].GPS*(this.data.nDeCuotas+1));
    this.portesTotal = -1*(this.cupos[1].Portes*(this.data.nDeCuotas+1));
    this.gastosAdmTotal = -1*(this.cupos[1].GastosAdm*(this.data.nDeCuotas+1));
  }

  tipoDialogo: string = "";



  // BOTONES DE COMPRA INTELIGENTE

  openDialog(action: string){
    const dialogRef = this.dialog.open(ProximoDialogo,{
      data: { action: action},
    });

    dialogRef.afterClosed().subscribe((result : any) => { });
  }
}


import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'proximoDialog',
  templateUrl: './proximoDialog/proximoDialog.html',
  styleUrls: ['./proximoDialog/proximoDialog.css'],
  standalone: true,
  imports: [MatIconModule,  CommonModule, MatButtonModule, MatDialogModule]
})
export class ProximoDialogo {
  action: string = "";
  constructor(public dialogRef: MatDialogRef<ProximoDialogo>, @Inject(MAT_DIALOG_DATA) public data: any) {
    
  }

  ngOnInit(): void {
    this.action = this.data.action;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}