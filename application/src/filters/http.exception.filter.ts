import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger} from "@nestjs/common";
import {Request, Response} from "express";
import {getReasonPhrase} from "http-status-codes";
import {ApiErrorResponse} from "@app/features/base/dtos/api.error.response";
import {EnigmaHttpException} from "@app/exceptions/http.exception";

@Catch(EnigmaHttpException)
export class EnigmaHttpExceptionsFilter<T> implements ExceptionFilter {
    private readonly logger = new Logger(EnigmaHttpExceptionsFilter.name);

    catch(exception: EnigmaHttpException<T>, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();
        const statusCode = exception.getStatus();
        const statusMessage = getReasonPhrase(exception.getStatus());
        const message = exception.message ? exception.message : "An unexpected error occurred. Try again.";
        const data = exception.data ? exception.data : null;
        this.logger.error(`Exception ${JSON.stringify({statusCode, statusMessage, path: request.path, timestamp: new Date().toDateString(), data})}`);
        if (statusCode === HttpStatus.BAD_REQUEST.valueOf()) return response.status(HttpStatus.BAD_REQUEST).json(ApiErrorResponse.badRequest(message, data));
        if (statusCode === HttpStatus.UNAUTHORIZED.valueOf())
            return response.status(HttpStatus.UNAUTHORIZED).json(ApiErrorResponse.unAuthorized(message, data));
        if (statusCode === HttpStatus.FORBIDDEN.valueOf()) return response.status(HttpStatus.FORBIDDEN).json(ApiErrorResponse.forbidden(message, data));
        if (statusCode === HttpStatus.NOT_FOUND.valueOf()) return response.status(HttpStatus.NOT_FOUND).json(ApiErrorResponse.notFound(message, data));
        if (statusCode === HttpStatus.METHOD_NOT_ALLOWED.valueOf())
            return response.status(HttpStatus.METHOD_NOT_ALLOWED.valueOf()).json(ApiErrorResponse.methodNotAllowed(message, data));
        if (statusCode === HttpStatus.REQUEST_TIMEOUT.valueOf())
            return response.status(HttpStatus.REQUEST_TIMEOUT).json(ApiErrorResponse.requestTimeout(message, data));
        if (statusCode === HttpStatus.CONFLICT.valueOf() || exception.message.includes("exists"))
            return response.status(HttpStatus.CONFLICT).json(ApiErrorResponse.conflict(message, data));
        if (statusCode === HttpStatus.PAYLOAD_TOO_LARGE.valueOf())
            return response.status(HttpStatus.PAYLOAD_TOO_LARGE).json(ApiErrorResponse.payloadTooLarge(message, data));
        if (statusCode === HttpStatus.TOO_MANY_REQUESTS.valueOf())
            return response.status(HttpStatus.TOO_MANY_REQUESTS).json(ApiErrorResponse.tooManyRequests(message, data));
        if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR.valueOf())
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiErrorResponse.internalServerError(message, data));
        if (statusCode === HttpStatus.NOT_IMPLEMENTED.valueOf())
            return response.status(HttpStatus.NOT_IMPLEMENTED).json(ApiErrorResponse.notImplemented(message, data));
        if (statusCode === HttpStatus.SERVICE_UNAVAILABLE.valueOf())
            return response.status(HttpStatus.SERVICE_UNAVAILABLE).json(ApiErrorResponse.serviceUnavailable(message, data));
        else return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiErrorResponse.internalServerError(message, data));
    }
}