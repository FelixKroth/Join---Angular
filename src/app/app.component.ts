// app.component.ts
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable, of, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  isAuthenticated$: Observable<boolean>;
  shouldShowContent = false;
  userInitials$: Observable<{ initials: string; color: string } | null> = of(null);
  showAnimation = true;

  @ViewChild('logoContainer', { static: false }) logoContainer!: ElementRef;

  constructor(
    public router: Router,
    private authService: AuthService,
    private firestore: Firestore
  ) {
    // Observing auth state to set shouldShowContent based on user login state
    this.isAuthenticated$ = this.authService.getAuthState().pipe(map((user) => !!user));
    this.checkShouldShowContent();
    this.userInitials$ = this.authService.getAuthState().pipe(
      switchMap((user: any) => {
        if (user) {
          return this.fetchUserInitials(user.uid);
        } else {
          return of(null);
        }
      }),
      catchError((error) => {
        console.error("Error fetching user initials:", error);
        return of(null);
      })
    );
  }

  ngAfterViewInit() {
    // Delay added to control the timing of animation
    setTimeout(() => {
      if (this.logoContainer && this.logoContainer.nativeElement) {
        console.log("Starting animation...");
        this.logoContainer.nativeElement.classList.add('animate');
      }
      this.showAnimation = false;
    }, 2000); // Animation duration
  }

  checkShouldShowContent() {
    // Subscribe to auth state and update content visibility
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      this.shouldShowContent = isAuthenticated && !this.router.url.includes('/login');
      if (!isAuthenticated) {
        this.router.navigate(['/login']);
      }
    });
    this.router.events.subscribe(() => {
      this.isAuthenticated$.subscribe((isAuthenticated) => {
        this.shouldShowContent = isAuthenticated && !this.router.url.includes('/login');
      });
    });
  }

  fetchUserInitials(uid: string): Observable<{ initials: string; color: string } | null> {
    const docRef = doc(this.firestore, 'users', uid);
    return from(getDoc(docRef)).pipe(
      map((docSnap: any) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const firstName = data['firstName'] || '';
          const lastName = data['lastName'] || '';
          const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
          const userColor = data['color'];
          return { initials, color: userColor };
        } else {
          return null;
        }
      }),
      catchError((error) => {
        console.error('Error fetching document:', error);
        return of(null);
      })
    );
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => console.error('Logout error:', error));
  }
}
