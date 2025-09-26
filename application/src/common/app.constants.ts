import {Logger, Type} from "@nestjs/common";
import {getMetadataArgsStorage, ILike} from "typeorm";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostgresModule} from "@app/postgres";
import {AbstractBaseEntity} from "@app/features/base/entities/abstract.base.entity";
import {User} from "@app/features/users/entities/users.entity";

const logger = new Logger("app.constants");

export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export const entities = () => {
    const entities = getMetadataArgsStorage().tables.map(table => table.target);
    entities.forEach((entity: any) => logger.log(`Entity: ${entity.name} discovered.`));
    logger.log(`Total of ${entities.length} entities discovered.`);
    return entities;
};


export const featureDependencies = <T extends Type<AbstractBaseEntity>>(entities?: T[]) => {
    if (!entities) return [PostgresModule, TypeOrmModule.forFeature([User])];
    return [PostgresModule, TypeOrmModule.forFeature([User, ...entities])];
};