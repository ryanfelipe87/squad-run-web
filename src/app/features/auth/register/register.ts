import { Component, ChangeDetectorRef  } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceTs } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

// Validator customizado: confirma se senha e password_confirmation batem
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmation = control.get('password_confirmation')?.value;
  return password === confirmation ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  form: FormGroup;
  loading = false;

  // Erros gerais (ex: "Erro interno")
  globalError = '';

  // Erros por campo vindos do Laravel (errors.campo[])
  fieldErrors: Record<string, string[]> = {};

  constructor(private fb: FormBuilder, private auth: AuthServiceTs, private router: Router, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
      role: ['participant', Validators.required]   // enum: 'organizator' | 'participant'
    }, { validators: passwordMatchValidator });
  }

  // Helpers para o template
  hasFieldError(field: string): boolean {
    return !!this.fieldErrors[field]?.length;
  }

  getFieldError(field: string): string {
    return this.fieldErrors[field]?.[0] ?? '';
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.globalError = '';
    this.fieldErrors = {};

    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.loading = false;
        const body = err.error;

        if (body?.errors) {
          // Erros de validação campo a campo do Laravel (422)
          this.fieldErrors = body.errors;
        } else {
          // Erro genérico (400, 500)
          this.globalError = body?.message || 'Erro ao criar conta. Tente novamente.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
