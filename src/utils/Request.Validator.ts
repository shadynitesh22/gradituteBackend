import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { ClassConstructor, plainToClass } from "class-transformer";
import { ApiError, BadRequestError, EmptyRequestError, NotFoundError, TooManyRequestsError } from "./ApiError";
import { CreateUserRequest } from "../Validators/CreateUserRequest";
import  ErrorHandler from "../utils/ErrorHandlers";

type ErrorType = typeof ApiError;

export default class RequestValidator {

  static validateLoginRequest = async (req: Request): Promise<void> => {
    const convertedObject = plainToClass(CreateUserRequest, req.body);
    const errors = await validate(convertedObject);
    if (errors.length > 0) {
      let rawErrors: string[] = [];
      for (const errorItem of errors) {
        rawErrors = rawErrors.concat(
          ...Object.values(errorItem.constraints ?? {})
        );
      }
      throw new BadRequestError("Request Validation Failed", rawErrors);
    }
  };

  static validate = <T extends object>(
    classInstance: ClassConstructor<T>,
    ...errorTypes: ErrorType[]
  ) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await RequestValidator.validateLoginRequest(req);

      const convertedObject = plainToClass(classInstance, req.body);
      const errors = await validate(convertedObject);
      if (errors.length > 0) {
        let rawErrors: string[] = [];
        for (const errorItem of errors) {
          rawErrors = rawErrors.concat(
            ...Object.values(errorItem.constraints ?? {})
          );
        }
        const validationErrorText = "Request Validation Failed";
        let error: ApiError;

        for (const errorType of errorTypes) {
          switch (errorType.type) {
            case "bad-req":
              error = new BadRequestError(validationErrorText, rawErrors);
              break;
            case "empty":
              error = new EmptyRequestError();
              break;
            case "too-many-request":
              error = new TooManyRequestsError();
              break;
            case "not-found":
              error = new NotFoundError(req.path);
              break;
            default:
              // Handle any unexpected error types
              break;
          }
          if (error) {
            break;
          }
        }

        if (!error) {
          // Handle case where no matching error type was found
          error = new ApiError(
            "unknown",
            500,
            "Internal Server Error - Unknown Error Type"
          );
        }

       ErrorHandler.handleError(error, req, res, next);
      } else {
        next();
      }
    } catch (error) {
      ErrorHandler.handleError(error, req, res, next);
    }
  };
}
