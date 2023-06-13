import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private fb             = inject(FormBuilder);
  private authService    = inject(AuthService);
  private router         = inject(Router);


  public myForm: FormGroup = this.fb.group({
    email: ['tonovarela@live.com', [Validators.required, Validators.email]],
    password: ['123466', [Validators.required, Validators.minLength(6)]],
  });


  login(){
    
    const {email, password} = this.myForm.value;
    this.authService.login(email,password).subscribe({
      next: (user) => {
        this.router.navigate(['/dashboard']);
        console.log(user);
      },
      error: (message) => {
        Swal.fire('Error', message, 'error');        
      }
    });
  }

}
