
import { StatusCodes } from 'http-status-codes';


export class ApiError extends Error {
    statusCode: number;
    rawErrors: string[] = [];
    constructor(statusCode: number, message: string, rawErrors?: string[]) {
        super(message);

        this.statusCode = statusCode;
        if (rawErrors) this.rawErrors = rawErrors;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class EmptyRequestError extends ApiError {
    constructor() {
        super(StatusCodes.BAD_REQUEST, 'Request body is empty!');
    }
}

export class TooManyRequestsError extends ApiError {
    constructor() {
        super(StatusCodes.TOO_MANY_REQUESTS, 'Too many requests!');
    }
}

export class NotFoundError extends ApiError {
    constructor(path: string) {
        super(StatusCodes.NOT_FOUND, `The requested path ${path} not found!`);
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string, errors: string[]) {
        super(StatusCodes.BAD_REQUEST, message, errors);
    }
}

export function checkEmptyRequest(req: any): void {
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new EmptyRequestError();
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