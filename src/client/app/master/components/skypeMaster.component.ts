import { Component } from '@angular/core';
import { OnActivate, ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TOOLTIP_DIRECTIVES } from 'ng2-bootstrap';
import {   SkypeMaster, MyMasterDataService} from '../index';
import { ResponseFromAPI} from '../../shared/model/index';
import { APIResult } from '../../shared/constantValue/index';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SkypeMasterFilterPipe } from  '../filter/SkypeMasterFilter.pipe';
@Component({
    moduleId: module.id,
    selector: 'skype-master',
    templateUrl: 'skypeMaster.component.html',
    directives: [ROUTER_DIRECTIVES, TOOLTIP_DIRECTIVES],
    pipes: [SkypeMasterFilterPipe]
})
// @Directive({
//     selector: '[autofocus]'
// }) 

export class SkypeMasterComponent implements OnActivate, AfterViewInit{
    errorMessage: string;
    skypeData: Array<SkypeMaster> = new Array<SkypeMaster>();
    data:SkypeMaster = new SkypeMaster();
    ShowTable =false;
    // editData:SkypeMaster = new SkypeMaster();
    Action:string='Add';
    constructor(private _MyMasterDataService: MyMasterDataService,
        private toastr: ToastsManager,
        private _router: Router,private elementRef: ElementRef) {
    }
    @ViewChild('focus') firstNameElement: ElementRef;
    ngAfterViewInit() {
        this.firstNameElement.nativeElement.focus();
    }
    routerOnActivate() {
        this.getSkypeData();
        this.Action='Add';
    }
    /** GET SKYPE CREDENTIALS FOR THE INTERVIEWERS */
    getSkypeData() {
        this._MyMasterDataService.getSkypeData()
            .subscribe(
            (results: any) => {
                if (results !== null && results.length > 0) {
                    this.skypeData = results;
                    this.ShowTable = true;
                    this.ngAfterViewInit();
                } else {
                    this.ShowTable = false;
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
    }
    OnCancel(){
        this.Action = 'Add';
        this.data=new SkypeMaster();
        this.getSkypeData();
    }
    EditData(skydata:any) {
       this.data=skydata;
        this.Action = 'Update';
    }
    AddEditData() {
        if (this.Action === 'Add') {
            this.AddSkypeData();
        } else if (this.Action === 'Update') {
           this.EditSkypeData();
        }
    }
    EditSkypeData() {
      var checkData=this.data.Value.trim();
      var checkPassword=this.data.Value.trim();
      if(checkData !== "" && checkPassword !== "") {
            this._MyMasterDataService.editSkypeData(this.data)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this.OnCancel();
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
            } else {
            this.toastr.error('Please Fill Data.');
        }
    }
    AddSkypeData(){
        var checkData=this.data.Value.trim();
        var checkPassword=this.data.Value.trim();
        if(checkData !== "" && checkPassword !== "") {
            this._MyMasterDataService.addSkypeData(this.data)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this.data.Value='';
                    this.data.Password='';this.OnCancel();
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
        } else {
            this.toastr.error('Please Fill Data.');
        }
    }

    deleteData(skyDelData:any) {
    var deleteData = confirm('Are you sure you want to delete it?');
    if (deleteData === true) {
       this._MyMasterDataService.deleteSkypeData(skyDelData)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this.OnCancel();
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
        } else {
            alert('Deletion Process Is Cancelled.');
        }
    }

}


