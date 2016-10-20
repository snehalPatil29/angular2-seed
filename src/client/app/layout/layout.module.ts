import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SpinnerComponent, SpinnerService, MastersService } from '../shared/index';
import { TopNavigationBarComponent, SideBarComponent, QuickSidebarComponent } from '../layout/index';
import { ToDoListService } from './index';
import { ProfileBankService } from '../profileBank/index';
import { IfAuthorizeDirective } from '../shared/index';
@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [
        TopNavigationBarComponent
        , SideBarComponent
        , QuickSidebarComponent
        , SpinnerComponent
        , IfAuthorizeDirective
    ],
    exports: [
        TopNavigationBarComponent
        , SideBarComponent
        , IfAuthorizeDirective
        , QuickSidebarComponent
        , SpinnerComponent
    ],
    providers: [ProfileBankService, ToDoListService, SpinnerService, MastersService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule { }