import {User} from './user.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class UserService {
  usersChanged = new Subject<User[]>();
  private users: User[] = [];
  constructor(private http:HttpClient, private router: Router,
  private route: ActivatedRoute) {}

  fetchUsers() {
    return this.http
    .get<User[]>(
      'http://139.59.226.52:9876/interview',
      )
    .pipe(
    map(users => {
      return users.map(user => {
        return {...user};
      });
    }),
    tap(users => {
      this.setUsers(users);
    }));
  }

  setUsers(users: User[]) {
    this.users = users;
    this.usersChanged.next(this.users.slice());
  }

  getUsers() {
    return this.users.slice();
  }

  getUser(id: number) {
    for (let user of this.users) {
      if (user.id === id) {
        return user;
      }
    }
  }

  getUserFromList(index: number) {
    return this.users.slice()[index];
  }

  addUser(user: User) {
    this.http.post("http://139.59.226.52:9876/interview",
        {
          "name" : user.name,
          "contact" : user.contact,
          "email" : user.email
        })
        .subscribe(
            (val) => {
                console.log("POST call successful value returned in body", 
                            val);
            },
            response => {
                console.log("POST call in error", response);
            },
            () => {
                console.log("The POST observable is now completed.");
        });
        this.users.push(user);
        this.usersChanged.next(this.users.slice());
  }

  updateUser(index: number, newUser: User) {
    this.router.navigate(['edit'], {relativeTo: this.route});
    const headers = new HttpHeaders()
    .set("Content-Type", "application/json");
    this.http.put("http://139.59.226.52:9876/interview", {
      "id": this.users[index].id,
      "name": newUser.name,
      "contact": newUser.contact,
      "email": newUser.email
    },
    {headers})
    .subscribe(
        val => {
          console.log("PUT call successful value returned in body", 
                      val);
        },
        response => {
          console.log("PUT call in error", response);
        },
        () => {
          console.log("The PUT observable is now completed.");
        }
    );
    this.users[index] = newUser;
    this.usersChanged.next(this.users.slice());
  }

  deleteUser(index: number, id: number) {
    const url = "http://139.59.226.52:9876/interview/" + +id;
    this.http.delete(url)
    .subscribe(
      (val) => {
        console.log("DELETE call successful value returned in body", 
                  val);
      },
    response => {
        console.log("DELETE call in error", response);
    },
    () => {
        console.log("The DELETE observable is now completed.");
    });
    this.users.splice(index, 1);
    this.usersChanged.next(this.users.slice());
  }
}
