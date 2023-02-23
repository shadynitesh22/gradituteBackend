import { Request, Response, NextFunction } from "express";
import { ApiError, BadRequestError, NotFoundError, TooManyRequestsError, EmptyRequestError } from "./ApiError";

export default class ErrorHandler {
    static handleError(error: ApiError, req: Request, res: Response, next: NextFunction) {
        const { statusCode, message, rawErrors } = error;
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

    static convertError(error: any, req: Request, res: Response, next: NextFunction) {
        let convertedError = error;
        if (!error) {
            convertedError = new EmptyRequestError();
        } else if (!(error instanceof ApiError)) {
            convertedError = new BadRequestError(error.message, [error]);
        }
        next(convertedError);
    }
}
