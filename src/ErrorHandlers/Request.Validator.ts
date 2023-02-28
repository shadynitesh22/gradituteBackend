import { validate } from "class-validator";
import { ClassConstructor, plainToClass } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import {
  ApiError,
  BadRequestError,
  EmptyRequestError,
  NotFoundError,
  TooManyRequestsError,
} from "./ApiError";
import ErrorHandler from "../ErrorHandlers/ErrorHandlers";

type ErrorType = {
  type: string;
  statusCode: number;
  message: string;
};

export default class RequestValidator {
  static validate = <T extends object>(
    classInstance: ClassConstructor<T>,
    ...errorTypes: ErrorType[]
  ) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isRequestEmpty = RequestValidator.checkIfRequestIsEmpty(req);
      if (isRequestEmpty) {
        throw new EmptyRequestError();
      }

      const convertedObject = plainToClass(classInstance, req.body);
      const errors = await validate(convertedObject);
     
      if (errors.length > 0) {
   
        const rawErrors: string[] = [];

        for (const errorItem of errors) {
  
          rawErrors.push(...Object.values(errorItem.constraints ?? {}));
        
        }
        
        const validationErrorText = "Request Validation Failed";
        

        console.log("This error is ignored Why", errors)
        let error: ApiError;

        
        for (const errorType of errorTypes) {
  
      
          switch (errorType.type) {
            case "bad-request":
              error = new BadRequestError(validationErrorText, rawErrors);
              console.log("I'm here ")
              break;
            case "too-many-request":
              error = new TooManyRequestsError();
              break;
            case "not-found":
              error = new NotFoundError(req.path);
              break;
            case "password-format":
              error = new BadRequestError(
                "Password format is not correct",
                []
              );
              break;
            case "invalid-key":
              error = new BadRequestError(
                "Invalid key in request body",
                []
              );
              break;
            default:
              // Handle any unexpected error types
              break;
          }
          if (error) {
            break;
          }
        }

        if (!errors) {
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

  
  static checkIfRequestIsEmpty = (req: Request): boolean => {
    const contentType = req.header("content-type");
    if (
      req.method === "POST" &&
      (!contentType || !contentType.includes("application/json"))
    ) {
      return true;
    }
    const bodyIsEmpty = Object.keys(req.body).length === 0;
    const queryParamsIsEmpty = Object.keys(req.query).length === 0;
    return bodyIsEmpty && queryParamsIsEmpty;
  };
}
