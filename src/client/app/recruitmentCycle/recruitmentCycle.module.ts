import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { InterviewSlotComponent, IEFFunctionComponent, IEFGridRowComponent, InterviewDetailsRowComponent } from './shared/index';
import { FullCalendarComponent } from '../shared/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AllScheduleInterviewPipe } from './recruitersTab/index';
import { MastersService } from '../shared/index';
import { InterviewApprovalGridRowComponent } from './shared/index';
import { RecruitmentInterviewScheduleComponent
        , RecruitmentInterviewerCalenderComponent
        , RecruitmentInterviewAvailabilityComponent
         } from './interviewersTab/index';
//import { RecruitmentIEFComponent } from './shared/index';
@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    InterviewSlotComponent
    , FullCalendarComponent
    , InterviewDetailsRowComponent
    , IEFGridRowComponent
    //, InterviewApprovalGridRowComponent
    , IEFFunctionComponent
    , RecruitmentInterviewScheduleComponent
    , RecruitmentInterviewerCalenderComponent
    , RecruitmentInterviewAvailabilityComponent
    //, RecruitmentIEFComponent
  ],
  exports: [
    InterviewSlotComponent
    , FullCalendarComponent
    , InterviewDetailsRowComponent
    , IEFGridRowComponent
    //, InterviewApprovalGridRowComponent
    , IEFFunctionComponent
    //, AllScheduleInterviewPipe
    , RecruitmentInterviewScheduleComponent
  ],
  providers: [ToastsManager, MastersService]
})
export class RecruitmentCycleModule { }
