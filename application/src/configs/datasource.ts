import {DataSource, DataSourceOptions} from "typeorm";
import {config} from "dotenv";
import {join} from "path";

config();

export const getDatabaseType = () => {
    const dbType = process.env.DB_TYPE;
    if (dbType === "postgres") return "postgres";
    if (dbType === "mysql") return "mysql";
    if (dbType === "mariadb") return "mariadb";
    if (dbType === "sqlite") return "sqlite";
    if (dbType === "oracle") return "oracle";
    if (dbType === "mssql") return "mssql";
    if (dbType === "mongodb") return "mongodb";
    else return "postgres";
};

const datasourceOptions: DataSourceOptions = {
    type: getDatabaseType(),
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: process.env.DB_LOGGING === "true",
    entities: [join(__dirname, "..", "**", "entities", "*{.ts,.js}")],
    migrations: [join(__dirname, "..", "**", "migrations", "*{.ts,.js}")],
    migrationsTableName: process.env.DB_MIGRATIONS_TABLE_NAME,
    synchronize: process.env.DB_SYNCHRONIZE === "true",
} as DataSourceOptions;

export const datasource = new DataSource(datasourceOptions);