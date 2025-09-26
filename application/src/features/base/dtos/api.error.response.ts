import {ApiProperty} from "@nestjs/swagger";
import {getReasonPhrase, StatusCodes} from "http-status-codes";
import {HttpStatus} from "@nestjs/common";

export class ApiErrorResponse<T> {
    private static instance: ApiErrorResponse<any>;
    @ApiProperty({type: Number, name: "statusCode", description: "The status code of the response.", example: 200, nullable: false})
    readonly statusCode: number;
    @ApiProperty({
        type: String,
        name: "statusMessage",
        description: "The status message of the response.",
        example: getReasonPhrase(HttpStatus.OK),
        nullable: false,
    })
    readonly statusMessage: string;
    @ApiProperty({type: Number, name: "message", description: "The message to the client", example: "Data fetched successfully.", nullable: false})
    readonly message: string;
    @ApiProperty({type: Object, name: "data", description: "The data the client requested.", example: null, nullable: true})
    readonly data: T;

    private constructor(statusCode: number, statusMessage: string, message: string, data: T) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.message = message;
        this.data = data;
    }

    static getInstance<T>(): ApiErrorResponse<T | null> {
        if (!ApiErrorResponse.instance) {
            ApiErrorResponse.instance = new ApiErrorResponse<T | null>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                getReasonPhrase(HttpStatus.INTERNAL_SERVER_ERROR),
                "An unexpected error occurred.",
                null,
            );
        }
        return ApiErrorResponse.instance as ApiErrorResponse<T | null>;
    }

    static badRequest<T>(message: string, data: T): ApiErrorResponse<T> {
        return new ApiErrorResponse<T>(StatusCodes.BAD_REQUEST, getReasonPhrase(StatusCodes.BAD_REQUEST), message, data);
    }

    static unAuthorized<T>(message: string, data: T): ApiErrorResponse<T> {
        return new ApiErrorResponse<T>(StatusCodes.UNAUTHORIZED, getReasonPhrase(StatusCodes.UNAUTHORIZED), message, data);
    }

    static forbidden<T>(message: string, data: T): ApiErrorResponse<T> {
        return new ApiErrorResponse<T>(StatusCodes.FORBIDDEN, getReasonPhrase(StatusCodes.FORBIDDEN), message, data);
    }

    static notFound<T>(message: string, data: T): ApiErrorResponse<T> {
        return new ApiErrorResponse<T>(StatusCodes.NOT_FOUND, getReasonPhrase(StatusCodes.NOT_FOUND), message, data);
    }

    static methodNotAllowed<T>(message: string, data: T): ApiErrorResponse<T> {
        return new ApiErrorResponse<T>(StatusCodes.METHOD_NOT_ALLOWED, getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED), message, data);
    }

    static requestTimeout<T>(message: string, data: T): ApiErrorResponse<T> {
        return new ApiErrorResponse<T>(StatusCodes.REQUEST_TIMEOUT, getReasonPhrase(StatusCodes.REQUEST_TIMEOUT), message, data);
    }

    static conflict<T>(message: string, data: T): ApiErrorResponse<T> {
        return new ApiErrorResponse<T>(StatusCodes.CONFLICT, getReasonPhrase(StatusCodes.CONFLICT), message, data);
    }

    static payloadTooLarge<T>(message: string, data: T): ApiErrorResponse<T> {
        return new ApiErrorResponse<T>(HttpStatus.PAYLOAD_TOO_LARGE, getReasonPhrase(HttpStatus.PAYLOAD_TOO_LARGE), message, data);
    }

    static tooManyRequests<T>(message: string, data: T): ApiErrorResponse<T> {
        return new ApiErrorResponse<T>(StatusCodes.TOO_MANY_REQUESTS, getReasonPhrase(StatusCodes.TOO_MANY_REQUESTS), message, data);
    }

    static internalServerError<T>(message: string, data: T): ApiErrorResponse<T> {
        return new ApiErrorResponse<T>(StatusCodes.INTERNAL_SERVER_ERROR, getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR), message, data);
    }

    static notImplemented<T>(message: string, data: T): ApiErrorResponse<T> {
        return new ApiErrorResponse<T>(StatusCodes.NOT_IMPLEMENTED, getReasonPhrase(StatusCodes.NOT_IMPLEMENTED), message, data);
    }

    static serviceUnavailable<T>(message: string, data: T): ApiErrorResponse<T> {
        return new ApiErrorResponse<T>(StatusCodes.SERVICE_UNAVAILABLE, getReasonPhrase(StatusCodes.SERVICE_UNAVAILABLE), message, data);
    }
}