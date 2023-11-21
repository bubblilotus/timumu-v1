import { FormControl, ValidationErrors } from "@angular/forms";

export class FormValidators {
    //white space validation
    //check falidation, if it fails return validation error
    //else return null
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors{
        if(control.value != null){
            if(control.value.trim().length == 0){
                return {'onlyWhiteSpace': true};
            }
        }
        return null;
    }
}
