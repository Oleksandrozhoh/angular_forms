import { NgFor } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {

      // Restore cached email from localStorage if available
      const cachedEmail = window.localStorage.getItem('cached-user-email');
      if (cachedEmail) {
        setTimeout(() => {
        this.form().controls['email'].setValue(cachedEmail)}, 1)
      }

      const subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
        next: (value) => {
          window.localStorage.setItem('cached-user-email', value.email);
        }},
      )

      this.destroyRef.onDestroy(() => {
        subscription?.unsubscribe();
      });
    });
  }

onSubmit(formData: NgForm) {
  if(formData.form.invalid) {
    const enteredEmail = formData.form.value.email;
    const enteredPassword = formData.form.value.password;
    console.log('Email:', enteredEmail);
    console.log('Password:', enteredPassword);
    console.log(formData);
  }

  formData.form.reset();
}



}
