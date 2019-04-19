import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { PupilComponent } from './pupil.component';
import { PupilListViewComponent } from './pupil-list-view/pupil-list-view.component';
import { PupilModalComponent } from './pupil-modal/pupil-modal.component';
import { PupilPrintComponent } from './pupil-print/pupil-print.component';

// Shared
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        TranslateModule.forChild()
    ],
    declarations: [
        PupilComponent,
        PupilListViewComponent,
        PupilModalComponent,
        PupilPrintComponent
    ]
})
export class PupilModule { }
