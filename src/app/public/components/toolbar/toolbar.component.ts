import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit  {
  bankId: string = '';

  constructor(private router: Router, private route: ActivatedRoute) { 
    this.route.params.subscribe(params => {
      this.bankId = params['id'];
      console.log('Bank id:' + this.bankId);
    });
  }

  ngOnInit(): void {}

  pageVehicularCredit(){
    this.router.navigate([`bank/${this.bankId}/vehicular-credit`]);
  }
  pageSavedPlans(){
    this.router.navigate([`bank/${this.bankId}/saved-plans`]);
  }
  pageClient(){
    this.router.navigate([`bank/${this.bankId}/clients`]);
  }
  pageLogin(){
    this.router.navigate(['/login']);
  }
  pageConfiguration(){
    this.router.navigate([`bank/${this.bankId}/configuration`]);
  }
}
