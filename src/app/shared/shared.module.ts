import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';

// Primeng
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { GrowlModule } from 'primeng/growl';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ChartModule } from 'primeng/chart';

// Components
import { LoadingComponent } from '../components/loading/loading.component';

// Pipes
import { SortDataPipe } from '../pipes/sort-data/sort-data.pipe';
import { SearchTextPipe } from '../pipes/search-text/search-text.pipe';
import { PupilSearchPipe } from '../pipes/pupil-search/pupil-search.pipe';
import { StatusFilterPipe } from '../pipes/status-filter/status-filter.pipe';
import { StatusCalculateTotalMoneyAfterFilterPipe } from '../pipes/status-calculate-total-money-after-filter/status-calculate-total-money-after-filter.pipe';
import { PupilFilterGroupPipe } from '../pipes/pupil-filter-group/pupil-filter-group.pipe';
import { PupilFilterAgentPipe }  from '../pipes/pupil-filter-agent/pupil-filter-agent.pipe';
import { PupilSortPipe } from '../pipes/pupil-sort/pupil-sort.pipe';
import { StatusSearchPipe } from '../pipes/status-search/status-search.pipe';
import { StatusSortPipe } from '../pipes/status-sort/status-sort.pipe';
import { SearchVacationPipe } from '../pipes/search-vacation/search-vacation.pipe';
import { SearchGroupPipe } from '../pipes/search-group/search-group.pipe';

@NgModule({
    imports: [
        CommonModule,
        CalendarModule,
        CheckboxModule,
        InputSwitchModule,
        GrowlModule,
        ConfirmDialogModule,
        TooltipModule,
        TableModule,
        DropdownModule,
        OverlayPanelModule,
        QRCodeModule,
        ChartModule
    ],
    declarations: [
        SortDataPipe,
        SearchTextPipe,
        PupilSearchPipe,
        StatusFilterPipe,
        StatusCalculateTotalMoneyAfterFilterPipe,
        PupilFilterGroupPipe,
        PupilFilterAgentPipe,
        PupilSortPipe,
        StatusSearchPipe,
        StatusSortPipe,
        SearchVacationPipe,
        SearchGroupPipe,
        LoadingComponent
    ],
    exports: [
        SortDataPipe,
        SearchTextPipe,
        PupilSearchPipe,
        StatusFilterPipe,
        StatusCalculateTotalMoneyAfterFilterPipe,
        PupilFilterGroupPipe,
        PupilFilterAgentPipe,
        PupilSortPipe,
        StatusSearchPipe,
        StatusSortPipe,
        SearchVacationPipe,
        SearchGroupPipe,
        LoadingComponent,
        CalendarModule,
        CheckboxModule,
        InputSwitchModule,
        GrowlModule,
        ConfirmDialogModule,
        TooltipModule,
        TableModule,
        DropdownModule,
        OverlayPanelModule,
        QRCodeModule,
        ChartModule
    ]
})
export class SharedModule { }
