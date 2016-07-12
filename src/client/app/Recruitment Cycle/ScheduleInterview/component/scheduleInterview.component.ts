import {Component} from '@angular/core';
import { Routes, ROUTER_DIRECTIVES } from '@angular/router';
import {ScheduleCandidateInterviewComponent} from './scheduleCandidateInterview.component';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {CalendarDataService} from '../service/calendarDataService';

@Component({
    selector: 'schedule-interviewer',
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES],
    providers: [ToastsManager,CalendarDataService],

})

@Routes([
    { path: '/', component: ScheduleCandidateInterviewComponent }
])
export class ScheduleInterviewComponent {
}