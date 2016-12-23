import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CandidateExperience, CandidateProfile, EmploymentHistory, ResumeMeta, SalaryDetails, Qualification, TeamManagement, CareerProfile,
    OtherDetails, Skills, TransferOwnershipMeta,SocialInformation} from '../model/myProfilesInfo';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import { Config } from '../../../shared/config/config';
import { SpinnerService } from '../../../shared/components/spinner/spinner';
import { MasterData } from  '../../../shared/model/index';

@Injectable()

export class ProfileBankService {

    constructor(private http: Http, private authHttp: AuthHttp, private _spinnerService: SpinnerService) { }

    //To DO need to change api
    getEmail(emailCode: any) {
        let url = Config.GetURL('/api/RecruitmentCycle/GetEmailByEmailCode?emailCode=' + emailCode);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    updateOwnership(Ownership: TransferOwnershipMeta) {
        let url = Config.GetURL('/api/ProfileBank/UpdateProfileOwner');
        this._spinnerService.show();
        return this.authHttp.post(url, { Ownership })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    getCandidateOwnwershipInfo(candidateIds: Array<MasterData>) {
        let url = Config.GetURL('/api/ProfileBank/getCandidateOwnwershipInfo');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateIds: candidateIds })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateProfile(profile: CandidateProfile) {
        let url = Config.GetURL('/api/ProfileBank/UpdateCandidateIntialInfo');
        this._spinnerService.show();
        return this.authHttp.post(url, { profile })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    getCandidateProfile(id: string) {
        let url = Config.GetURL('/api/ProfileBank/ViewCandidateInformation?CandidateID=' + id);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    /** get candidate profile picture */
    getCandidateProfilePhoto(CandidateID: MasterData) {
        let url = Config.GetURL('/api/ProfileBank/GetProfilePicture?CandidateID=' + CandidateID.Value);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractDataDefaultFormat)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidatePersonalDetails(profile: CandidateProfile) {
        let url = Config.GetURL('/api/ProfileBank/AddPersonalDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { profile })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateProfessionalDetails(CandidateOtherDetails: OtherDetails) {
        let url = Config.GetURL('/api/ProfileBank/AddCandidateOtherDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateOtherDetails })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateQualificationDetails(profile: CandidateProfile) {
        let url = Config.GetURL('/api/ProfileBank/AddQualificationDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { profile })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    /**Save candidate Experienc details */
    editCandidateCareerDetails(CandidateExperience: CandidateExperience) {
        let url = Config.GetURL('/api/ProfileBank/UpdateCandidateExperience');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateExperience })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateSkillsDetails(CandidateSkills: Skills) {
        let url = Config.GetURL('/api/ProfileBank/AddCandidateSkillsDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateSkills })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateSalaryDetails(CandidateSalaryDetails: SalaryDetails) {
        let url = Config.GetURL('/api/ProfileBank/AddCandidateSalaryDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateSalaryDetails })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateTeamManagementDetails(CandidateTeamManagement: TeamManagement) {
        let url = Config.GetURL('/api/ProfileBank/AddCandidateTeamManagementDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateTeamManagement })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    editCandidateSocialInfo(CandidateSocialInformation: SocialInformation) {
        let url = Config.GetURL('/api/ProfileBank/UpdateCandidateSocialInfo');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateSocialInformation })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    addCandidateQualification(CandidateQualifications: Qualification) {
        let url = Config.GetURL('/api/ProfileBank/AddQualificationDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateQualifications })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    getCandidateQualifications(id: string) {
        let url = Config.GetURL('/api/ProfileBank/getQualificationDetails?CandidateID=' + id);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    /**Get Candidates EXPERIENCE details */
    getCandidateExperience(candidateID: MasterData) {
        let url = Config.GetURL('/api/ProfileBank/GetCandidateExperience?CandidateID=' + candidateID.Value);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    /**Get candidate employement history till date. */
    getCandidateEmploymentHistory(_candidateID: MasterData) {
        let url = Config.GetURL('/api/ProfileBank/GetCareerProfileDetails?CandidateID=' + _candidateID.Value);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    /**Get selected employer's and employement details for update. */
    getCandidateSelectedEmploymentDetails(CareerProfileId: string) {
        let url = Config.GetURL('/api/ProfileBank/GetCareerProfileDetailsByCareerId?CareerProfileID=' + CareerProfileId);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    /**Save candidate's all employement information' */
    addCandidateEmploymentDetails(CandidateCareerProfile: EmploymentHistory) {
        let url = Config.GetURL('/api/ProfileBank/AddCareerProfileDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateCareerProfile })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    /**Edit candidate's employement information details */
    editCandidateEmploymentDetails(CandidateCareerProfile: EmploymentHistory) {
        let url = Config.GetURL('/api/ProfileBank/UpdateCareerProfileDetails');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateCareerProfile })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    editCandidateQualification(CandidateQualification: Qualification) {
        let url = Config.GetURL('/api/ProfileBank/UpdateQualifications');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateQualification })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    updateCandidateStatus(CandidateID: MasterData, Status: MasterData, Comments: string) {
        let url = Config.GetURL('/api/ProfileBank/UpdateStatus');
        //let url = Config.GetURL('/api/ProfileBank/BlacklistCandidate');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateID: CandidateID, Status: Status, Comments: Comments })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());

    }
    blackListCandidate(CandidateID: MasterData, Comments: string) {
        let url = Config.GetURL('/api/ProfileBank/BlacklistCandidate');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateID: CandidateID, Comments: Comments })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());

    }

    updateFollowUpComments(CandidateID: MasterData, Comments: string) {
        let url = Config.GetURL('/api/ProfileBank/UpdateFollowUpComments');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateID: CandidateID, FollowUpComments: Comments })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    getQualificationById(CandidateID: string, QualificationID: string) {
        let url = Config.GetURL('/api/ProfileBank/getCandidateQualification?CandidateID=' +
            CandidateID + '&QualificationID=' + QualificationID);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());

    }

    getResumeById(CandidateID: MasterData) {
        //  let url = Config.GetURL('/api/ProfileBank/GetResume?CandidateID='+CandidateID);
        // this._spinnerService.show();
        // return this.authHttp.get(url)
        //     .map(this.extractData)
        //     .catch(this.handleError)
        //     .finally(() => this._spinnerService.hide());
        // return this.http.get('https://static.pexels.com/photos/4825/red-love-romantic-flowers.jpg')
        //     .map(this.ChangeResponseType)
        //     .catch(this.handleError)
        //     .finally(() => this._spinnerService.hide());
        // let formData: FormData = new FormData();


        // formData.append('CandidateID', resumeMeta.Profile, resumeMeta.Profile.name);
        // formData.append('CandidateID', resumeMeta.CandidateID.Value);
        // formData.append('Overwrite', resumeMeta.Overwrite);

        // var xhr = new XMLHttpRequest();
        // let url = Config.GetURL('/api/ProfileBank/GetResume?CandidateID=' + CandidateID.Value);
        // xhr.open('GET', url, true);
        // xhr.responseType = 'blob';
        // xhr.setRequestHeader('responseType', 'bolb');
        // xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


        // xhr.onreadystatechange = function () {//Call a function when the state changes.
        //     if (xhr.readyState === 4 && xhr.status === 200) {
        //         var blob = new Blob([this.response], { type: 'application/jpeg' });
        //         saveAs(blob, 'Report.jpg');
        //     } else {
        //         console.log('Error');
        //     }
        // };
        // xhr.open('GET', url, true);
        // xhr.send();
        //let url = Config.GetURL('/api/ProfileBank/GetResume?CandidateID=' + CandidateID.Value);
        var headers = new Headers();
        headers.append('responseType', 'bolb');
        // headers.append('Content-Type', 'application/json');
        // headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        //let options = new RequestOptions({ headers: headers });
        //'http://www.pdf995.com/samples/pdf.pdf
        return this.http.get('http://www.pdf995.com/samples/pdf.pdf', headers)
            .map((response: any) => {
                var mediaType = 'application/pdf';
                var blob = new Blob([response._body], { type: mediaType });
                var filename = 'test.pdf';
                saveAs(blob, filename);
            })
            .catch(this.handleError);
    }
    getResume(CandidateID: MasterData) {
        let url = Config.GetURL('/api/ProfileBank/GetCandidateResumeInHTMLFormat?candidateID=' + CandidateID.Value);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
     getResumeToDownload(CandidateID: MasterData) {
        let url = Config.GetURL('/api/ProfileBank/GetResume?candidateID=' + CandidateID.Value);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    uploadProfilePhoto(resumeMeta: ResumeMeta) {
        let url = Config.GetURL('/api/ProfileBank/UploadProfilePhoto');
        return new Promise((resolve, reject) => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            formData.append('Profile', resumeMeta.Profile, resumeMeta.Profile.name);
            formData.append('CandidateID', resumeMeta.CandidateID.Id);
            formData.append('Overwrite', resumeMeta.Overwrite);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
            xhr.send(formData);
        });
    }
    /*** Remove Profile photo */
    removeProfilePhoto(candidateID: MasterData) {
        /** TODO:: Update api URL Once API is ready (API is pending) */
        let url = Config.GetURL('/api/ProfileBank/');
        this._spinnerService.show();
        return this.authHttp.post(url, { candidateID })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    deleteProfile(CandidateID: MasterData) {
        let url = Config.GetURL('/api/ProfileBank/DeleteCandidate');
        this._spinnerService.show();
        return this.authHttp.post(url, { CandidateID })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    getStatusById(CandidateID: string) {
        let url = Config.GetURL('/api/ProfileBank/GetStatus?CandidateID=' + CandidateID);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    /* Sorting */
    getColumsForSorting(featureName: string) {
        let url = Config.GetURL('/api/Masters/GetSortableColumns?Feature=' + featureName);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    private createBolb(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        return new Blob([res], { type: 'image/jpeg' });
    }
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }
    /** method to get data in default format not json format */
    private extractDataDefaultFormat(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res;
        return body || {};
    }

    private handleError(error: Response) {
        console.log(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
