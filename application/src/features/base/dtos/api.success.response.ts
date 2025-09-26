import {ApiProperty} from "@nestjs/swagger";
import {getReasonPhrase, StatusCodes} from "http-status-codes";
import {HttpStatus} from "@nestjs/common";

export class ApiSuccessResponse<T> {
    private static instance: ApiSuccessResponse<any>;
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
    @ApiProperty({name: "data", description: "The data the client requested.", example: null, nullable: true})
    readonly data: T | null;

    private constructor(statusCode: number, statusMessage: string, message: string, data: T | null = null) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.message = message;
        this.data = data;
    }

    static getInstance<T>(): ApiSuccessResponse<T | null> {
        if (!ApiSuccessResponse.instance) {
            ApiSuccessResponse.instance = new ApiSuccessResponse<T | null>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                getReasonPhrase(HttpStatus.INTERNAL_SERVER_ERROR),
                "An unexpected error occurred.",
                null,
            );
        }
        return ApiSuccessResponse.instance as ApiSuccessResponse<T | null>;
    }

    static ok<T>(message: string, data: T | null = null): ApiSuccessResponse<T> {
        return new ApiSuccessResponse<T>(StatusCodes.OK, getReasonPhrase(StatusCodes.OK), message, data);
    }

    static created<T>(message: string, data: T): ApiSuccessResponse<T> {
        return new ApiSuccessResponse(StatusCodes.CREATED, getReasonPhrase(StatusCodes.CREATED), message, data);
    }

    static notModified<T>(message: string, data: T): ApiSuccessResponse<T> {
        return new ApiSuccessResponse(StatusCodes.NOT_MODIFIED, getReasonPhrase(StatusCodes.NOT_MODIFIED), message, data);
    }

    static noContent<T>(message: string, data: T): ApiSuccessResponse<T> {
        return new ApiSuccessResponse(StatusCodes.NO_CONTENT, getReasonPhrase(StatusCodes.NO_CONTENT), message, data);
    }

    static accepted<T>(message: string, data: T): ApiSuccessResponse<T> {
        return new ApiSuccessResponse(StatusCodes.ACCEPTED, getReasonPhrase(StatusCodes.ACCEPTED), message, data);
    }

    static resetContent<T>(message: string, data: T): ApiSuccessResponse<T> {
        return new ApiSuccessResponse(StatusCodes.RESET_CONTENT, getReasonPhrase(StatusCodes.RESET_CONTENT), message, data);
    }

    static partialContent<T>(message: string, data: T): ApiSuccessResponse<T> {
        return new ApiSuccessResponse(StatusCodes.PARTIAL_CONTENT, getReasonPhrase(StatusCodes.PARTIAL_CONTENT), message, data);
    }

    static multiStatus<T>(message: string, data: T): ApiSuccessResponse<T> {
        return new ApiSuccessResponse(StatusCodes.MULTI_STATUS, getReasonPhrase(StatusCodes.MULTI_STATUS), message, data);
    }

    static movedPermanently<T>(message: string, data: T): ApiSuccessResponse<T> {
        return new ApiSuccessResponse<T>(StatusCodes.MOVED_PERMANENTLY, getReasonPhrase(StatusCodes.MOVED_PERMANENTLY), message, data);
    }

    static found<T>(message: string, data: T): ApiSuccessResponse<T> {
        return new ApiSuccessResponse<T>(HttpStatus.FOUND, getReasonPhrase(HttpStatus.FOUND), message, data);
    }

    static seeOther<T>(message: string, data: T): ApiSuccessResponse<T> {
        return new ApiSuccessResponse<T>(StatusCodes.SEE_OTHER, getReasonPhrase(StatusCodes.SEE_OTHER), message, data);
    }

    static temporaryRedirect<T>(message: string, data: T): ApiSuccessResponse<T> {
        return new ApiSuccessResponse<T>(StatusCodes.TEMPORARY_REDIRECT, getReasonPhrase(StatusCodes.TEMPORARY_REDIRECT), message, data);
    }

    static permanentRedirect<T>(message: string, data: T): ApiSuccessResponse<T> {
        return new ApiSuccessResponse<T>(StatusCodes.PERMANENT_REDIRECT, getReasonPhrase(StatusCodes.PERMANENT_REDIRECT), message, data);
    }

    static paginated<T>(
        message: string,
        data: T,
        page: number,
        size: number,
        pages: number,
        total: number,
        hasNext?: boolean,
        hasPrevious?: boolean,
    ): ApiSuccessResponse<any> {
        return ApiSuccessResponse.ok<any>(message, {result: data, pagination: {page, size, pages, total, hasNext, hasPrevious}});
    }
}