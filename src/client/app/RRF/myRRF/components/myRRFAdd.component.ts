import {Component } from '@angular/core';
import { Router, OnActivate, ROUTER_DIRECTIVES, RouteSegment } from '@angular/router';
import {RRFDetails, Panel, IntwRoundSeqData, RRFFeedback } from '../models/rrfDetails';
import { MyRRFService } from '../services/myRRF.service';
import { MastersService } from '../../../shared/services/masters.service';
// import {SelectModule} from 'ng2-select/ng2-select';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { APIResult, RRFStatus, RaiseRRFStatus } from  '../../../shared/constantValue/index';
import { MasterData, ResponseFromAPI } from '../../../shared/model/common.model';
import { TOOLTIP_DIRECTIVES } from 'ng2-bootstrap';
import { DropdownMultiSelectComponent } from '../../../shared/components/dropdownMultiSelect/dropdownMultiSelect.component';

//MultipleDrodown
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {BUTTON_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'rrf-myrrf-add',
    templateUrl: 'myRRFAdd.component.html',
    directives: [ROUTER_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES,
        BUTTON_DIRECTIVES, TOOLTIP_DIRECTIVES, DropdownMultiSelectComponent],
    providers: [ToastsManager]
})

export class MyRRFAddComponent implements OnActivate {


    newRRF: RRFDetails = new RRFDetails();
    panel: Panel = new Panel();
    errorMessage: string = '';
    designations: MasterData[];
    practices: MasterData[];
    technologies: MasterData[];
    skills: MasterData[];
    interviewRound: MasterData[];
    interviewers: MasterData[];
    isNewRRF: boolean = true;
    comment: string;
    IntRoundValue:string;
    practiceSelected : string;
    IntwRound: number = 0;
    priorities: MasterData[];
    updatePanel: boolean = false;
    editPanelData: Panel = new Panel();
    RRFId: MasterData = new MasterData();
    ExpDateOfJoining: any;
    params: string;
    mindate: Date;
    intwRoundSeq: IntwRoundSeqData[] = [];
    RRFStatus: number;
    statusConstanValue: RRFStatus = RRFStatus;
    currentRaiseRRFStatus: number = 0;
    raiseRRFStatus: RaiseRRFStatus = RaiseRRFStatus;
    isDisabled: boolean = false;
    feedbackComment: string = '';
    previousExpectedDateValue: Date;
    navagateBackPath: string = '';
    RoundNDepartment:any={};
    constructor(private _myRRFService: MyRRFService,
        private _router: Router,
        private _mastersService: MastersService,
        public toastr: ToastsManager) {
        // this.newRRF.Panel.push(this.panel);
    }

    routerOnActivate(segment: RouteSegment): void {
        //this.newRRF.Description = 'TO:DO - Will get data from API as per selection of designation';
        window.onbeforeunload = function () {
            return 'Data will be lost if you leave the page, are you sure?';
        };
        this.navagateBackPath = sessionStorage.getItem('navigationPath');
        this.setMinDateToCalender();

        //dropdown with multi selector and search
        $('#cmbInterviewer').select2();
        $('#cmbSkillsReq').select2();


        if (segment.getParam('id') !== undefined) {
            this.params = segment.getParam('id');
            if (this.params) {
                this.RRFId.Value = this.params.split('ID')[0];
                var temp: string = (this.params.split('ID')[1]);
                this.RRFId.Id = parseInt(temp.split('ST')[0]);
                this.RRFStatus = parseInt(temp.split('ST')[1]);

            }
            this.isNewRRF = false;
            if (+this.RRFStatus === +RRFStatus.Rejected) {
                this.GetRRFByIDToReRaiseRRF(this.RRFId);
                this.currentRaiseRRFStatus = RaiseRRFStatus.UpdateRejectedRRF; //Update RRF because it is rejected
            } else {
                this.getRRFByID(this.RRFId);
                if (+this.RRFStatus === +RRFStatus.Open) {
                    this.currentRaiseRRFStatus = RaiseRRFStatus.UpdateForFeedback; //Update RRF because Recruiter head need feedback
                    this.isDisabled = true;
                } else {
                    this.currentRaiseRRFStatus = RaiseRRFStatus.updateRRF; //update RRF before Approve it
                }
            }


        }

        if (this.isNewRRF) {
            this.newRRF.NoOfOpenings = 1;
            this.newRRF.MinExp = 0;
            this.newRRF.MaxExp = 0;
            this.newRRF.Practice.Id = 0;
            this.newRRF.Technology.Id = 0;
            this.newRRF.Priority.Id = 0;
            this.newRRF.Designation.Id = 0;
            this.currentRaiseRRFStatus = RaiseRRFStatus.newRRF;
        }

        this.getDesignation();
        this.getPractice();
        this.getTechnologies();
        this.getSkills();
        this.getInterviewRound();
        //this.getInterviewers();
        this.GetPriority();
        this.getInterviewSeq();
    }

    addPanel(): void {
        var addPanel: Panel = new Panel();
        this.newRRF.Panel.push(addPanel);
    }

    validateForm(): boolean {
        if(this.newRRF.Practice.Id === 0) {
            this.toastr.error('Please select Practice');
            return false;
        }
        if(this.newRRF.Technology.Id === 0) {
            this.toastr.error('Please select Technology');
            return false;
        }
        if(this.newRRF.Designation.Id === 0) {
            this.toastr.error('Please select Designation');
            return false;
        }
        if(this.newRRF.Priority.Id === 0) {
            this.toastr.error('Please select Priority');
            return false;
        }
        if (this.newRRF.Panel.length === 0) {
            this.toastr.error('Please select interview panel Details');
            return false;
        }
        if (this.newRRF.SkillsRequired.length === 0) {
            this.toastr.error('Please select Required skills');
            return false;
        }
        return true;
    }
validate(type: string, number: string) :boolean{
  var result = false;
        switch (type) {
              case 'rrf': if (number.indexOf('\'') >= 0 || number.indexOf('"') >= 0) {
                this.toastr.error('Single quotes and double quotes are not allowed');
              //  this.newRRF.AdditionalRoles='';
              result= false;
            } else {
              result = true;
             //  this.onSaveSalaryDetails();
            }
              break;
      case 'MaxExp':
              if(number !== null){
                if(number <= '60'){
                  result = true;
                  }
                  else{
                    this.newRRF.MaxExp=null;
                    result= false;
                    this.toastr.error('Experiece must be less than 60');
                }
              }
              break;
              case 'MinExp':
              if(number !== null){
                if(number <= '60'){
                  result = true;
                  }
                  else{
                    this.newRRF.MinExp=null;
                    result= false;
                    this.toastr.error('Experiece must be less than 60');
                }
              }
              break;
                  case 'CheckExp':
              if(number.length > 0 && this.newRRF.MaxExp !==null){
                  let abc=this.newRRF.MaxExp.toString();
                if(number <= abc){
                  result = true;
                  }
                  else{
                    result= false;
                    this.toastr.error('Min Experiece must be less than Max Experience');
                }
              }
              break;
        }

              return result;
    }
    raiseRRF(): void {
        if (!this.validateForm()) {
            return;
        }
        if (this.isNewRRF) {
            this.setSkillToObject();
            if (this.newRRF.MinExp <= this.newRRF.MaxExp) {
                this._myRRFService.raiseRRF(this.newRRF)
                    .subscribe(
                    results => {
                        if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                            this.toastr.success((<ResponseFromAPI>results).Message);
                            this._router.navigate([this.navagateBackPath]);
                        } else {
                            this.toastr.error((<ResponseFromAPI>results).Message);
                        }
                    },
                    error => this.errorMessage = <any>error);
            } else {
                this.toastr.error('MinExp should be less than MaxExp');
            }
        }
    }

    reRaiseRRF() {
        if (this.newRRF.MinExp <= this.newRRF.MaxExp) {
            this._myRRFService.reRaiseRRF(this.newRRF)
                .subscribe(
                results => {
                    if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                        this.toastr.success((<ResponseFromAPI>results).Message);
                        this._router.navigate(['/App/RRF/RRFDashboard/']);
                    } else {
                        this.toastr.error((<ResponseFromAPI>results).Message);
                    }
                },
                error => this.errorMessage = <any>error);
        } else {
            this.toastr.error('MinExp should be less than MaxExp');
        }
    }

    updateForFeedback() {
        var rrfFeedback: RRFFeedback = new RRFFeedback();
        rrfFeedback.Feedback = this.feedbackComment;
        rrfFeedback.RRFID = this.newRRF.RRFID;
        rrfFeedback.PreviousValue = this.previousExpectedDateValue;
        rrfFeedback.UpdatedValue = this.newRRF.ExpDateOfJoining;

        this._myRRFService.updateForFeedback(rrfFeedback)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this._router.navigate(['/App/RRF/FeedbackPending/']);
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => this.errorMessage = <any>error);
    }

    onCancelClick(): void {

        let res: any;
        res = confirm(
            'Data will be lost if you leave the page, are you sure?'
        );
        if (res === true) {
            if (+this.currentRaiseRRFStatus === +RaiseRRFStatus.UpdateForFeedback) {
                this._router.navigate(['/App/RRF/FeedbackPending/']);
            } else {
                this._router.navigate([this.navagateBackPath]);
            }
        }

    }

    getDesignation(): void {
        this._mastersService.GetDesignations()
            .subscribe(
            results => {
                this.designations = results;
            },
            error => this.errorMessage = <any>error);
    }

    GetPriority(): void {
        this._mastersService.GetPriority()
            .subscribe(
            results => {
                this.priorities = results;
            },
            error => this.errorMessage = <any>error);
    }

    getPractice(): void {
        this._mastersService.getPractices()
            .subscribe(
            results => {
                this.practices = results;
            },
            error => this.errorMessage = <any>error);
    }

    getTechnologies(): void {
        this._mastersService.getTechnologies()
            .subscribe(
            results => {
                this.technologies = results;
            },
            error => this.errorMessage = <any>error);
    }

    getSkills(): void {
        this._mastersService.getSkills()
            .subscribe(
            results => {
                this.skills = results;
            },
            error => this.errorMessage = <any>error);
    }

    getInterviewSeq() {
        this._myRRFService.intwRoundSeqData()
            .subscribe(
            (results: any) => {
                this.intwRoundSeq = results;
            },
            error => this.errorMessage = <any>error);
    }

    getInterviewRound(): void {
        this._mastersService.getRounds()
            .subscribe(
            results => {
                this.interviewRound = results;
            },
            error => this.errorMessage = <any>error);
    }

    getInterviewers(roundDepartment:any): void {
        this._mastersService.getInterviewerslist(roundDepartment)
            .subscribe(
            results => {
                this.interviewers = results;
            },
            error => this.errorMessage = <any>error);
    }
    getDescription(Designation: string): void {
        this._mastersService.getDescription(Designation)
            .subscribe(
            results => {
                this.newRRF.Description = results?results[0].Description:'NA';
            },
            error => this.errorMessage = <any>error);
    }

    onAddPanel(): void {
        for (var i = 0; i < this.newRRF.Panel.length; i++) {
            if (+this.newRRF.Panel[0].RoundNumber.Id === +this.IntwRound) {
                alert('This interview round is all ready exist.');
                return;
            }
        }
        var panel: Panel = new Panel();
        panel.RoundNumber = this.getStringValue(this.IntwRound, this.interviewRound);
        let Interviewercmb:any = $('#cmbInterviewer');
        if (Interviewercmb.val() !== null) {
            var selectedInterviewer: number[] = Interviewercmb.val();
        }
        for (var index = 0; index < selectedInterviewer.length; index++) {
            panel.Interviewers.push(this.getStringValue(selectedInterviewer[index], this.interviewers));
        }
        this.newRRF.Panel.push(panel);
        this.clearIntwPanel();

    }

    clearIntwPanel() {
        this.IntwRound = 0;
        $('#cmbInterviewer').select2('val', '');
    }
    getStringValue(roundID: number, list: MasterData[]): MasterData {
        for (var index = 0; index < list.length; index++) {
            if (+(list[index].Id) === +(roundID)) {
                return list[index];
            }
        }
        return new MasterData;
    }

    onDropDownValueChanged(Value: number, Id: string) {
        switch (Id) {
            case 'cmbIntwRound':
                break;
            default:
        }
    }

    onPanelEdit(panelData: Panel) {
        this.IntwRound = panelData.RoundNumber.Id;
        var panelId: string[] = new Array();
        for (var index = 0; index < panelData.Interviewers.length; index++) {
            panelId.push((panelData.Interviewers[index].Id).toString());
        }
        $('#cmbInterviewer').select2('val', panelId);
        this.editPanelData = panelData;
        this.IntwRound = panelData.RoundNumber.Id;
        this.updatePanel = true;
        this.getList();
    }

    onPanelCancel() {
        this.updatePanel = false;
        this.clearIntwPanel();
    }

    onUpdatePanelClick() {
        this.editPanelData.RoundNumber = this.getStringValue(this.IntwRound, this.interviewRound);
        let Interviewercmb:any = $('#cmbInterviewer');
        if (Interviewercmb.val() !== null) {
            var selectedInterviewer: number[] = Interviewercmb.val();
        }
        this.editPanelData.Interviewers = new Array();
        for (var index = 0; index < selectedInterviewer.length; index++) {
            this.editPanelData.Interviewers.push(this.getStringValue(selectedInterviewer[index], this.interviewers));
        }

        this.updatePanel = false;
        this.clearIntwPanel();
    }

    onPanelDelete(panelData: Panel) {
        for (var i = 0; i < this.newRRF.Panel.length; i++) {
            if (+this.newRRF.Panel[i].RoundNumber.Id === +panelData.RoundNumber.Id) {
                this.newRRF.Panel.splice(i, 1);
            }
        }
        this.updatePanel = false;
        this.clearIntwPanel();

    }

    getRRFByID(rrfId: MasterData) {
        this._myRRFService.getRRFByID(rrfId.Value)
            .subscribe(
            (results: RRFDetails) => {
                this.newRRF = results;
                this.ExpDateOfJoining = this.formatDate(results.ExpDateOfJoining);
                this.newRRF.ExpDateOfJoining = this.ExpDateOfJoining;
                this.previousExpectedDateValue = this.ExpDateOfJoining;
                this.setSkillDropdown();
            },
            error => this.errorMessage = <any>error);
    }

    GetRRFByIDToReRaiseRRF(rrfId: MasterData) {
        this._myRRFService.getRRFByIDToReRaiseRRF(rrfId.Value)
            .subscribe(
            (results: RRFDetails) => {
                this.newRRF = results;
                this.ExpDateOfJoining = this.formatDate(results.ExpDateOfJoining);
                this.newRRF.ExpDateOfJoining = this.ExpDateOfJoining;
                this.previousExpectedDateValue = this.ExpDateOfJoining;
                this.setSkillDropdown();
            },
            error => this.errorMessage = <any>error);
    }

    setSkillDropdown() {
        //empty blolck
    }

    setSkillToObject() {
        //empty blolck
    }

    onUpdateClick() {
        if (!this.validateForm()) {
            return;
        }

        this.setSkillToObject();
        this._myRRFService.UpdateRRF(this.newRRF)
            .subscribe(
            results => {
                if ((<ResponseFromAPI>results).StatusCode === APIResult.Success) {
                    this.toastr.success((<ResponseFromAPI>results).Message);
                    this._router.navigate(['/App/RRF/RRFDashboard/']);
                } else {
                    this.toastr.error((<ResponseFromAPI>results).Message);
                }
            },
            error => this.errorMessage = <any>error);
    }
getFromLinkUpSkills(){
        this._myRRFService.getLinkUpSkills()
            .subscribe(
            (results: any) => {
             this.toastr.success((<ResponseFromAPI>results).Message);
             this.getSkills();
            },
            error => this.errorMessage = <any>error);
    }
    formatDate(date: any) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    setMinDateToCalender() {
        var todayDate = new Date();
        this.mindate = (<any>this.formatDate(todayDate));
    }

    submitForm() {
        if (+this.currentRaiseRRFStatus === +RaiseRRFStatus.newRRF) {

          if(this.validate('rrf',this.newRRF.AdditionalRoles) && this.validate('rrf',this.newRRF.PreferredSkills) && this.validate('rrf',this.newRRF.QualCertRquired) && this.validate('CheckExp','this.newRRF.MinExp') )
            {
              this.raiseRRF();
            }

        } else if (+this.currentRaiseRRFStatus === +RaiseRRFStatus.updateRRF) {
            var minexp=this.newRRF.MinExp.toString();
            if(this.validate('rrf',this.newRRF.PreferredSkills) && this.validate('rrf',this.newRRF.QualCertRquired) && this.validate('CheckExp',minexp) )
            {
              this.onUpdateClick();
            }
            
        } else if (+this.currentRaiseRRFStatus === +RaiseRRFStatus.UpdateRejectedRRF) {
            this.reRaiseRRF();
        } else if (+this.currentRaiseRRFStatus === +RaiseRRFStatus.UpdateForFeedback) {
            this.updateForFeedback();
        }
    }
ClearInterviewer(){
   this.IntwRound=null;
   this.interviewers=null;
}
    getList(){
 for(var i = 0; i < this.interviewRound.length; i++){
        if(this.IntwRound == this.interviewRound[i].Id){
            this.IntRoundValue=this.interviewRound[i].Value;
        }
      }
      for(var j=0;j<this.practices.length;j++){
        var abc=this.newRRF.Practice.Id ;
        if(abc == this.practices[j].Id){
            this.practiceSelected =this.practices[j].Value;
        }
      }
      if(this.IntRoundValue !== null && this.practiceSelected !== null && this.practiceSelected !== undefined){
        this.RoundNDepartment.Round=this.IntRoundValue;
        this.RoundNDepartment.Department=this.practiceSelected;
        // {"RoundNDepartment":{"Round":"additional","Department":"EGS"}}
       this.getInterviewers(this.RoundNDepartment);
      //  console.log(this.RoundNDepartment);
      }
      else{
        if(this.practiceSelected !== null){
          this.IntwRound=null;
          this.interviewers=null;
          alert("Please Select Practice to get related Panel list.");
        }
        else{
        alert("Please Select Interview Round to get related Panel list.");
        }

      }
    }
    InterviewRoundSelected() {

this.getList();


        //Get Interview Type and Sequence of selected Round
        var intType: number = 0;
        var seq: number = 0;
        for (var index = 0; index < this.intwRoundSeq.length; index++) {
            if (+this.intwRoundSeq[index].InterviewRound.Id === +this.IntwRound) {
                intType = this.intwRoundSeq[index].InterviewType.Id;
                seq = this.intwRoundSeq[index].Sequence;
            }
        }

        //Get all record of above interview type
        var interviewType: IntwRoundSeqData[] = this.intwRoundSeq.filter(temp => (temp.InterviewType.Id === intType));

        for (var i = 0; i < interviewType.length; i++) {
            if (interviewType[i].Sequence < seq) {
                //check is this round is already selected
                var isPresent: boolean = false;
                var interviewId: number = interviewType[i].InterviewRound.Id;

                for (var j = 0; j < this.newRRF.Panel.length; j++) {
                    if (+interviewId === +this.newRRF.Panel[j].RoundNumber.Id) {
                        isPresent = true;
                    }
                }

                if (!isPresent) {
                    this.IntwRound = 0;
                    this.toastr.error('Please select Interview Round in sequence');
                    break;
                }

            }
        }

    }



}
