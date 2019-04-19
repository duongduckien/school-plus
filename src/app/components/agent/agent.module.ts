import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { AgentComponent } from './agent.component';
import { AgentModalComponent } from './agent-modal/agent-modal.component';
import { AgentListViewComponent } from './agent-list-view/agent-list-view.component';

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
        AgentComponent,
        AgentModalComponent,
        AgentListViewComponent
    ]
})
export class AgentModule { }
