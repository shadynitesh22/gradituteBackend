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
import { CreateUserRequest } from "../Validators/CreateUserRequest";
import { SignUpUserRequest } from "../Validators/SignupUser.request";

type ErrorType = {
  type: string;
  statusCode: number;
  message: string;
};

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
  static validateSignupRequest = async (req: Request): Promise<void> => {
    const convertedObject = plainToClass(SignUpUserRequest, req.body);
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
      const isRequestEmpty = RequestValidator.checkIfRequestIsEmpty(req);
      if (isRequestEmpty) {
        throw new EmptyRequestError();
      }
      
      switch (classInstance) {
        case CreateUserRequest:
          await RequestValidator.validateLoginRequest(req);
          break;
        case SignUpUserRequest:
          await RequestValidator.validateSignupRequest(req);
          break;
        // Add more cases for other request types as needed
      }
      const convertedObject = plainToClass(classInstance, req.body);
      const errors = await validate(convertedObject);
     
      if (errors.length > 0) {
   
        const rawErrors: string[] = [];

        for (const errorItem of errors) {
  
          rawErrors.push(...Object.values(errorItem.constraints ?? {}));
        
        }        
        const validationErrorText = "Request Validation Failed";
        
      
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
