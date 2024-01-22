import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpDataService } from 'src/app/services/http-data.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicular-credit',
  templateUrl: './vehicular-credit.component.html',
  styleUrls: ['./vehicular-credit.component.css']
})
export class VehicularCreditComponent {
  VehicularCreditForm: FormGroup;

  //Configuracion
  tipoMoneda: string = "";
  tasaInteres: number = 0;
  tipoTasaInteres: string = "";
  periodoCapitalizacion: number = 0;
  costesNotariales: number = 0;
  costesRegistrales: number = 0;
  GPS: number = 0;
  portes: number = 0;
  gastosAdministracion: number = 0;

  //Vehicular credit form
  clientDNI: number = 0;
  vehicleType: string = "";
  vehicleBrand: string = "";
  vehicleModel: string = "";
  vehicleYear: string = "";
  vehiclePrice:  number = 0;
  cuotaInicial: number = 0;
  cuotaFinal: number = 0;
  nDeCuotas: number = 0;
  frecuenciaDePago: number = 30;
  seguroDesgravamen: number = 0;
  seguroRiesgo: number = 0;
  periodosGraciaTotal: number = 0;
  periodosGraciaParcial: number = 0;
  tasaDescuento: number = 0;

  //Calculos Iniciales
  TEM: number = 0;
  nCuotasXAnio: number = 0;
  nTotalCuotas: number = 0;
  cuotaInicialPrecio: number = 0;
  cuotaFinalPrecio: number =0;
  prestamo: number =0;
  saldoFinanciar: number = 0;
  //Datos Globales
  NroDiasAnio = 360;
  bankId: string = '';
  bankIdAsNumber: any;
  errorMessage: string = '';

  constructor(private fb : FormBuilder, private http:HttpDataService, private router:Router, private route: ActivatedRoute){
    this.VehicularCreditForm = this.fb.group({
      clientDNI: ['', Validators.required],
      vehicleType: ['', Validators.required],
      vehicleBrand:['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleYear: ['', Validators.required],
      vehiclePrice: ['', Validators.required], 
      initialFee: ['', Validators.required], 
      cuoton:  ['', Validators.required], 
      nroCuotas: ['', Validators.required],
      segDesgravamen:['', Validators.required],
      segRiesgo: ['', Validators.required],
      graciaTotal: ['', Validators.required],
      graciaParcial: ['', Validators.required],
      tasaDescuento: ['', Validators.required],
    })

    this.route.pathFromRoot[1].url.subscribe(
      url => {
        this.bankId = url[1].path;
      }
    ); 
  }

  ngOnInit(){
    this.getConfigurationData();
  }

  getConfigurationData(){
    this.bankIdAsNumber = parseInt(this.bankId);
  
    this.http.getFinancialEntityById(this.bankIdAsNumber).subscribe((response:any) => {
      this.tipoMoneda = response.tipoMoneda;
      this.tasaInteres = parseFloat(response.tasaInteres)/100;
      this.tipoTasaInteres = response.tipoTasaInteres;
      this.periodoCapitalizacion = parseInt(response.periodoCapitalizacion);    
      this.costesNotariales = parseInt(response.costesNotariales);
      this.costesRegistrales = parseInt(response.costesRegistrales);
      this.GPS = parseInt(response.GPS);
      this.portes = parseInt(response.portes);
      this.gastosAdministracion = parseInt(response.gastosAdministracion);
    });
  }

  
  onSubmit(){
    const formData = this.VehicularCreditForm.value;

    console.log("Datos Iniciales de formulario -------------------------------------");
    this.clientDNI = formData.clientDNI;
    this.vehicleType = formData.vehicleType;
    this.vehicleBrand = formData.vehicleBrand;
    this.vehicleModel = formData.vehicleModel;
    this.vehicleYear = formData.vehicleYear;
    this.vehiclePrice = parseFloat(formData.vehiclePrice);
    this.cuotaInicial = parseFloat(formData.initialFee)/100;
    this.cuotaFinal = parseFloat(formData.cuoton)/100;
    this.nDeCuotas = parseInt(formData.nroCuotas); 
    this.seguroDesgravamen = parseFloat(formData.segDesgravamen)/100;;
    this.seguroRiesgo = parseFloat(formData.segRiesgo)/100;
    this.periodosGraciaTotal = parseInt(formData.graciaTotal);
    this.periodosGraciaParcial = parseInt(formData.graciaParcial);
    this.tasaDescuento = parseFloat(formData.tasaDescuento)/100;
  
    this.calculateCronogram(); //calculos

    const VehicularCredit = {
      clientDNI: this.clientDNI,
      vehicleType: this.vehicleType,
      vehicleBrand: this.vehicleBrand,
      vehicleModel: this.vehicleModel,
      vehicleYear: this.vehicleYear,
      vehiclePrice: this.vehiclePrice,
      cuotaInicial: this.cuotaInicial,
      cuotaFinal: this.cuotaFinal,
      nDeCuotas: this.nDeCuotas,
      frecuenciaDePago: this.frecuenciaDePago,
      seguroDesgravamen: this.seguroDesgravamen,
      seguroRiesgo: this.seguroRiesgo,
      periodosGraciaTotal: this.periodosGraciaTotal,
      periodosGraciaParcial: this.periodosGraciaParcial,
      tasaDescuento: this.tasaDescuento,
      TEM: this.TEM,
      montoPrestamo: this.prestamo,
      saldoFinanciar: this.saldoFinanciar,
      valorCuotaInicial: this.cuotaInicialPrecio,
      valorCuotaFinal: this.cuotaFinalPrecio,
      nCuotasXAnio: this.nCuotasXAnio,
      financialEntityId: this.bankIdAsNumber,
      GPS: this.GPS,
      portes: this.portes,
      costesNotariales: this.costesNotariales,
      costesRegistrales: this.costesRegistrales,
      gastosAdministracion: this.gastosAdministracion,
      tipoTasaInteres: this.tipoTasaInteres,
      tasaInteres: this.tasaInteres
    }

    // VALIDACIONES
    this.errorMessage = '';
    if(!formData.clientDNI || !formData.vehicleType || !formData.vehicleBrand ||
       !formData.vehicleModel || !formData.vehicleYear || !formData.vehiclePrice ||
        !formData.initialFee || !formData.cuoton || !formData.nroCuotas || !formData.segDesgravamen ||
         !formData.segRiesgo || !formData.graciaTotal || !formData.graciaParcial || !formData.tasaDescuento){
      this.errorMessage += 'Todos los campos son obligatorios';
      return;
    }
    

    if(formData.clientDNI.length < 8){
      this.errorMessage += 'El DNI debe tener 8 caracteres';
      return;
    }

    this.http.getClientByDNI(formData.clientDNI.length).subscribe((response:any) => {
      if(response.length == 0){
        this.errorMessage += 'El cliente no existe';
        return;
      }
    });

    if(formData.vehicleYear.length < 4){
      this.errorMessage += 'El año del vehículo debe tener 4 caracteres';
      return;
    }

    if(this.errorMessage === ''){
      console.log(VehicularCredit);
      this.http.createVehicularCredit(VehicularCredit).subscribe((response:any) => {
      console.log("Respuesta:", response);
      this.router.navigate(['/bank', this.bankId, 'saved-plans']);
    });
    }
  }

  calculateTEP(){ //cambiar, siempre es para TEM
    if(this.tipoTasaInteres == "efectiva"){//TEA
      return (1+ this.tasaInteres)**(this.frecuenciaDePago/this.NroDiasAnio)-1; //TEM
    }
    else{ //nominal
      let TEP = (1+(this.tasaInteres/(this.NroDiasAnio/this.periodoCapitalizacion)))**(this.NroDiasAnio/this.periodoCapitalizacion)-1;
      //convertir cualquier tasa efectiva a mensual
      let TEM = (1+TEP)**(30/(this.NroDiasAnio/this.periodoCapitalizacion))-1;
      return TEM;
    }
  }

  calculateCuotaInicial(){
    this.cuotaInicialPrecio = this.cuotaInicial * this.vehiclePrice; 
  }

  calculateCuotaFinal(){
    this.cuotaFinalPrecio = this.cuotaFinal * this.vehiclePrice;
  }

  calculatePrestamo(){
    this.prestamo = this.vehiclePrice - this.cuotaInicialPrecio + this.costesNotariales + this.costesRegistrales;
  }

  calculateSaldoFinanciarCuotas(){
    this.saldoFinanciar = this.prestamo - this.cuotaFinalPrecio / (1+ this.TEM + this.seguroDesgravamen) **(this.nDeCuotas+1);
  }
 
  calculateCronogram(){
    //Datos iniciales
    this.nCuotasXAnio = 12; //siempre es 12?
    this.TEM = this.calculateTEP();
    this.calculateCuotaInicial();
    this.calculateCuotaFinal();
    this.calculatePrestamo();
    this.calculateSaldoFinanciarCuotas();
  }
}
