import {Module} from "@nestjs/common";
import {UsersController} from "./controllers/users.controller";
import {UsersService} from "./services/users.service";
import {usersConfigs} from "@app/features/users/configs/users.configs";

@Module({
    imports: [...usersConfigs],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {
}