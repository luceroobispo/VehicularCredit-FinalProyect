import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpDataService } from 'src/app/services/http-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  UserLoginForm: FormGroup;
  errorMessage: string = '';
  emailVerify: string = '';
  passwordVerify: string = '';

  constructor(private fb: FormBuilder, private router: Router, private api:HttpDataService) { //falta el servicio
    this.UserLoginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(){
    this.errorMessage = '';
    const formData = this.UserLoginForm.value;

    if(!formData.email || !formData.password){
      this.errorMessage = 'All fields are required';
    }

    if(this.errorMessage == ''){
      this.emailVerify = this.UserLoginForm.value.email;
      this.passwordVerify = this.UserLoginForm.value.password;

      this.api.getFinancialEntitiesForLogin(this.emailVerify, this.passwordVerify).subscribe((data:any) => {
        if(data && data.length > 0){
          this.router.navigate(['bank/'+ data[0].id +'/saved-plans']);//, data[0].id
        }
      });
      
    }

    this.router.navigate(['/saved-plans']);
     
  }

  registrarForm(){
    this.router.navigate(['/register']);
  }

}
