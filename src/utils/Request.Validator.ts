import {Request,Response, NextFunction} from 'express';

import { ClassConstructor,plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ApiError, BadRequestError, NotFoundError, TooManyRequestsError, EmptyRequestError } from "./ApiError";


export default class RequestValidator {

    static validate = <T extends object>(classInstance:ClassConstructor<T>) =>
    async (req: Request, res: Response, next: NextFunction) => {

        const convertedObject = plainToInstance(classInstance, req.body);
        await validate(convertedObject).then((errors: ValidationError[]) => {
            if(errors.length > 0 ){
                let rawErrors: string[] = [];
                for (const errorItem of errors){
                    rawErrors = rawErrors.concat(...rawErrors, ...Object.values(errorItem.constraints ?? []));
                }
                const validationErrorText= 'Requst Validation Faile';
                next(new BadRequestError(validationErrorText, rawErrors));
            }


        });
        next();
    }
}