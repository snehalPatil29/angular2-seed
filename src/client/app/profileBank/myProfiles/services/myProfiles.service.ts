import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { MyProfilesInfo, SalaryDetails, Qualification, ResumeMeta, OtherDetails,Skills} from '../model/myProfilesInfo';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import { Config } from '../../../shared/config/config';
import { SpinnerService } from '../../../shared/components/spinner/spinner';

@Injectable()
export class MyProfilesService {

    constructor(private http: Http, private authHttp: AuthHttp, private _spinnerService: SpinnerService) { }

    UploadCandidateProfile(resumeMeta: ResumeMeta) {
        let url = Config.GetURL('/api/ProfileBank/UploadCandidateProfile');
        this._spinnerService.show();
        return this.authHttp.post(url, { resumeMeta })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    getMyProfiles() {
        let url = Config.GetURL('/api/ProfileBank/getOpenProfiles');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    addCandidateProfile(profile: MyProfilesInfo) {
        let url = Config.GetURL('/api/ProfileBank/addCandidateProfile');
        this._spinnerService.show();
        return this.authHttp.post(url, { profile })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateProfile(profile: MyProfilesInfo) {
        let url = Config.GetURL('/api/ProfileBank/editCandidateProfile');
        this._spinnerService.show();
        return this.authHttp.post(url, { profile })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    getCandidateProfile(id: string) {
        let url = Config.GetURL('/api/ProfileBank/getCandidateProfile');
        this._spinnerService.show();
        return this.authHttp.post(url, { profile: { ProfileId: id } })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidatePersonalDetails(profile: MyProfilesInfo) {
        let url = Config.GetURL('/api/ProfileBank/AddPersonalDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { profile })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateProfessionalDetails(profileOtherDetails: OtherDetails) {
        let url = Config.GetURL('/api/ProfileBank/AddCandidateOtherDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { profileOtherDetails })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateQualificationDetails(profile: MyProfilesInfo) {
        let url = Config.GetURL('/api/ProfileBank/AddQualificationDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { profile })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateCareerDetails(profile: MyProfilesInfo) {
        let url = Config.GetURL('/api/ProfileBank/AddCareerProfileDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { profile })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateSkillsDetails(profileSkills: Skills) {
        let url = Config.GetURL('/api/ProfileBank/AddCandidateSkillsDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { profileSkills })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateSalaryDetails(profileSalryDetails: SalaryDetails) {
        let url = Config.GetURL('/api/ProfileBank/AddCandidateSalaryDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { profileSalryDetails })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateTeamManagementDetails(profile: MyProfilesInfo) {
        let url = Config.GetURL('/api/ProfileBank/AddCandidateTeamManagementDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { profile })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    addCandidateQualification(qualification: Qualification) {
        let url = Config.GetURL('/api/ProfileBank/AddQualificationDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { qualification })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    getCandidateQualifications(id: string) {
        let url = Config.GetURL('/api/ProfileBank/getQualificationDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { profile: { ProfileId: id } })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateQualification(qualification: Qualification) {
        let url = Config.GetURL('/api/ProfileBank/UpdateQualifications');
        this._spinnerService.show();
        return this.authHttp.post(url, { qualification })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    updateCandidateStatus(CandidateID: number, StatusId: number, Comments: string) {
        let url = Config.GetURL('/api/ProfileBank/UpdateStatus');
        this._spinnerService.show();
        return this.authHttp.post(url, { profile: { CandidateID: CandidateID, StatusId: StatusId, Comments: Comments } })
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
