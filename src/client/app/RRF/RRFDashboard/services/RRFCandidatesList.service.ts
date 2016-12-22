import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import { Config } from '../../../shared/config/config';
import { SpinnerService } from '../../../shared/components/spinner/spinner';
import { MasterData  } from '../../../shared/model/common.model';
import { TransferInterview} from '../model/RRFCandidateList';

@Injectable()
export class RRFCandidateListService {
    constructor(private authHttp: AuthHttp,
        private _spinnerService: SpinnerService) { }

    //Get RRf Specific Candidates by RRFID - API will return list of Candidates
    getCandidateProfilesByRRF(RRFID: string) {
        let url = Config.GetURL('/api/RecruitmentCycle/GetCandidateProfilesByRRF?RRFID=' + RRFID);
        //let url = Config.GetURL('/api/RecruitmentCycle/GetCandidatesForRRF');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getCandidatesForRRF(RRFID: string) {
        let url = Config.GetURL('/api/RecruitmentCycle/GetCandidatesForRRF?RRFID=' + RRFID);
        //let url = Config.GetURL('/api/RecruitmentCycle/GetCandidatesForRRF');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getOfferedCandidatesForRRF(RRFID: string) {
        let url = Config.GetURL('/api/RecruitmentCycle/GetInterviewCompletedCandidatesForRRF?RRFID=' + RRFID);
        //let url = Config.GetURL('/api/RecruitmentCycle/GetCandidatesForRRF');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getOtherCandidatesForRRF(RRFID: string) {
        //TODO: need to change API
        let url = Config.GetURL('/api/RecruitmentCycle/GetInterviewCompletedCandidatesForRRF?RRFID=' + RRFID);
        //let url = Config.GetURL('/api/RecruitmentCycle/GetCandidatesForRRF');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getCandidatesForSelectedRRF(round: any, rrfid: any, status: any) {
        let url = Config.GetURL('/api/Dashboards/GetCandidatesForSelectedRRFAndInterviewStatus?RRFID=' + rrfid + '&InterviewRound=' + round + '&InterviewStatus=' + status);
        //let url = Config.GetURL('/api/RecruitmentCycle/GetCandidatesForRRF');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    //This Method is used to get Interview rounds history by passing CandidateID and RRFID
    getInterviewRoundHistorybyCandidateId(CandidateID: MasterData, RRFID: MasterData) {
        //ASK backend team - IS API READY? Change URL
        let url = Config.GetURL('/api/RecruitmentCycle/ViewCandidateInterviewSchedule');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateID: CandidateID, RRFID: RRFID })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    getRRFByID(RRFID: string) {
        let url = Config.GetURL('/api/RRF/GetRRFByID?RRFID=' + RRFID);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    GetCandidatesRatingsforChart(CandidateID: MasterData, RRFID: MasterData) {
        let url = Config.GetURL('/api/RecruitmentCycle/GetCandidateInterviewChartSummary');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateID: CandidateID, RRFID: RRFID })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    proceedForOfferGeneration(InterviewID: MasterData, CandidateID: MasterData, RRFID: MasterData, JoiningDate: Date) {
        let url = Config.GetURL('/api/RecruitmentCycle/ProceedForOfferGeneration');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateID, RRFID, InterviewID, JoiningDate })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    TransferToOtherRRF(InterviewDetails: TransferInterview) {
        let url = Config.GetURL('/api/RecruitmentCycle/SendFitmentIssueForApproval');
        this._spinnerService.show();
        return this.authHttp.post(url, { InterviewDetails })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    UpdateCandidateIEFStatus(InterviewID: MasterData, Status: string, Comments: string) {
        let url = Config.GetURL('/api/RecruitmentCycle/UpdateCandidateIEFStatus');
        this._spinnerService.show();
        return this.authHttp.post(url, { InterviewID, Status, Comments })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    setActualTime(InterviewDetails: {}) {
        let url = Config.GetURL('/api/RecruitmentCycle/UpdateCandidateActualInterviewTime');
        this._spinnerService.show();
        return this.authHttp.post(url, { InterviewDetails })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    //Cancel scheduled Inerview
    CancelInterview(InterviewID: MasterData, Status: string, Reason: string) {
        let url = Config.GetURL('/api/RecruitmentCycle/CancelInterview');
        this._spinnerService.show();
        return this.authHttp.post(url, { 'InterviewDetails': { InterviewID, Status, Reason } })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }


    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }

    private handleError(error: Response) {
        console.log(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
