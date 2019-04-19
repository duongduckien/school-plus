import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { GroupComponent } from './group.component';

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
        GroupComponent
    ]
})
export class GroupModule { }
