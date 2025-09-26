import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger} from "@nestjs/common";
import {EnigmaHttpException} from "@app/exceptions/http.exception";
import {ErrorException} from "@app/exceptions/error.exception";

@Catch(ErrorException)
export class ErrorExceptionFilter<T> implements ExceptionFilter {
    private readonly logger = new Logger(ErrorExceptionFilter.name);

    catch(exception: EnigmaHttpException<unknown>, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        this.logger.error(exception.message, exception.stack);
        throw new EnigmaHttpException<T>(HttpStatus.INTERNAL_SERVER_ERROR, exception.message, exception.data as T);
    }
}