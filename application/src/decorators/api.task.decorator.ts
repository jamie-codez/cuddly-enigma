import {applyDecorators, Type} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
} from "@nestjs/swagger";
import {AbstractBaseCreateDto} from "@app/features/base/dtos/abstract.base.create.dto";
import {AbstractBaseUpdateDto} from "@app/features/base/dtos/abstract.base.update.dto";
import {ApiSuccessResponse} from "@app/features/base/dtos/api.success.response";
import {ApiErrorResponse} from "@app/features/base/dtos/api.error.response";

interface QueryParam {
    name: string;
    type: any;
    required: boolean;
    description: string;
    default: any;
}

export const SwaggerTask = <T extends Type<AbstractBaseCreateDto>, U extends Type<AbstractBaseUpdateDto>>(
    entityName: string,
    createDto: T,
    updateDto: U,
    method: "POST" | "GET" | "OPTIONS" | "LISTING" | "SEARCHING" | "PATCH" | "PUT" | "DELETE",
    queryParams?: QueryParam[],
) => {
    if (method === "POST") {
        return applyDecorators(
            ApiOperation({
                summary: `Create a new ${entityName}.`,
                description: `Create a new ${entityName}.`,
            }),
            ApiCreatedResponse({
                description: `The ${entityName} has been successfully created.`,
                type: ApiSuccessResponse<T>,
            }),
            ApiConflictResponse({
                description: `The ${entityName} already exists.`,
                type: ApiErrorResponse<null>,
            }),
            ApiBadRequestResponse({
                description: "The request body is invalid.",
                type: ApiErrorResponse<null>,
            }),
            ApiInternalServerErrorResponse({
                description: "An error occurred while processing the request.",
                type: ApiErrorResponse<null>,
            }),
        );
    }
    if (method === "GET") {
        return applyDecorators(
            ApiOperation({
                summary: `Get ${entityName} with path param/s or query param/s.`,
                description: `Get ${entityName} with path param/s or query param/s.`,
            }),
            ApiOkResponse({
                description: `The ${entityName} has been successfully retrieved.`,
                type: ApiSuccessResponse<T>,
            }),
            ApiNotFoundResponse({
                description: `No ${entityName} found.`,
                type: ApiErrorResponse<T>,
            }),
            ApiBadRequestResponse({
                description: "The request body is invalid.",
                type: ApiErrorResponse<T>,
            }),
            ApiInternalServerErrorResponse({
                description: "An error occurred while processing the request.",
                type: ApiErrorResponse<T>,
            }),
        );
    }
    if (method === "OPTIONS") {
        return applyDecorators(
            ApiOperation({
                summary: `Get all ${entityName}s with pagination.`,
                description: `Get all ${entityName}s with pagination.`,
            }),
            ApiOkResponse({
                description: `The ${entityName} have been successfully retrieved.`,
                type: ApiSuccessResponse<T[]>,
            }),
            ApiNotFoundResponse({
                description: `No ${entityName}s found.`,
                type: ApiErrorResponse<null>,
            }),
            ApiInternalServerErrorResponse({
                description: "An error occurred while processing the request.",
                type: ApiErrorResponse<null>,
            }),
        );
    }
    if (method === "SEARCHING") {
        return applyDecorators(
            ApiOperation({
                summary: `Search ${entityName} with pagination.`,
                description: `Search ${entityName} with pagination.`,
            }),
            ApiOkResponse({
                description: `The ${entityName}s have been successfully retrieved.`,
                type: ApiSuccessResponse<T[]>,
            }),
            ApiNotFoundResponse({
                description: `No ${entityName}s found.`,
                type: ApiErrorResponse<null>,
            }),
            ApiInternalServerErrorResponse({
                description: "An error occurred while processing the request.",
                type: ApiErrorResponse<null>,
            }),
        );
    }
    if (method === "LISTING" && queryParams) {
        const params = queryParams.map(param => ApiQuery({...param}));
        return applyDecorators(
            ApiOperation({
                summary: `Search or get all ${entityName} with pagination.`,
                description: `Search or get all ${entityName} with pagination.`,
            }),
            ApiOkResponse({
                description: `The ${entityName}s have been successfully retrieved.`,
                type: ApiSuccessResponse<any>,
            }),
            ApiNotFoundResponse({
                description: `No ${entityName}s found.`,
                type: ApiErrorResponse<null>,
            }),
            ApiInternalServerErrorResponse({
                description: "An error occurred while processing the request.",
                type: ApiErrorResponse<null>,
            }),
            ...params,
        );
    }
    if (method === "PATCH") {
        return applyDecorators(
            ApiOperation({
                summary: `Update ${entityName} with the body containing fields changed.`,
                description: `Update ${entityName} with the body containing fields changed.`,
            }),
            ApiOkResponse({
                description: `The ${entityName} has been successfully updated.`,
                type: ApiSuccessResponse<T>,
            }),
            ApiNotFoundResponse({
                description: `No ${entityName} found.`,
                type: ApiErrorResponse<null>,
            }),
            ApiBadRequestResponse({
                description: "The request body is invalid.",
                type: ApiErrorResponse<null>,
            }),
            ApiInternalServerErrorResponse({
                description: "An error occurred while processing the request.",
                type: ApiErrorResponse<null>,
            }),
        );
    }
    if (method === "PUT") {
        return applyDecorators(
            ApiOperation({
                summary: `Replace ${entityName} with the body containing fields changed.`,
                description: `Replace ${entityName} with the body containing fields changed.`,
            }),
            ApiOkResponse({
                description: `The ${entityName} has been successfully replaced.`,
                type: ApiSuccessResponse<U>,
            }),
            ApiNotFoundResponse({
                description: `No ${entityName} found.`,
                type: ApiErrorResponse<null>,
            }),
            ApiBadRequestResponse({
                description: "The request body is invalid.",
                type: ApiErrorResponse<null>,
            }),
            ApiInternalServerErrorResponse({
                description: "An error occurred while processing the request.",
                type: ApiErrorResponse<null>,
            }),
        );
    }
    if (method === "DELETE") {
        return applyDecorators(
            ApiOperation({
                summary: `Delete ${entityName} with path param/s.`,
                description: `Delete ${entityName} with path param/s.`,
            }),
            ApiOkResponse({
                description: `The ${entityName} has been successfully deleted.`,
                type: ApiSuccessResponse<T>,
            }),
            ApiNotFoundResponse({
                description: `No ${entityName} found.`,
                type: ApiErrorResponse<null>,
            }),
            ApiInternalServerErrorResponse({
                description: "An error occurred while processing the request.",
                type: ApiErrorResponse<null>,
            }),
        );
    }
    return applyDecorators(
        ApiOperation({
            summary: `Get all ${entityName}s.`,
            description: `Get all ${entityName}s.`,
        }),
        ApiOkResponse({
            description: `The ${entityName}s have been successfully retrieved.`,
            type: ApiSuccessResponse<T>,
        }),
        ApiNotFoundResponse({
            description: `No ${entityName}s found.`,
            type: ApiErrorResponse<null>,
        }),
        ApiInternalServerErrorResponse({
            description: "An error occurred while processing the request.",
            type: ApiErrorResponse<null>,
        }),
    );
};