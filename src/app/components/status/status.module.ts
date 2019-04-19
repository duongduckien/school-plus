import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

// Components
import { StatusComponent } from './status.component';

// Shared
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forChild(),
        SharedModule
    ],
    declarations: [
        StatusComponent
    ],
    providers: [
        ConfirmationService
    ]
})
export class StatusModule { }
