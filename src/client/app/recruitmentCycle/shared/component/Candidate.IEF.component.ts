import { Component, OnInit} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Interview } from  '../../shared/model/interview';
import { CandidateIEFService } from  '../services/Candidate.IEF.service';
import { Router } from '@angular/router';
import { IEFFunctionComponent } from './IEFFuncations/Component/IEFFunction.component';
import { InterviewSlotComponent } from './InterviewSlot/Component/InterviewSlot.component';
import { IEFInformation, iefModel, IEFFunction, IEFSubmission } from '../../shared/model/ief';
import { ResponseFromAPI, MasterData } from '../../../shared/model/common.model';
import { APIResult } from  '../../../shared/constantValue/index';

@Component({
    moduleId: module.id,
    selector: 'recruiter-ief',
    templateUrl: 'Candidate.IEF.component.html',
    //directives: [ROUTER_DIRECTIVES, IEFFunctionComponent, InterviewSlotComponent],
    providers: [ToastsManager, CandidateIEFService]
})

export class RecruitmentIEFComponent implements OnInit {
    returnPath: string;
    errorMessage: string;
    requestedIef: iefModel = new iefModel();
    candidateIEFHistory: Array<Interview> = new Array<Interview>();
    candidateIEFDetails: IEFInformation = new IEFInformation();
    functions: Array<IEFFunction> = new Array<IEFFunction>();
    iefStatus: string = 'Selected';
    iefComments: string;
    isChangeStatusReq: boolean = false;
    constructor(private _router: Router,
        private toastr: ToastsManager,
        private _candidateIEFService: CandidateIEFService) {

    }
    OnInit() {
        /**This method was on RouterOnActivate event */
        this.requestedIef = this.getSessionOf<iefModel>('SubmitIef');
        this.getIEFDetails(this.requestedIef);
        this.getIEFHistory(this.requestedIef);
        this.returnPath = sessionStorage.getItem('onReturnPath');
    }
    ngOnInit() {
        this.OnInit();
        var intrviewStatus: string = sessionStorage.getItem('InterviewStatus')
        if (intrviewStatus.toLowerCase() === 'on hold') {
            this.getIEFPreviousData(this.requestedIef.InterviewID);
            this.isChangeStatusReq = true;
        } else {
            this.getIEFFunctions(this.requestedIef.InterviewType.Id);
        }

    }
    Back() {
        if (this.returnPath !== undefined)
            this._router.navigate([this.returnPath]);
    }

    /** Get selected cadidate IEF static inforamtion*/
    getIEFDetails(objIEFid: iefModel) {
        this._candidateIEFService.getCurrentIEFDetails(objIEFid)
            .subscribe(
            (results: any) => {
                this.candidateIEFDetails = results;
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
    }


    submitIEFDetails(updatedIefFunctions: IEFFunction[]) {
        if (this.isChangeStatusReq) {
            this._candidateIEFService.UpdateCandidateIEFStatus(this.requestedIef.InterviewID, this.iefStatus, this.iefComments)
                .subscribe(
                (results: any) => {
                    if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                        this.toastr.success((<ResponseFromAPI>results).Message);
                        this.Back();
                    } else {
                        this.toastr.error((<ResponseFromAPI>results).ErrorMsg);
                    }
                },
                error => this.errorMessage = <any>error);

        } else {
            var currentIefDetails: IEFSubmission = new IEFSubmission();
            currentIefDetails = this.createIEF(updatedIefFunctions);
            this._candidateIEFService.saveCurrentIEFDetails(currentIefDetails)
                .subscribe(
                results => {
                    if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                        this.toastr.success((<ResponseFromAPI>results).Message);

                        this.Back();
                    } else {
                        this.toastr.error((<ResponseFromAPI>results).Message);
                    }
                },
                error => {
                    this.errorMessage = <any>error;
                    this.toastr.error(<any>error);
                });
        }
    }
    getIEFHistory(objIEFid: iefModel) {
        this._candidateIEFService.getIEFHistory(objIEFid)
            .subscribe(
            (results: any) => {
                this.candidateIEFHistory = results;
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
    }

    getIEFFunctions(interviewType: number) {
        this._candidateIEFService.getIEFFunctions(interviewType)
            .subscribe(
            (results: any) => {
                this.functions = results;
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
    }

    getIEFPreviousData(interviewID: MasterData) {
        this._candidateIEFService.getIEFByInterviewID(interviewID)
            .subscribe(
            (results: any) => {
                this.functions = results;
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
    }
    onUpdate() {
        /** */
    }
    /**Prepars IEF object for sumbmission */
    createIEF(_iefFunctions: IEFFunction[]) {
        var objUpdatedIEF: IEFSubmission = new IEFSubmission();
        objUpdatedIEF.InterviewID = this.requestedIef.InterviewID;
        objUpdatedIEF.CandidateID = this.requestedIef.CandidateID;
        objUpdatedIEF.RRFID = this.requestedIef.RRFID;
        objUpdatedIEF.IEFTransactionDetails = _iefFunctions;
        objUpdatedIEF.Status = this.iefStatus;
        objUpdatedIEF.Comments = this.iefComments;
        return objUpdatedIEF;
    }
    getSessionOf<T>(variableName: string): T {
        var _requestedIef = sessionStorage.getItem(variableName);
        if (_requestedIef !== null) {
            var response = JSON.parse(_requestedIef);
            sessionStorage.setItem(variableName, '');
        } else {
            /** If no information found from Session then it will redirected to existing page */
            this.toastr.error('Somthing went wrong..!');
            this.Back();
        }
        return response;
    }

}
