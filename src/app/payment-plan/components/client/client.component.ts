import { Component, ViewChild , Inject} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpDataService } from 'src/app/services/http-data.service';
import { MatSort } from '@angular/material/sort'; 
import {MatDialog, MatDialogModule,MatDialogRef} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from 'src/app/models/client.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {
  
  dataSource_clients = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'lastName', 'dni', 'email', 'actions'];

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  isEditMode = false;

  clientForm: FormGroup;
  tempClient!: Client;
  idClient: any;
  errorMessage: string = '';

  @ViewChild(MatSort) sort!: MatSort;

  clientDeleted = false;
  bankId: string = '';

  constructor(private formBuilder: FormBuilder, private httpDataService: HttpDataService, private router: Router, private snackBar: MatSnackBar,
     public dialog: MatDialog, private route: ActivatedRoute) {
    this.clientForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', Validators.required],
      //idFinancialEntity: ['', Validators.required]
    });

      this.tempClient = {} as Client;

      this.route.pathFromRoot[1].url.subscribe(
        url => {
          console.log('url: ', url);
          this.bankId = url[1].path;
          console.log('Bank id: ' + this.bankId);
        }
      ); 
   }

  ngOnInit(): void {
    this.dataSource_clients.paginator = this.paginator;
    this.dataSource_clients.sort = this.sort;
    this.getAllClients(); 
  }

  cancelEdit(){
    this.isEditMode = false;
    this.clientForm.reset();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Cerrar", {
      panelClass: ['color-snackbar-deleted'],
      duration: 5000, //5 segundos
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  editClient(element: Client){
    this.isEditMode = true;
    this.idClient = element.id;
  }

  onSubmit(){
    this.errorMessage = '';
    const formData = this.clientForm.value;
    if(!formData.name || !formData.lastName || !formData.dni || !formData.email){
      this.errorMessage += 'Todos los campos son obligatorios';
      return;
    }

    if(formData.dni.length < 8){
      this.errorMessage += 'El DNI debe tener 8 caracteres';
      return;
    }


    if(this.errorMessage==''){
      this.tempClient = this.clientForm.value;
      this.tempClient.bankId = this.bankId;
      if(this.isEditMode){
        this.updateClient();
      }
      else{
        this.addClient();
      }
      this.cancelEdit();
    }
    else{
      console.log('validar información del formulario');
    }
  }

  //GET -----------------------------
  getAllClients() {
    this.httpDataService.getAllClientsByCompanyId(this.bankId).subscribe((res: any) => {
      this.dataSource_clients.data = res;
      this.dataSource_clients.paginator = this.paginator;
    });
  }

  //EDIT -----------------------------
  updateClient(){
    this.httpDataService.updateClient(this.idClient, this.tempClient).subscribe((response: any) => {
      this.dataSource_clients.data = this.dataSource_clients.data.map((o: any) => {
        if(o.id === response.id){
          o = response;
        }
        return o;
      })
      this.openSnackBar(`Cliente ${response.id} actualizado!`);
    })
  }
  
  //ADD -----------------------------

  addClient(){
    this.httpDataService.createClient(this.tempClient).subscribe((res: any) => {
      this.dataSource_clients.data.push(res);
      this.dataSource_clients.data = this.dataSource_clients.data.map((o: any) => {
        return o;
      });
      this.dataSource_clients.paginator = this.paginator;
      this.openSnackBar(`Cliente ${res.id} creado!`);
    })
  }

  // DELETE -----------------------------

  deleteClient(id: any){
    this.httpDataService.deleteClient(id).subscribe((res: any) => {
      this.clientDeleted = true;
      this.openSnackBar(`Cliente ${id} eliminado!`);
      this.getAllClients(); //actualiza la tabla
      
    })
  }
  
  openDialog(id: any){
    const dialogRef = this.dialog.open(DialogDelete,{
      data: { nombre : this.clientDeleted}
    });

    dialogRef.afterClosed().subscribe((result : any) => {
      console.log(`Dialog result: ${result}`);
      this.clientDeleted = result;
      if(this.clientDeleted){
        this.deleteClient(id);
      }
    });
  }
}

@Component({
  selector: 'dialog-delete',
  templateUrl: './dialog-delete/dialog-delete.html',
  styleUrls: ['./dialog-delete/dialog-delete.css'],
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDialogModule]
})
export class DialogDelete {
  constructor(public dialogRef: MatDialogRef<DialogDelete>) {}

  closeDialog(){
    this.dialogRef.close();
  }
}