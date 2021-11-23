// tutorial: https://morioh.com/p/18976817e1a7

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  ionicForm: FormGroup;
  isSubmitted = false;


  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    const that = this;
    this.ionicForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
      // email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]]
    })
    // this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  /** */
  // ngAfterViewInit(){
  //   //this.router.navigateByUrl('/home', { replaceUrl: true });
  // }

  ionViewWillEnter(){
    console.log('ionViewWillEnter');
    this.logout();
  }
  

  get errorControl() {
    return this.ionicForm.controls;
  }


  /** */
  submitForm() {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      console.log(this.ionicForm.value.username);
      console.log(this.ionicForm.value.password);
      this.authenticationService.login(this.ionicForm.value.username, this.ionicForm.value.password);
    }
  }


  /** */
  logout() {
    console.log('logout');
    this.authenticationService.logout();
  }


}
