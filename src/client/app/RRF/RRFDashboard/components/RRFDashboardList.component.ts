import {Component} from '@angular/core';
import { OnActivate, ROUTER_DIRECTIVES } from '@angular/router';
import { RRFDashboardService } from '../services/rrfDashboard.service';
import { RRFDetails, AllRRFStatusCount } from '../../myRRF/models/rrfDetails';
import { MyRRFService } from '../../myRRF/services/myRRF.service';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

@Component({
    moduleId: module.id,
    selector: 'rrf-dashboard-list',
    templateUrl: 'RRFDashboardList.component.html',
    directives: [ROUTER_DIRECTIVES, CHART_DIRECTIVES]
})

export class RRFDashboardListComponent implements OnActivate {

    rrfList: RRFDetails[] = [];
    errorMessage: string;
    selectedRRF: RRFDetails = new RRFDetails();
    isListVisible: boolean = true;
    rrfStatusCount: AllRRFStatusCount = new AllRRFStatusCount();

    doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
    doughnutChartData: number[] = [350, 450, 100];
    doughnutChartType: string = 'doughnut';

    constructor(private _rrfDashboardService: RRFDashboardService,
        private _myRRFService: MyRRFService) {
    }

    routerOnActivate() {
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
                this.rrfList = results;
            },
            error => this.errorMessage = <any>error);
    }

    getStatuswiseRRFCount() {
        this._rrfDashboardService.getStatuswiseRRFCount()
            .subscribe(
            results => {
                this.rrfStatusCount = results;
                this.setGraphValue();
            },
            error => this.errorMessage = <any>error);
    }


    getRRFDetails(rrfID: number) {
        this._myRRFService.getRRFDetails(rrfID)
            .subscribe(
            results => {
                this.selectedRRF = results;
            },
            error => this.errorMessage = <any>error);
    }

    showRRFDetails(rrfId: number) {
        this.getRRFDetails(rrfId);
        this.isListVisible = false;
    }

    showListOfRRF() {
        this.isListVisible = true;
    }

    onViewChanged(viewMode: string) {
        //console.log(viewMode);
        this.getAllRRF();
    }
    setGraphValue() {
        AmCharts.makeChart('chartdiv', {
            'type': 'pie',
            'theme': 'light',
            'legend': {
                'position': 'right',
                'marginRight': 100,
                'autoMargins': false
            },
            'innerRadius': '30%',
            'dataProvider': [{
                'status': 'Pending Approval',
                'value': this.rrfStatusCount.PendingApproval
            }, {
                    'status': 'Rejected',
                    'value': this.rrfStatusCount.Rejected
                }, {
                    'status': 'On-Hold',
                    'value': 2 //TODO
                }, {
                    'status': 'Open',
                    'value': this.rrfStatusCount.Open
                }, {
                    'status': 'Assigned',
                    'value': this.rrfStatusCount.Assigned
                }, {
                    'status': 'InProgress',
                    'value': this.rrfStatusCount.InProgress
                }, {
                    'status': 'Closure Approval',
                    'value': this.rrfStatusCount.ClosureApproval
                }, {
                    'status': 'Closed',
                    'value': this.rrfStatusCount.Closed
                }],
            'valueField': 'value',
            'titleField': 'status',
            'balloon': {
                'fixedPosition': true
            },
            'export': {
                'enabled': true
            }
        });
    }

}
