import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Pages
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { StatusComponent } from './components/status/status.component';
import { AgentComponent } from './components/agent/agent.component';
import { PupilComponent } from './components/pupil/pupil.component';
import { CodeComponent } from './components/code/code.component';
import { SettingComponent } from './components/setting/setting.component';
import { GroupComponent } from './components/group/group.component';
import { VacationsComponent } from './components/vacations/vacations.component';
import { VacationSettingsComponent } from './components/vacation-settings/vacation-settings.component';
import { ErrorLogsComponent } from './components/error-logs/error-logs.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { PupilDetailComponent } from './components/pupil-detail/pupil-detail.component';
import { MoneyPunishComponent } from './components/money-punish/money-punish.component';

// Guard
import { AuthAdminGuard } from './guards/auth-admin.guard';
import { AuthAccountGuard } from './guards/auth-account.guard';

const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [AuthAccountGuard] },
    {
        path: '', component: HomeComponent, canActivate: [AuthAdminGuard],
        children: [
            { path: 'statistic', component: StatisticComponent },
            { path: 'reports', component: StatusComponent },
            { path: 'groups', component: GroupComponent },
            { path: 'vacations', component: VacationsComponent },
            { path: 'vacation-settings/:key', component: VacationSettingsComponent },
            { path: 'agents', component: AgentComponent },
            { path: 'pupils', component: PupilComponent },
            { path: 'pupil-detail/:id', component: PupilDetailComponent },
            { path: 'code', component: CodeComponent },
            { path: 'money-punish', component: MoneyPunishComponent },
            { path: 'settings', component: SettingComponent },
            { path: 'error-logs', component: ErrorLogsComponent },
            { path: '', redirectTo: 'statistic', pathMatch: 'full' },
            { path: '**', redirectTo: 'statistic', pathMatch: 'full' },
        ]
    },
    // otherwise redirect to status
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
