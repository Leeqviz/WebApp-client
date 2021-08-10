import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProvidersService } from 'src/app/services/providers.service';
import { Pagination } from 'src/app/interfaces/pagination.interfaces';
import { Provider } from 'src/app/interfaces/providers.interfaces';
import { PaginationService } from 'src/app/services/pagination.service';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {

  public providers: Provider[] = [];
  /*
  public metaData: Pagination = {
    TotalPages: 0,
    TotalCount: 0,
    PageSize: 0,
    HasNext: false,
    HasPrevious: false,
    CurrentPage: 0
  };
  */
  public addForm: FormGroup = new FormGroup({});
  public updateForm: FormGroup = new FormGroup({});
  public deleteForm: FormGroup = new FormGroup({});

  public submitted = false;
  public message: string = '';

  public params = {
    SearchTerm: '',
    PageNumber: 1,
    PageSize: 4
  }

  constructor(
    private router: Router,
    private providersService: ProvidersService,
    private paginationService: PaginationService) { }

  ngOnInit(): void {
    this.paginationService.metaData.CurrentPage = 1;
    this.sendQuery();
    this.addForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
    this.updateForm = new FormGroup({
      oldname: new FormControl('', [Validators.required, Validators.minLength(4)]),
      updateid: new FormControl()
    });
    this.deleteForm = new FormGroup({
      deleteid: new FormControl()
    });
  }

  public sendQuery(): void {
    this.params.PageNumber = this.paginationService.metaData.CurrentPage;
    this.providersService.GetAllProviders(this.params).subscribe(data => {
      this.providers = data.body;
      this.paginationService.metaData = JSON.parse(data.headers.get('pagination'));
    });
  }

  public search(): void {
    this.params.SearchTerm = (<HTMLInputElement>document.getElementById('search')).value;
    this.sendQuery();
  }

  public putDataToUpdate(provider: Provider): void {
    this.updateForm.controls['oldname'].setValue(provider.Name);
    this.updateForm.controls['updateid'].setValue(provider.Id);
  }

  public putDataToDelete(provider: Provider): void {
    this.deleteForm.controls['deleteid'].setValue(provider.Id);
  }

  public updateItem(): void {
    if (this.updateForm.invalid) return;
    
    this.submitted = true;

    const provider: Provider = {
      Name: this.updateForm.value.oldname,
      Id: this.updateForm.value.updateid
    };
    this.providersService.UpdateProvider(provider).subscribe();
  }

  public deleteItem(): void {
    if (this.deleteForm.invalid) return;
    
    this.submitted = true;
    this.providersService.DeleteProvider( this.deleteForm.value.deleteid).subscribe();
  }

  public addItem(): void {
    if (this.addForm.invalid) return;
    
    this.submitted = true;

    const provider: Provider = {
      Name: this.addForm.value.name
    };

    this.providersService.AddProvider(provider).subscribe();
  }
  /*
  public leftPage(): void {
    if (this.params.PageNumber == 1) return;
    this.params.PageNumber--;
    this.sendQuery();
  }

  public rightPage(): void {
    this.params.PageNumber++;
    if (this.params.PageNumber <= this.metaData.TotalPages) this.sendQuery();
    else this.leftPage();
  }
  */
}
