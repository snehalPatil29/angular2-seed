import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, OnActivate, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { IfAuthorizeDirective } from '../../../shared/directives/ifAuthorize.directive';
import { ProfileBankPipe }from '../../shared/filter/profileBank.pipe';
import { ProfileInterviewHistory, AllInterviewsHistory }from '../models/profileEsplHistoryModel';
import { MasterData } from  '../../../shared/model/index';
import { ProfileEsplHistoryService } from '../services/profileEsplHistory.service';
import { IEFGridRowComponent } from '../../../recruitmentCycle/shared/component/IEFGridRow/IEFGridRow.component';

@Component({
    moduleId: module.id,
    selector: 'profile-esplhistory-list',
    templateUrl: 'profileEsplHistoryList.component.html',
    directives: [ROUTER_DIRECTIVES, IfAuthorizeDirective, IEFGridRowComponent],
    styleUrls: ['../../myProfiles/components/myProfiles.component.css'],
    providers: [ProfileEsplHistoryService],
    pipes: [ProfileBankPipe]
})

export class ProfileEsplHistoryListComponent implements OnActivate {
    allInterviewsHistory: AllInterviewsHistory = new AllInterviewsHistory();
    profileHistory: ProfileInterviewHistory;
    profileHistoryCollection: Array<ProfileInterviewHistory> = new Array<ProfileInterviewHistory>();
    historyOfCandidate: MasterData;
    errorMessage: string;
    NORECORDSFOUND: boolean = false;
    returnPath: string;
    candidateIdForReturnPath :string;
    constructor(private _router: Router,
        public toastr: ToastsManager,
        private profilesHistoryService: ProfileEsplHistoryService) {
        /** */
    }

    routerOnActivate() {
        /** */
        this.historyOfCandidate = this.getSessionOf<MasterData>('HistoryOfCandidate', true);
        this.returnPath = this.getSessionOf<string>('onReturnPath', false);
        this.candidateIdForReturnPath = sessionStorage.getItem('CandidateIdForReturnPath');
        this.getProfilesHistory(this.historyOfCandidate);
    }
    /**Function to get candidates interviews history with ESPL */
    getProfilesHistory(_candidateID: MasterData) {
        this.profilesHistoryService.getProfilesInterviewHistory(_candidateID)
            .subscribe(
            (results: any) => {
                //if (results.Profiles !== undefined && results.Profiles.length > 0) {
                if (results !== undefined && results.length > 0) {
                    this.profileHistoryCollection = <any>results;
                } else {
                    this.toastr.error('No Records Found.');
                    this.profileHistoryCollection = null;
                }
            },
            error => this.errorMessage = <any>error);
    }

    // getProfilesAllHistory() {
    //     try {
    //         this.profilesHistoryService.getProfilesInterviewHistory(this.allInterviewsHistory.GrdOperations)
    //             .subscribe(
    //             (results: any) => {
    //                 if (results.Profiles !== undefined && results.Profiles.length > 0) {
    //                     this.allInterviewsHistory = <AllInterviewsHistory>results;
    //                 } else { this.NORECORDSFOUND = true; }
    //             },
    //             error => this.errorMessage = <any>error);
    //     } catch (error) {
    //         this.allInterviewsHistory = new AllInterviewsHistory();
    //     }
    // }

    /**Get data from session */
    getSessionOf<T>(variableName: string, isJson: Boolean): T {
        var _requestedIef = sessionStorage.getItem(variableName);
        //var response: any;
        if (_requestedIef !== null) {
            var response = isJson ? JSON.parse(_requestedIef) : _requestedIef;
            sessionStorage.setItem(variableName, '');
        } else {
            /** If no information found from Session then it will redirected to existing page */
            this.toastr.error('Somthing went wrong..!');
        }
        return response;
    }
    redirectToView(CandidateID: MasterData) {
        this._router.navigate(['/App/ProfileBank/MyProfiles/View/' + CandidateID.Value + 'ID' + CandidateID.Id]);
    }
    Back() {
        if (this.returnPath.includes('Edit')) {
            this._router.navigate([this.returnPath + this.candidateIdForReturnPath]);
        } else {
            this._router.navigate([this.returnPath]);
        }

    }

}
