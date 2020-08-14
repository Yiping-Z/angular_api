import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from "rxjs";
import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {tap, catchError} from 'rxjs/operators';
import { throwError} from 'rxjs';
import * as _ from 'lodash';

interface User {
  name: string;
  contact:string;
  email:string;
}

@Component({
  selector: 'app-users-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})

export class UsersListComponent implements OnInit {
  error$: Observable<any>;
  users: User[];
  token:string;
  response:any;
  subscription: Subscription;

  constructor(private http:HttpClient, private router: Router,
    private route: ActivatedRoute, private userService: UserService) {}
    queryForm: FormGroup;

    ngOnInit() {
      this.subscription = this.userService.usersChanged
      .subscribe(
        (users: User[]) => {
          this.users = users;
        }
      );

      this.userService.fetchUsers().subscribe();
      this.users = this.userService.getUsers();
      this.initForm();
    }

    onAddUser() {
      this.router.navigate(['new'], {relativeTo: this.route});
    }

    getError() {
      this.error$ = this.http
        .get<Error>("http://139.59.226.52:9876/interview/error")
        .pipe(
          catchError(this.handleError));
      this.error$.subscribe();   
    }

    getUser() {
      const url = "http://139.59.226.52:9876/interview/" + this.queryForm.value.id;
      return this.http
      .get<User>(url)
      .pipe(
        catchError(this.handleError))
      .subscribe(resData => {
          alert("User found: \n" + 
          resData.name + " " +
          resData.contact + " " +
          resData.email
          );
      });
    }

    getToken() {
      return this.http
      .get<any>("http://139.59.226.52:9876/interview/token")
      .pipe(
        catchError(this.handleError))
      .subscribe(resData => {
        this.token = resData.token,
        alert("token found: " + resData.token)
      });
    }

    addHeader() {
      const headers = new HttpHeaders()
      .set("token", [this.token]);
      this.http
      .get<any>("http://139.59.226.52:9876/interview/auth", {headers})
      .pipe(
          catchError(this.handleError))
      .subscribe(response => {
          alert(response.message);
          this.response=response.message;
      });
    }

    private initForm() {
      let id = '';
  
      this.queryForm = new FormGroup({
        'id': new FormControl(id, Validators.required),
      });
    }

    onDeleteUser(index: number, id: number) {
      this.userService.deleteUser(index, id);
    }
  
    onUpdateUser(index: number) {
      this.router.navigate([index], {relativeTo: this.route});
    }

    handleError(errorRes: HttpErrorResponse) {
      let errorMessage = 'An unknown error occurred!';
      if (!errorRes.error || !errorRes.error.error) {
        alert(errorMessage);
        return throwError(errorMessage);
      }
      errorMessage = errorRes.error.error;
      alert(errorMessage);
      return throwError(errorMessage);
    }
}


