import {HttpException} from "@nestjs/common";
import {getReasonPhrase} from "http-status-codes";

export class EnigmaHttpException<T> extends HttpException {
    constructor(public statusCode: number, public message: string, public data?: T) {
        super({status: statusCode, message: getReasonPhrase(statusCode), data}, statusCode, {description: message, cause: data});
        this.message = message;
        this.data = data;
    }
}