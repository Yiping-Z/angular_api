import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  @ViewChild('close') close:ElementRef;
  id: number;
  editMode = false;
  userForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
      document.getElementById("openModalButton").click();
  }

  onSubmit() {
    if (this.editMode) {
      this.userService.updateUser(this.id, this.userForm.value);
    } else {
      this.userService.addUser(this.userForm.value);
    }
    this.close.nativeElement.click();
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm() {
    let name = '';
    let contact = '';
    let email = '';

    if (this.editMode) {
      const user = this.userService.getUserFromList(this.id);
      name = user.name;
      contact = user.contact;
      email = user.email;
    }

    this.userForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'contact': new FormControl(contact, Validators.required),
      'email': new FormControl(email, Validators.required),
    });
  }

}
