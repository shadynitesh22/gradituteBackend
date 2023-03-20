
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
    statusCode: number;
    type: String;
    rawErrors: string[] = [];
    static type: any;
    
    constructor(type:String,statusCode: number, message: string, rawErrors?: string[],) {
        super(message);

        this.type = type || 'error';
        this.statusCode = statusCode;

        if (rawErrors) this.rawErrors = rawErrors;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class EmptyRequestError extends ApiError {
    constructor() {

        super("bad-request",StatusCodes.BAD_REQUEST, 'Request body is empty!');
    }
}
export class PasswordFormatError extends ApiError {
    constructor() {
        super("Password Formate Wrong",StatusCodes.UNAUTHORIZED, 'Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.');
    }
}
 
export class TooManyRequestsError extends ApiError {
    constructor() {
        super("To-many-request",StatusCodes.TOO_MANY_REQUESTS, 'Too many requests!');
    }
}
export class InvalidKeysError extends ApiError{
    constructor(invalidKeys: string[]) {
        super("invalid-keys",StatusCodes.BAD_REQUEST, `Invalid keys: ${invalidKeys.join(", ")}`);
    }
}

export class NotFoundError extends ApiError {
    constructor(path: string) {
        super("empty-path",StatusCodes.NOT_FOUND, `The requested path ${path} not found!`);
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string, errors: string[]) {
        super("bad-req",StatusCodes.BAD_REQUEST, message, errors);
    }
}


export class UserEmpty extends ApiError {
    constructor() {
        super("empty-user",StatusCodes.BAD_REQUEST, 'User Does not exist!');
    }
}

export class UserExists extends ApiError {
    constructor() {
        super("Duplicate user",StatusCodes.BAD_REQUEST, 'User already exist! Please try another email');
    }
}

export function PasswordFormatter(req:Request) {
    const password = req.body.password;
    
    const passwordRegex =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new PasswordFormatError();

    }else{
     
        return password;
    }

   
    
}

export function UserAlreadyExist(req:Request){
  
    const user = req.body.email;
  
    if (user) {
        throw new UserExists();
          
    }
}

export function checkTooManyRequests(req: any, limit: number, windowsMs: number): void {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const timeStamp = Date.now();
    const timeWindow = timeStamp - windowsMs;
    const requests = requestQueue[ip]?.filter((timeStamp: number)=>timeStamp>timeWindow) || [];
    requestQueue[ip]=requests; 

    if (requests.length >= limit) {
        throw new TooManyRequestsError();
      } else {
        requestQueue[ip].push(timeStamp);
      }
      
}
const requestQueue: {[ip: string]: number[]} = {};