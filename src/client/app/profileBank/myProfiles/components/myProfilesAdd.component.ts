import {Component} from '@angular/core';
import { Router, ROUTER_DIRECTIVES, OnActivate, RouteSegment } from '@angular/router';
import { CandidateProfile, ResumeMeta, Qualification, CandidateExperience, EmploymentHistory} from '../../shared/model/myProfilesInfo';
import { MyProfilesService } from '../services/myProfiles.service';
import { MastersService } from '../../../shared/services/masters.service';
//import * as  _ from 'lodash';
import { TOOLTIP_DIRECTIVES } from 'ng2-bootstrap';
import { MasterData, ResponseFromAPI } from  '../../../shared/model/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { APIResult } from  '../../../shared/constantValue/index';
import { ProfileBankService} from  '../../shared/services/profileBank.service';
import {Location} from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'rrf-myprofiles-add',
    templateUrl: '../../shared/views/profileBankAdd.component.html',
    directives: [ROUTER_DIRECTIVES, TOOLTIP_DIRECTIVES],
    styleUrls: ['myProfiles.component.css']
})

export class MyProfilesAddComponent implements OnActivate {
    CandidateID: MasterData = new MasterData();
    profile: CandidateProfile;
    qualification: Qualification;
    errorMessage: string;
    params: string;

    countries: Array<MasterData>;
    states: Array<MasterData>;

    qualifications: Array<MasterData>;
    grades: Array<MasterData>;
    years: Array<MasterData>;
    selectedQualification: number;
    selectedYear: number;
    selectedGrade: number;
    Marks: number;
    EmploymentDetailsAction: string = 'Add';
    IsHidden: boolean = true;
    IsSuccess: boolean = false;
    CurrentYear: number;
    selectedVisa: MasterData = new MasterData();
    VisaType: Array<MasterData> = new Array<MasterData>();
    TITLE: string = 'Profiles';
    /**Candidate Experience */
    CandidateExperiences: CandidateExperience = new CandidateExperience();
    /**Employment History*/
    EmployersInformation: EmploymentHistory = new EmploymentHistory();
    /**Employment History collection */
    EmployersInformationList: Array<EmploymentHistory> = new Array<EmploymentHistory>();
    /**Variables for Upload photo */
    uploadedPhoto: any;
    fileUploaded: boolean = false;
    fileName: string;
    resumeMeta: ResumeMeta;
    profilePhoto: string;
    /** For profile picture */
    profilePic: any;
    constructor(private _myProfilesService: MyProfilesService,
        private _masterService: MastersService,
        private _profileBankService: ProfileBankService,
        public toastr: ToastsManager,
        private _router: Router,
        private _location: Location) {
        this.profile = new CandidateProfile();
        this.createQualificationObj();
        this.resumeMeta = new ResumeMeta();
        this.uploadedPhoto = new Array<File>();

    }

    routerOnActivate(segment: RouteSegment) {
        //get all master data and bind to dropdown
        this.getCountries();
        // this.getStates();
        // this.getDistricts();
        this.getQualifications();

        this.getGrades();
        this.getVisaType();
        //get current profile by Id
        this.params = segment.getParam('id');
        if (this.params) {
            this.CandidateID.Id = parseInt(this.params.split('ID')[1]);
            this.CandidateID.Value = this.params.split('ID')[0];
            this.getCandidateProfileById(this.CandidateID.Value);
            this.GetEmployersInformationList(this.CandidateID);
            this.GetCandidateExperience(this.CandidateID);
        }
        var date = new Date();
        this.CurrentYear = date.getFullYear();
        this.getProfilePhoto(this.CandidateID);
    }

    createQualificationObj() {
        this.qualification = new Qualification();
        this.qualification.Qualification = new MasterData();
        this.qualification.Grade = new MasterData();
    }

    getCandidateProfileById(profileId: string) {
        this._profileBankService.getCandidateProfile(profileId)
            .subscribe(
            (results: CandidateProfile) => {
                this.profile = results;
                this.profile.PreviousFollowupComments = this.profile.FollowUpComments;
                if (results.Country.Id !== 0)
                    this.getStates(results.Country.Id);
            },
            error => this.errorMessage = <any>error);
    }


    getCountries(): void {
        this._masterService.getCountries()
            .subscribe(
            results => {
                this.countries = results;

            },
            error => this.errorMessage = <any>error);
    }

    getStates(CountryId: number): void {
        this._masterService.getStates(CountryId)
            .subscribe(
            results => {
                this.states = results;
            },
            error => this.errorMessage = <any>error);
    }

    getQualifications(): void {
        this._masterService.getQualifications()
            .subscribe(
            results => {
                this.qualifications = <Array<MasterData>>results;
            },
            error => this.errorMessage = <any>error);
    }

    getYears(): void {
        this._masterService.getYears()
            .subscribe(
            results => {
                this.years = results;
            },
            error => this.errorMessage = <any>error);
    }

    getGrades(): void {
        this._masterService.getGrades()
            .subscribe(
            results => {
                this.grades = results;
            },
            error => this.errorMessage = <any>error);
    }
    getVisaType(): void {
        this._masterService.GetVisaType()
            .subscribe(
            results => {
                this.VisaType = results;
            },
            error => this.errorMessage = <any>error);
    }
    createQualification() {
        this.qualification = new Qualification();
        this.qualification.Qualification = new MasterData;
        this.qualification.Grade = new MasterData;

    }

    onSelectQualification(candidateQualification: string) {
        this.selectedQualification = parseInt(candidateQualification);
    }
    onSelectVisa(visaId: string) {
        this.profile.CandidateOtherDetails.Visa.Id = parseInt(visaId);
    }

    onSelectGrade(grade: string) {
        this.selectedGrade = parseInt(grade);
    }

    onSameAddressChecked(value: boolean) {
        if (value) {
            this.profile.PermanentAddress = this.profile.CurrentAddress;
        } else {
            this.profile.PermanentAddress = '';
        }
    }
    onSavePrimaryInfo(): void {
        if (this.profile.PreviousFollowupComments !== this.profile.FollowUpComments.trim().replace(/ +/g, ' ')) {
            this.profile.CommentsUpdated = true;
            this.profile.PreviousFollowupComments = this.profile.FollowUpComments.trim();
        } else {
            this.profile.CommentsUpdated = false;
        }

        this._profileBankService.editCandidateProfile(this.profile)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this.getCandidateProfileById(this.CandidateID.Value);
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });

    }

    onSavePersonalDetails(): void {
        if (this.profile.PreviousFollowupComments !== this.profile.FollowUpComments.trim().replace(/ +/g, ' ')) {
            this.profile.CommentsUpdated = true;
            this.profile.PreviousFollowupComments = this.profile.FollowUpComments.trim();
        } else {
            this.profile.CommentsUpdated = false;
        }
        this._profileBankService.editCandidatePersonalDetails(this.profile)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this.getCandidateProfileById(this.CandidateID.Value);
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });

    }

    onSaveProfessionalDetails(): void {
        //Check For Comments Updated
        if (this.profile.PreviousFollowupComments !== this.profile.FollowUpComments.trim().replace(/ +/g, ' ')) {
            this.profile.CommentsUpdated = this.profile.CandidateOtherDetails.CommentsUpdated = true;
            this.profile.PreviousFollowupComments = this.profile.CandidateOtherDetails.FollowUpComments
                = this.profile.FollowUpComments.trim();
        } else {
            this.profile.CommentsUpdated = this.profile.CandidateOtherDetails.CommentsUpdated = false;
        }
        this.profile.CandidateOtherDetails.CandidateID = this.CandidateID;
        //Save Data
        this._profileBankService.editCandidateProfessionalDetails(this.profile.CandidateOtherDetails)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this.getCandidateProfileById(this.CandidateID.Value);
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });

    }

    onSaveSkillsDetails() {

        this.profile.CandidateSkills.CandidateID = this.CandidateID;

        if (this.profile.PreviousFollowupComments !== this.profile.FollowUpComments.trim().replace(/ +/g, ' ')) {
            this.profile.CommentsUpdated = this.profile.CandidateSkills.CommentsUpdated = true;
            this.profile.CandidateSkills.FollowUpComments = this.profile.PreviousFollowupComments
                = this.profile.FollowUpComments.trim();
        } else {
            this.profile.CommentsUpdated = this.profile.CandidateSkills.CommentsUpdated = false;
        }
        this._profileBankService.editCandidateSkillsDetails(this.profile.CandidateSkills)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this.getCandidateProfileById(this.CandidateID.Value);
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });

    }

    onSaveTeamManagementDetails(): void {

        if (this.profile.PreviousFollowupComments !== this.profile.FollowUpComments.trim().replace(/ +/g, ' ')) {
            this.profile.CommentsUpdated = this.profile.CandidateTeamManagement.CommentsUpdated = true;
            this.profile.PreviousFollowupComments = this.profile.CandidateTeamManagement.FollowUpComments =
                this.profile.FollowUpComments.trim();
        } else {
            this.profile.CommentsUpdated = this.profile.CandidateTeamManagement.CommentsUpdated = false;
        }
        this.profile.CandidateTeamManagement.CandidateID = this.CandidateID;
        this._profileBankService.editCandidateTeamManagementDetails(this.profile.CandidateTeamManagement)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this.getCandidateProfileById(this.CandidateID.Value);
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });

    }

    /**Function to fetch candidate EXPERIENCE details */
    GetCandidateExperience(candidateID: MasterData) {
        this._profileBankService.getCandidateExperience(candidateID)
            .subscribe(
            results => {
                this.CandidateExperiences = <any>results;
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
    }
    /**Save candidate EXPERIENCE details */
    onSaveCareerProfileDetails(): void {

        if (this.profile.PreviousFollowupComments
            !== this.CandidateExperiences.FollowUpComments
            ? this.CandidateExperiences.FollowUpComments.trim().replace(/ +/g, ' ') : ''
        ) {
            this.profile.CommentsUpdated = this.CandidateExperiences.CommentsUpdated = true;
            // this.profile.PreviousFollowupComments = this.CandidateExperiences.FollowUpComments = this.profile.FollowUpComments.trim();
            this.profile.PreviousFollowupComments = this.CandidateExperiences.FollowUpComments
                = this.CandidateExperiences.FollowUpComments.trim();
        } else {
            this.profile.CommentsUpdated = this.CandidateExperiences.CommentsUpdated = false;
        }
        this.CandidateExperiences.CandidateID = this.CandidateID;
        this._profileBankService.editCandidateCareerDetails(this.CandidateExperiences)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    // this.getCandidateProfileById(this.CandidateID.Value);
                    this.GetCandidateExperience(this.CandidateID);
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            }
            );

    }

    onSaveSalaryDetails(): void {
        if (this.profile.PreviousFollowupComments !== this.profile.FollowUpComments.trim().replace(/ +/g, ' ')) {
            this.profile.CommentsUpdated = this.profile.CandidateSalaryDetails.CommentsUpdated = true;
            this.profile.PreviousFollowupComments = this.profile.CandidateSalaryDetails.FollowUpComments =
                this.profile.FollowUpComments.trim();
        } else {
            this.profile.CommentsUpdated = false;
        }
        this.profile.CandidateSalaryDetails.CandidateID = this.CandidateID;
        this._profileBankService.editCandidateSalaryDetails(this.profile.CandidateSalaryDetails)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this.getCandidateProfileById(this.CandidateID.Value);
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });

    }
    /**START Candidate Employement History functionality (Candidate Employers Information) */
    AddEditEmployerHistory() {
        if (this.EmploymentDetailsAction === 'Add') {
            this.AddEmployersInformation();
        } else if (this.EmploymentDetailsAction === 'Update') {
            this.UpdateEmployersInformation();
        }
    }
    /**Save new employer related information*/
    AddEmployersInformation() {
        var _candidateID = this.CandidateID;
        this.EmployersInformation.CandidateID = _candidateID;
        this._profileBankService.addCandidateEmploymentDetails(this.EmployersInformation)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    /**Bind new data to list */
                    this.GetEmployersInformationList(_candidateID);
                    this.EmployersInformation = new EmploymentHistory();
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
    }
    /**Get selected candidate EmployerInformation for edit*/
    EditEmployerInformation(careerProfileID: string) {
        this.GetEmployersInformation(careerProfileID);
        this.EmploymentDetailsAction = 'Update';
    }
    /**Save new employer related information*/
    UpdateEmployersInformation() {
        this.EmployersInformation.CandidateID = this.CandidateID;
        this._profileBankService.editCandidateEmploymentDetails(this.EmployersInformation)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    /**Bind new data to list */
                    this.GetEmployersInformationList(this.CandidateID);
                    this.EmployersInformation = new EmploymentHistory();
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
    }
    /**Bind candidate's all employment related information */
    GetEmployersInformationList(_candidateID: MasterData) {
        this._profileBankService.getCandidateEmploymentHistory(_candidateID)
            .subscribe(
            results => {
                this.EmployersInformationList = <any>results;
                this.EmploymentDetailsAction = 'Add';
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });

    }
    /**Fetch and bing candidate's selected employment information For Update*/
    GetEmployersInformation(careerProfileID: string) {
        this._profileBankService.getCandidateSelectedEmploymentDetails(careerProfileID)
            .subscribe(
            results => {
                this.EmployersInformation = <any>results;
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
    }
    /**END Candidate Employement History functionality (Candidate Employers Information) */

    onAddQualification(): void {
        this.qualification.CandidateID = this.profile.CandidateID;
        this.qualification.Qualification.Value = this.qualification.Grade.Value = null;
        if (this.selectedQualification !== undefined) {
            this.qualification.Qualification = new MasterData();
            this.qualification.Qualification.Id = this.selectedQualification;
        } else {
            this.qualification.Qualification.Id = this.qualification.Qualification.Id;
        }

        if (this.selectedGrade !== undefined) {
            this.qualification.Grade = new MasterData();
            this.qualification.Grade.Id = this.selectedGrade;
        } else {
            this.qualification.Grade.Id = this.qualification.Grade.Id;
        }

        if (this.params) {
            this._profileBankService.addCandidateQualification(this.qualification)
                .subscribe(
                results => {

                    if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                        this.toastr.success((<ResponseFromAPI>results).Message);
                        this.createQualification();
                        this.IsHidden = true;
                        this.getCandidateQualification();
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

    getCandidateQualification() {
        this._profileBankService.getCandidateQualifications(this.CandidateID.Value)
            .subscribe(
            results => {
                this.profile.CandidateQualification = new Array<Qualification>();
                this.profile.CandidateQualification = <any>results;
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
    }

    editQualidficationData(QID: string) {
        if (this.params) {
            this._profileBankService.getQualificationById(this.CandidateID.Value, QID.toString())
                .subscribe(
                (results: Qualification) => {
                    this.qualification = results;

                    //Show Update button
                    this.IsHidden = false;
                    this.selectedQualification = undefined;
                    this.selectedGrade = undefined;
                },
                error => {
                    this.errorMessage = <any>error;
                    this.toastr.error(<any>error);
                });
        }
    }
    /** START Upload profile photo functionality*/
    /** Function to upload photo */
    uploadPhoto(selectedFile: any) {
        /**selected files string assing to the collection : uploadedPhoto */
        try {
            let FileList: FileList = selectedFile.target.files;
            if (selectedFile.target.files[0].size < 2000000) {
                if (selectedFile.target.files[0].type === "image/jpeg" || selectedFile.target.files[0].type === "image/png" || selectedFile.target.files[0].type === "image/jpg") {
                    if (this.uploadedPhoto)
                        this.uploadedPhoto.length = 0;
                    for (let i = 0, length = FileList.length; i < length; i++) {
                        this.uploadedPhoto.push(FileList.item(i));
                        this.fileUploaded = true;
                        this.fileName = FileList.item(i).name;
                    }
                    this.postPhoto(this.CandidateID, this.uploadedPhoto[0]);
                }
                else {
                    this.toastr.error('Please upload image of type .jpg, .png, .jpeg');
                }
            }
            else {
                this.toastr.error('Please upload image of size less than 2 MB');
            }
        } catch (error) {
            document.write(error);
        }
    }
    /**Remove Candidate photo from data base */
    removePhoto(CandidateID: MasterData) {
        this._profileBankService.removeProfilePhoto(CandidateID)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this.getCandidateProfileById(this.CandidateID.Value);
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
    }

    postPhoto(CandidateID: MasterData, selectedFile: any) {
        if (this.fileName !== '' || this.fileName !== undefined) {

            this.resumeMeta.CandidateID = CandidateID;
            this.resumeMeta.Overwrite = false;
            this.resumeMeta.Profile = selectedFile;
            this._profileBankService.uploadProfilePhoto(this.resumeMeta).then(
                results => {
                    if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                        this.toastr.success((<ResponseFromAPI>results).Message);
                        this.fileUploaded = false;
                        this.fileName = '';
                        this.getProfilePhoto(CandidateID);
                    } else {
                        this.toastr.error((<ResponseFromAPI>results).Message);
                    }
                },
                (error: any) => this.errorMessage = <any>error);
        } else {
            this.toastr.error('No photo found..!');
        }
    }
    /**Get profile photo */
    getProfilePhoto(CandidateID: MasterData) {
        this._profileBankService.getCandidateProfilePhoto(CandidateID)
            .subscribe(
            (results: CandidateProfile) => {
                this.profilePic = results;
            },
            error => {
                this.errorMessage = <any>error;
                this.toastr.error(<any>error);
            });
    }
    /** END Upload profile photo functionality*/

    Back() {
        // this._router.navigate(['/App/ProfileBank/MyProfiles']);
        this._location.back();
    }
}
