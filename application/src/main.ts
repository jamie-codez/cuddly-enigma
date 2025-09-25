import {NestFactory} from '@nestjs/core';
import {AppModule} from './features/main/app.module';
import {ConfigService} from "@nestjs/config";
import {Logger} from "@nestjs/common";

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
    await app.listen(configService.getOrThrow<number>("APP_PORT"), configService.getOrThrow<string>("APP_HOST"), () => {
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

