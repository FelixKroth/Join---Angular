import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactComponent } from './contact/contact.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { SummaryComponent } from './summary/summary.component';
import { LoginComponent } from './login/login.component'; // Import the LoginComponent
import { AuthGuard } from './services/auth.guard'; // Import AuthGuard
import { ImprintComponent } from './shared/imprint/imprint.component';
import { PrivacyComponent } from './shared/privacy/privacy.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Login route without guard

  // Protect these routes with AuthGuard
  { path: 'summary', component: SummaryComponent, canActivate: [AuthGuard] },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'add-task', component: AddTaskComponent, canActivate: [AuthGuard] },
  { path: 'board', component: BoardComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: 'contact/:id', component: ContactDetailComponent, canActivate: [AuthGuard] },

  // Redirect root to summary if authenticated, otherwise to login
  { path: '', pathMatch: 'full', redirectTo: 'summary' },
  { path: '**', redirectTo: 'summary' }, // Wildcard route for handling unknown paths
];
