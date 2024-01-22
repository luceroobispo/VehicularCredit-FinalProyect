import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpDataService } from 'src/app/services/http-data.service';
import { MatSort } from '@angular/material/sort'; 
import {MatDialog, MatDialogModule,MatDialogRef} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-saved-plans',
  templateUrl: './saved-plans.component.html',
  styleUrls: ['./saved-plans.component.css']
})
export class SavedPlansComponent {


  dataSource_savedPlans = new MatTableDataSource();
  displayedColumns: string[] = ['Id', 'Cliente', 'Vehiculo', 'Financiamiento', 'Acciones'];
  
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  bankId: string = '';
  savedPlanDeleted = false;
  constructor(private httpDataService: HttpDataService, private router: Router,
     private snackBar: MatSnackBar, public dialog: MatDialog, private route: ActivatedRoute)
  {

    this.route.pathFromRoot[1].url.subscribe(
      url => {
        console.log('url: ', url);
        this.bankId = url[1].path;
        console.log('Bank id: ' + this.bankId);
      }
    ); 
  }


  ngOnInit(): void {
    this.dataSource_savedPlans.paginator = this.paginator;
    this.dataSource_savedPlans.sort = this.sort;
    this.getAllSavedPlans(); 
  }
  
  openSnackBar(message: string) {
    this.snackBar.open(message, "Cerrar", {
      panelClass: ['color-snackbar-deleted'],
      duration: 5000, //5 segundos
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }


  /* IR A LA PAGINA CRONOGRAMA */
  getRow(row: { id: any; }){
    this.router.navigateByUrl(`bank/${this.bankId}/payment-schedule/${row.id}`);
  }

  //GET -----------------------------
  /* FALTA OBTENER EL NOMBRE, APELLIDO, EMAIL DEL CLIENTE
  getClientByDNI(){
    this.httpDataService.getClientByDNI().subscribe((res: any) => {
      console.log(res);

    });

  }
  */

  getAllSavedPlans(){
    this.httpDataService.getAllVehicularCreditsByCompanyId(this.bankId).subscribe((res: any) => {
      this.dataSource_savedPlans.data = res;
      this.dataSource_savedPlans.paginator = this.paginator;
    });
  }

  // DELETE -----------------------------
  deleteSavedPlan(id: any){
    this.httpDataService.deleteVehicularCredit(id).subscribe((res: any) => {
      this.savedPlanDeleted = true;
      this.openSnackBar(`Plan ${id} eliminado!`);
      this.getAllSavedPlans(); //actualiza la tabla
    })
  }
  
  openDialog(id: any){
    const dialogRef = this.dialog.open(DialogDeletePlan,{
      data: { nombre : this.savedPlanDeleted}
    });

    dialogRef.afterClosed().subscribe((result : any) => {
      console.log(`Dialog result: ${result}`);
      this.savedPlanDeleted = result;
      if(this.savedPlanDeleted){
        this.deleteSavedPlan(id);
      }
    });
  }
}

@Component({
  selector: 'dialog-delete-plan',
  templateUrl: './dialog-delete-plan/dialog-delete-plan.html',
  styleUrls: ['./dialog-delete-plan/dialog-delete-plan.css'],
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDialogModule]
})
export class DialogDeletePlan {
  constructor(public dialogRef: MatDialogRef<DialogDeletePlan>){}
  
  closeDialog(){
    this.dialogRef.close();
  }
}
