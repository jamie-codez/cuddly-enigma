import {Module} from '@nestjs/common';
import {PostgresService} from './services/postgres.service';

@Module({
    providers: [PostgresService],
    exports: [PostgresService],
})
export class PostgresModule {
}
