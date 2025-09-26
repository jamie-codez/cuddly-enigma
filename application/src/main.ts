import {NestFactory} from '@nestjs/core';
import {AppModule} from './features/main/app.module';
import {ConfigService} from "@nestjs/config";
import {Logger} from "@nestjs/common";
import {InputValidationPipe} from "./pipes/input.validation.pipe";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ErrorExceptionFilter} from "@app/filters/error.exception.filter";
import {EnigmaHttpExceptionsFilter} from "@app/filters/http.exception.filter";

const logger = new Logger("Main");

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.enableCors({
        origin: configService.getOrThrow<string>("CORS_ORIGINS").includes(",") ? configService.getOrThrow<string>("CORS_ORIGINS").split(",") : configService.getOrThrow<string>("CORS_ORIGINS"),
        methods: configService.getOrThrow<string>("CORS_METHODS").includes(",") ? configService.getOrThrow<string>("CORS_METHODS").split(",") : configService.getOrThrow<string>("CORS_METHODS"),
        allowedHeaders: configService.getOrThrow<string>("CORS_HEADERS").includes(",") ? configService.getOrThrow<string>("CORS_HEADERS").split(",") : configService.getOrThrow<string>("CORS_HEADERS"),
    });
    app.setGlobalPrefix(configService.getOrThrow("API_PREFIX"));
    const hostName = configService.getOrThrow<string>("HOST_NAME");
    const port = configService.getOrThrow<number>("APP_PORT");
    app.setGlobalPrefix(configService.getOrThrow<string>("API_PREFIX") || "/api/v1", {
        exclude: ["/", "/contributing", "/code-of-conduct", "/license"],
    });
    app.useGlobalPipes(new InputValidationPipe());
    app.useGlobalFilters(new EnigmaHttpExceptionsFilter(), new ErrorExceptionFilter());
    const documentBuilder = new DocumentBuilder()
        .setTitle(configService.getOrThrow<string>("APP_NAME"))
        .setDescription(configService.getOrThrow<string>("APP_DESCRIPTION"))
        .setLicense(configService.getOrThrow("APP_LICENSE"), configService.getOrThrow("APP_LICENSE_URL"))
        .setVersion(configService.getOrThrow("APP_VERSION"))
        .setTermsOfService(configService.getOrThrow("APP_TERMS_URL"))
        .setContact(
            configService.getOrThrow("APP_CONTACT_NAME"),
            configService.getOrThrow("APP_CONTACT_URL"),
            configService.getOrThrow("APP_CONTACT_EMAIL"),
        )
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, documentBuilder);
    SwaggerModule.setup(`${configService.getOrThrow("APP_PREFIX")}${configService.getOrThrow("APP_DOCS_URL")}` || "api/v1/docs", app, document);
    await app.listen(port, hostName, () => {
        logger.log("NestJS application started successfully.")
    });
}

bootstrap()
    .then(
        () => logger.log(`Server started successfully at http://${process.env.APP_HOST}:${process.env.APP_PORT}`),
        (error) => logger.error(`Failed to start server: ${error}`)
    ).catch(error => {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
});

