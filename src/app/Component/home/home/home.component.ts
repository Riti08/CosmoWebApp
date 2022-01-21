import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/Services';
import { UserService } from 'src/app/Services/Userservice/userservice/user.service';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  loading = false;
  currentUser: User;
  userFromApi!: User;
  id!: number;
  userid: any = localStorage.getItem('currentUser');
  isLoggedIn$!: Observable<boolean>; // {1}
  //isLoggedIn$?: boolean;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }

  ngOnInit() {
    this.loading = true;
    this.isLoggedIn$ = this.authenticationService.isLoggedIn; // {2}
    //const user = this.currentUser;
    const user = this.currentUser;
    this.router.navigateByUrl('/NurseDashboard');
    // if (user.role == 'Admin') {
    //   this.router.navigateByUrl('/AdminDashboard');
    // } else if (user.role == 'Physician') {
    //   this.router.navigateByUrl('/');
    // } else if (user.role == 'Patient') {
    //   this.router.navigateByUrl('/PatientDashboard');
    // } else if (user.role == 'Nurse') {
    //   this.router.navigateByUrl('/NurseDashboard');
    // }
  }
  getuserbyId() {
    this.userService
      .getById(this.userid)
      .pipe(first())
      .subscribe((user) => {
        this.loading = false;
        this.userFromApi = user;
      });
  }
}
