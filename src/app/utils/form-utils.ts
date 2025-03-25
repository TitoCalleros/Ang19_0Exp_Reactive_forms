import { FormArray, FormGroup, ValidationErrors } from "@angular/forms";

export class FormUtils {

  // Expresiones regulares
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  static isValidField( form: FormGroup, fieldName: string ): boolean | null {
    return (form.controls[fieldName].errors && form.controls[fieldName].touched);
  }

  static getFieldError( form: FormGroup, fieldName: string, errorMessage: string = '' ): string | null {
    if ( !form.controls[fieldName] ) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.processErrors(errors, errorMessage);
  }

  static isValidFieldInArray( formArray: FormArray, index: number): boolean | null {
    return formArray.controls[index].errors && formArray.controls[index].touched;
  }

  static getFieldErrorInArray( formArray: FormArray, index: number ): string | null {
    if ( !formArray.controls[index] ) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.processErrors(errors);
  }


  private static processErrors(errors: ValidationErrors, errorMessage: string = ''): string | null {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'email':
          return 'El formato de email no es válido';

        case 'pattern':
          if ( errors['pattern'].requiredPattern === FormUtils.emailPattern ) {
            return 'El valor ingresado no parece un corro electrónico';
          }
          return 'Error de patrón contra expresión regular';

        default:
          debugger;
          return errorMessage.length === 0 ? `Error de validación no controlado (${key})` : errorMessage;
      }
    }

    return null;
  }
}
