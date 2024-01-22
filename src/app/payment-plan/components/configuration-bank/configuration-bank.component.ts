import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpDataService } from 'src/app/services/http-data.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-configuration-bank',
  templateUrl: './configuration-bank.component.html',
  styleUrls: ['./configuration-bank.component.css']
})
export class ConfigurationBankComponent {
  ConfigurationForm: FormGroup;
  data: any = [];
  errorMessage: string = '';
  id: any;

  constructor(private fb: FormBuilder, private router: Router, private api:HttpDataService, private route: ActivatedRoute) {
    this.ConfigurationForm = this.fb.group({
      tipoMoneda: ['', Validators.required],
      tasaInteres: ['', Validators.required],
      tipoTasaInteres: ['', Validators.required],
      periodoCapitalizacion: ['', Validators.required],
      costesNotariales: ['', Validators.required],
      costesRegistrales: ['', Validators.required],
      GPS: ['', Validators.required],
      portes: ['', Validators.required],
      gastosAdministracion: ['', Validators.required],
      frecuenciaTasaInteres: ['', Validators.required],
    });

    this.route.pathFromRoot[1].url.subscribe(
      url => {
        console.log('url: ', url);
        this.id = url[1].path;
        console.log('Bank id to edit:' + this.id);
        this.getConfiguration(this.id);
      }
    ); 
  }

  ngOnInit(){}

  getConfiguration(id: any){
    this.api.getFinancialEntityById(id).subscribe(
      response => {
        this.data = response;
        console.log("Data esta de aqui: ", this.data);
      }
    );
    console.log("Data 2: ", this.data);
  }

  getPeriodoCapitalizacionLabel(value: number): string {
    const labels: { [key: number]: string } = {
      1: 'Diario',
      15: 'Quincenal',
      30: 'Mensual',
      90: 'Trimestral',
      120: 'Cuatrimestral',
      180: 'Semestral',
      360: 'Anual'
    };
  
    return labels[value] || '';
  }
  
  getFrecuenciaTasaInteresLabel(value: number): string {
    const labels: { [key: number]: string } = {
      1: 'Diario',
      15: 'Quincenal',
      30: 'Mensual',
      90: 'Trimestral',
      120: 'Cuatrimestral',
      180: 'Semestral',
      360: 'Anual'
    };

    return labels[value] || '';
  }

  onSubmit(){
    this.errorMessage = '';
    if (this.ConfigurationForm.value.CostesNotariales < 0 || this.ConfigurationForm.value.CostesRegistrales < 0 ||
       this.ConfigurationForm.value.GPS == '' || this.ConfigurationForm.value.Portes < 0 ||
        this.ConfigurationForm.value.GastosAdministracion < 0 || this.ConfigurationForm.value.TasaInteres < 0) {
      this.errorMessage = 'Todos los valores ingresados deben ser positivos';
    }
    
    
    var periodoCapi = 0;
    if(this.errorMessage == ''){

      if(this.ConfigurationForm.value.periodoCapitalizacion != ""){
        periodoCapi = parseInt(this.ConfigurationForm.value.periodoCapitalizacion);
      }

      const newBank={
        tipoMoneda: this.ConfigurationForm.value.tipoMoneda,
        tasaInteres: parseInt(this.ConfigurationForm.value.tasaInteres),
        tipoTasaInteres: this.ConfigurationForm.value.tipoTasaInteres,
        periodoCapitalizacion: periodoCapi,
        costesNotariales: parseInt(this.ConfigurationForm.value.costesNotariales),
        costesRegistrales: parseInt(this.ConfigurationForm.value.costesRegistrales),
        GPS: parseInt(this.ConfigurationForm.value.GPS),
        portes: parseInt(this.ConfigurationForm.value.portes),
        gastosAdministracion: parseInt(this.ConfigurationForm.value.gastosAdministracion),
        frecuenciaTasaInteres: parseInt(this.ConfigurationForm.value.frecuenciaTasaInteres),
      }

      this.api.updateFinancialEntity(this.id, newBank).subscribe(
        data => {
          console.log('Respuesta del servidor: ', data);
          alert('La configuracion de la entidad bancaria se ha actualizado correctamente');
        },
        error => {
          console.log('Error al actualizar los ajustes: ', error);
          alert('Ha ocurrido un error al actualizar los datos de configuracion de la entidad bancaria, por favor inténtalo de nuevo más tarde');
        }
      )
    }
  }

}
