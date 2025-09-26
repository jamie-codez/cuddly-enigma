import {ValidationPipe} from "@nestjs/common";

export class InputValidationPipe extends ValidationPipe {
    constructor() {
        super({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            skipMissingProperties: false,
            forbidUnknownValues: true,
            skipNullProperties: false,
            validateCustomDecorators: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        });
    }
}