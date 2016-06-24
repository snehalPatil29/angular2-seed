import {Component} from '@angular/core';
import { OnActivate, ROUTER_DIRECTIVES } from '@angular/router';
import { RRFDashboardService } from '../services/rrfDashboard.service';
import { RRFDetails, AllRRFStatusCount  } from '../../myRRF/models/rrfDetails';
import { MyRRFService } from '../../myRRF/services/myRRF.service';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {RRFIDPipe } from './RRFIdFilter.component';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { APIResult } from  '../../../shared/constantValue/index';
import { ResponseFromAPI } from '../../../shared/model/common.model';

@Component({
    moduleId: module.id,
    selector: 'rrf-dashboard-list',
    templateUrl: 'RRFDashboardList.component.html',
    directives: [ROUTER_DIRECTIVES, CHART_DIRECTIVES],
    styleUrls: ['../../RRFApproval/components/RRFApproval.component.css'],
    pipes: [RRFIDPipe],
    providers: [ToastsManager]
})

export class RRFDashboardListComponent implements OnActivate {

    rrfList: RRFDetails[] = [];
    errorMessage: string;
    selectedRRF: RRFDetails = new RRFDetails();
    isListVisible: boolean = true;
    rrfStatusCount: AllRRFStatusCount = new AllRRFStatusCount();
    currentView: string = 'myRRF';
    closeComment: string = '';
    closeRRF: boolean = false;
    closeRRFID: number = 0;

    // doughnutChartLabels: string[] = ['ABC', 'BBB', 'CCC' , 'DDD'];
    // doughnutChartData: number[] = [100, 100, 100 ,200];
    // doughnutChartType: string = 'doughnut';

    constructor(private _rrfDashboardService: RRFDashboardService,
        private _myRRFService: MyRRFService,
        public toastr: ToastsManager) {
    }

    routerOnActivate() {
        this.getMyRRFData();
    }

    getMyRRFData() {
        this.getMyRRF();
        this.getStatuswiseMyRRFCount();
    }

    getAllRRFData() {
        this.getAllRRF();
        this.getStatuswiseRRFCount();
    }

    chartClicked(e: any): void {
        console.log(e);
    }

    chartHovered(e: any): void {
        console.log(e);
    }
    getAllRRF() {
        this._rrfDashboardService.getAllRRF()
            .subscribe(
            results => {
                this.rrfList = <any>results;
            },
            error => this.errorMessage = <any>error);
    }

    getMyRRF() {
        this._rrfDashboardService.getMyRRF()
            .subscribe(
            results => {
                this.rrfList = <any>results;
            },
            error => this.errorMessage = <any>error);
    }

    getStatuswiseRRFCount() {
        this._rrfDashboardService.getStatuswiseRRFCount()
            .subscribe(
            results => {
                this.rrfStatusCount = <any>results;
            },
            error => this.errorMessage = <any>error);
    }

    getStatuswiseMyRRFCount() {
        this._rrfDashboardService.getStatuswiseMyRRFCount()
            .subscribe(
            results => {
                this.rrfStatusCount = <any>results;
            },
            error => this.errorMessage = <any>error);
    }

    getRRFDetails(rrfID: string) {
        this._myRRFService.getRRFDetails(rrfID)
            .subscribe(
            (results: RRFDetails) => {
                this.selectedRRF = results;
            },
            error => this.errorMessage = <any>error);
    }

    showRRFDetails(rrfId: string) {
        this.getRRFDetails(rrfId);
        console.log(this.selectedRRF);
        this.isListVisible = false;
    }

    showListOfRRF() {
        this.isListVisible = true;
    }

    onViewChanged(viewMode: string) {
        if (viewMode === 'AllRRF') {
            this.currentView = 'allRRF';
            this.getAllRRFData();
        } else {
            this.currentView = 'myRRF';
            this.getMyRRFData();
        }
    }

    onEditRRF(rrfID: number) {
        console.log(rrfID);
    }

    onCloseRRFClick(rrfID: number) {
        this.closeRRF = true;
        this.closeRRFID = rrfID;

    }

    onbtnCloseRRF() {
        this._rrfDashboardService.closeRRF(this.closeRRFID, this.closeComment)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this.rrfStatusCount = <any>results;
                } else {
                    this.toastr.error((<ResponseFromAPI>results).ErrorMsg);
                }
            },
            error => this.errorMessage = <any>error);

        this.closeRRFID = 0;
        this.closeComment = '';

        if (this.currentView = 'allRRF') {
            this.getAllRRFData();
        } else {
            this.getMyRRFData();
        }
    }

    onCancelCloseRRF() {
        this.closeRRFID = 0;
        this.closeComment = '';
    }

    getPriorityClass(priority: string): string {
        return 'priority' + priority;
    }

}

