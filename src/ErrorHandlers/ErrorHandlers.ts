import { Request, Response, NextFunction } from "express";

import { ApiError, BadRequestError, NotFoundError, TooManyRequestsError, EmptyRequestError, UserEmpty, PasswordFormatter } from "./ApiError";

export default class ErrorHandler {

    static handleError(error: ApiError, _req: Request, res: Response, _next: NextFunction) {


        const { statusCode, message, rawErrors } = error;
        let statusCodes = error.statusCode;
        if (typeof statusCode !== 'number') {
            statusCodes = 404;
        }
        res.status(statusCode).json({
            status: 'error',
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
        PasswordFormatter(req.body.password);
        next();

    }

    static userDoseNotExist(req: Request, res: Response, next: NextFunction) {
        const user = req.body.email;
        if (!user) {
            const error = new UserEmpty();
            ErrorHandler.handleError(error, req, res, next);
        }
        next();

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


}
