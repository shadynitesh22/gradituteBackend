import { IsDefined } from "class-validator";

export class CreateUserRequest {
    @IsDefined()
    email?: string;

    password?: string;
}