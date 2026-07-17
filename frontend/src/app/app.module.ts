import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MeetingsComponent } from './meetings/meetings.component';
import { MeetingDetailComponent } from './meeting-detail/meeting-detail.component';

const routes: Routes = [
    {
        path: 'meetings',
        component: MeetingsComponent,
    },
    {
        path: 'meetings/:id',
        component: MeetingDetailComponent,
    },
    {
        path: '',
        redirectTo: 'meetings',
        pathMatch: 'full',
    },
];

@NgModule({
    declarations: [AppComponent, MeetingsComponent, MeetingDetailComponent],
    imports: [BrowserModule, HttpClientModule, FormsModule, RouterModule.forRoot(routes)],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
