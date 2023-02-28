import { IsDefined } from "class-validator";

export class CreateUserRequest {
    @IsDefined()
    firstName: string = '';
    @IsDefined()
    LastName?: string;
    @IsDefined()
    email?: string;
    @IsDefined()
    pasword?: string;
}
