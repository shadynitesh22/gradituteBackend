import { Request, Response, NextFunction } from "express";
import { type } from "os";

import { ApiError, BadRequestError, NotFoundError, TooManyRequestsError, EmptyRequestError, UserEmpty, PasswordFormatter,  UserExists, PasswordFormatError } from "./ApiError";

export default class ErrorHandler {

    static handleError(error: ApiError, _req: Request, res: Response, _next: NextFunction) {

        
        const { type,statusCode, message, rawErrors } = error;
        let statusCodes = error.statusCode;
        if (typeof statusCode !== 'number') {
            statusCodes = 404;
        }
        res.status(statusCode).json({
            status: type,
            error: {
                code: statusCode,
                message,
                errors: rawErrors
            }
        });
    }

    static notFound(req: Request, res: Response, next: NextFunction) {
        const error = new NotFoundError(req.path);
        ErrorHandler.handleError(error, req, res, next);
    }

    static tooManyRequests(req: Request, res: Response, next: NextFunction) {
        const error = new TooManyRequestsError();
        ErrorHandler.handleError(error, req, res, next);
    }

    static emptyRequest(req: Request, res: Response, next: NextFunction) {
        const error = new EmptyRequestError();
        ErrorHandler.handleError(error, req, res, next);
    }

    static passwordFormat(req: Request, res: Response, next: NextFunction) {
        
        const error = PasswordFormatter(req);
        ErrorHandler.handleError(error, req, res, next);
      

    }

    static userDoseNotExist(req: Request, res: Response, next: NextFunction) {
            const error = new UserEmpty();
            ErrorHandler.handleError(error, req, res, next);


    }

    static convertError(error: any, _req: Request, _res: Response, next: NextFunction) {
        let convertedError = error;
        if (!error) {
            convertedError = new EmptyRequestError();
        } else if (!(error instanceof ApiError)) {
            convertedError = new BadRequestError(error.message || 'An unknown error occurred', [error]);
        }
        next(convertedError);
    }

    static UserExists(req: Request, res: Response, next: NextFunction) {
        const error = new UserExists();
        ErrorHandler.handleError(error, req, res, next);
 
    }

}
