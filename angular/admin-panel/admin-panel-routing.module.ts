import { AuthGuard, PermissionGuard } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../admin-panel/home/home.component';
import { AdminPanelComponent } from './admin-panel.component';
import { LectureComponent } from './lecture/lecture.component';



const routes: Routes = [
  {
    path: '',
    component:AdminPanelComponent,
    canActivate: [AuthGuard, PermissionGuard],
    children: [
      {
        path:'',
        pathMatch:'full',
        redirectTo:"home",
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'lecture',
        component: LectureComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
