import { IsDefined } from "class-validator";

export class CreateUserRequest {
    @IsDefined()
    firstName: string = '';

    LastName?: string;

    email?: string;

    pasword?: string;
}
