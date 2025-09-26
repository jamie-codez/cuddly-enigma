import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getDatabaseType} from "@app/configs/datasource";
import {entities} from "@app/common/app.constants";

export const postgresProviders = [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            type: getDatabaseType(),
            host: configService.get<string>("DATABASE_HOST"),
            port: configService.get<number>("DATABASE_PORT"),
            username: configService.get<string>("DATABASE_USER"),
            password: configService.get<string>("DATABASE_PASSWORD"),
            database: configService.get<string>("DATABASE_NAME"),
            entities: entities(),
            synchronize: false,
            logging: configService.get<string>("ENVIRONMENT") === "development",
            cache: {
                type: configService.get<string>("CACHE_TYPE") as "ioredis" | "redis",
                options: {
                    host: configService.get<string>("REDIS_HOST"),
                    port: configService.get<number>("REDIS_PORT"),
                    password: configService.get<string>("REDIS_PASSWORD"),
                },
            },
        }),
    }),
];