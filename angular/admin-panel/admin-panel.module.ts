import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AdminPanelComponent } from './admin-panel.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { LectureComponent } from './lecture/lecture.component';


@NgModule({
  declarations: [
    AdminPanelComponent,
    HomeComponent,
    LectureComponent
  ],
  imports: [
    SharedModule,
    AdminPanelRoutingModule,
    NgbDatepickerModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AdminPanelModule { }
