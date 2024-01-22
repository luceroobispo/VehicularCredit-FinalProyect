import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpDataService } from 'src/app/services/http-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  UserRegistrationForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private api:HttpDataService) { //falta el servicio
    this.UserRegistrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(){
    this.errorMessage = '';
    const formData = this.UserRegistrationForm.value;

    if(!formData.name || !formData.email || !formData.password){
      this.errorMessage = 'All fields are required';
    }

    if(this.errorMessage == ''){
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }
      console.log(userData);

      this.api.createFinancialEntity(userData).subscribe((res:any) => {
        console.log(res);
        if( res && res.id){
          this.router.navigate(['/login']);
        }
      });

      this.router.navigate(['/saved-plans']);
    }
     
  }

  cancelar(){
    this.router.navigate(['/login']);
  }

}
