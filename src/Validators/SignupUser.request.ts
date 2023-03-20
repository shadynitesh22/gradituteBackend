import { IsDefined } from "class-validator";

export class SignUpUserRequest {
    @IsDefined()    
    email?: string;
    @IsDefined()
    password?: string;
    @IsDefined()
    firstName: string;
    @IsDefined()
    lastName?: string;
    
    
}
