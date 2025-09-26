import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Put,
    UseGuards,
    Module,
} from "@nestjs/common";
import {UsersService} from "../services/users.service";
import {CreateUserDto} from "../dtos/create.user.dto";
import {UpdateUserDto} from "../dtos/update.user.dto";
import {SwaggerTask} from "../../../decorators/api.task.decorator";
import {ApiTags} from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post()
    @SwaggerTask("user", CreateUserDto, UpdateUserDto, "POST")
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @SwaggerTask("user", CreateUserDto, UpdateUserDto, "LISTING")
    async findAllUsers(
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 20,
        @Query("sort") sort: string = "id",
        @Query("order") order: string = "DESC",
        @Query("q") q?: string,
    ) {
        return this.usersService.findAll(page, limit, sort, order, q);
    }

    @Get(":slug")
    @SwaggerTask("user", CreateUserDto, UpdateUserDto, "GET")
    async findOneUser(@Param("slug") slug: string) {
        return await this.usersService.findOneBySlug(slug);
    }

    @Patch(":slug")
    @SwaggerTask("user", CreateUserDto, UpdateUserDto, "PATCH")
    async patchUser(
        @Param("slug") slug: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.usersService.updateBySlug(slug, updateUserDto);
    }

    @Put(":slug")
    @SwaggerTask("user", CreateUserDto, UpdateUserDto, "PUT")
    async updateUser(
        @Param("slug") slug: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.usersService.updateBySlug(slug, updateUserDto);
    }

    @Delete(":slug")
    @SwaggerTask("user", CreateUserDto, UpdateUserDto, "DELETE")
    async deleteUser(@Param("slug") slug: string) {
        return await this.usersService.deleteBySlug(slug);
    }
}