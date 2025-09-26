import {HttpStatus, Injectable, InternalServerErrorException, Logger,} from "@nestjs/common";
import {CreateUserDto} from "../dtos/create.user.dto";
import {UpdateUserDto} from "../dtos/update.user.dto";
import {BaseUtils} from "@app/common/base.utils";
import {ConfigService} from "@nestjs/config";
import {User} from "../entities/users.entity";
import {ILike, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {EnigmaHttpException} from "@app/exceptions/http.exception";
import {ApiSuccessResponse} from "@app/features/base/dtos/api.success.response";

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    private readonly baseUtils = BaseUtils.getInstance();

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {
    }

    async create(createUserDto: CreateUserDto) {
        const {fullName, email} = createUserDto;
        const userExists = await this.userRepository.existsBy({email});
        if (userExists)
            throw new EnigmaHttpException(
                HttpStatus.CONFLICT,
                `User with email: ${email} already exists. Try logging in.`,
            );
        const uid = this.baseUtils
            .generateRandomAlphanumericString("", 20)
            .toUpperCase();
        const names = fullName.split(" ");
        const user = this.userRepository.create({
            slug: uid,
            username: fullName,
            firstName: names[0],
            lastName: names[1],
            email,
        });
        const newUser = await this.userRepository.save(user);
        if (!newUser)
            throw new EnigmaHttpException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Try again later.",
            );
        this.logger.log("Sending email.");
        return ApiSuccessResponse.created<User>(
            "User created successfully.",
            newUser,
        );
    }

    async findAll(
        page: number = 1,
        limit: number = 20,
        sort: string = "id",
        order: string = "DESC",
        q?: string,
    ) {
        const query =
            q && q.trim() != ""
                ? [
                    {uid: ILike(`%${q}%`)},
                    {slug: ILike(`%${q}%`)},
                    {fullName: ILike(`%${q}%`)},
                    {firstName: `%${q}%`},
                    {lastName: `%${q}%`},
                    {email: `%${q}%`},
                    {phoneNumber: `%${q}%`},
                ]
                : {};
        const [users, count] = await this.userRepository.findAndCount({
            where: query,
            relations: ["roles", "profiles", "companies", "notifications"],
            order: {[sort]: order},
            skip: (page - 1) * limit,
            take: limit,
        });
        if (!count || count === 0 || !users || users.length === 0)
            throw new EnigmaHttpException(HttpStatus.NOT_FOUND, "No users found.");
        const hasNext = count > (page - 1) * limit;
        const hasPrevious = page > 1 && count > 0;
        return ApiSuccessResponse.paginated<User[]>(
            "Users retrieved successfully.",
            users,
            page,
            limit,
            Math.ceil(count / limit),
            count,
            hasNext,
            hasPrevious,
        );
    }

    async findOneBySlug(slug: string) {
        const user = await this.userRepository.findOne({
            where: {slug},
            relations: ["roles", "profiles", "companies", "notifications"],
        });
        if (!user)
            throw new EnigmaHttpException(
                HttpStatus.NOT_FOUND,
                `User with id: ${slug} was not found.`,
            );
        return ApiSuccessResponse.ok<User>("User retrieved successfully.", user);
    }

    async findOneById(id: number) {
        const user = await this.userRepository.findOne({
            where: {id},
            relations: ["roles", "profiles", "companies", "notifications"],
        });
        if (!user)
            throw new EnigmaHttpException(
                HttpStatus.NOT_FOUND,
                `User with id: ${id} was not found.`,
            );
        return ApiSuccessResponse.ok<User>("User retrieved successfully.", user);
    }

    async updateBySlug(slug: string, updateUserDto: UpdateUserDto) {
        const {roles, ...rest} = updateUserDto;
        const user = await this.userRepository.findOneBy({slug});
        if (!user)
            throw new EnigmaHttpException(
                HttpStatus.NOT_FOUND,
                `User with id: ${slug} not found.`,
            );

        const _user = {
            ...user,
            ...rest,
        };
        const update = this.userRepository.create(_user);
        const updateResult = await this.userRepository.update({slug}, update);
        if (updateResult.affected === 0 || !updateResult.affected)
            throw new InternalServerErrorException(
                "An unexpected error occurred.Try again.",
            );
        return ApiSuccessResponse.ok<User>(
            "User updated successfully",
            await this.userRepository.findOne({
                where: {slug},
                relations: ["roles", "profiles", "companies", "notifications"],
            }),
        );
    }

    async updateById(id: number, updateUserDto: UpdateUserDto) {
        const {roles, ...rest} = updateUserDto;
        const user = await this.userRepository.findOneBy({id});
        if (!user)
            throw new EnigmaHttpException(
                HttpStatus.NOT_FOUND,
                `User with id: ${id} not found.`,
            );
        const _user = {
            ...user,
            ...rest,
        };
        const update = this.userRepository.create(_user);
        const updateResult = await this.userRepository.update({id}, update);
        if (updateResult.affected === 0 || !updateResult.affected)
            throw new InternalServerErrorException(
                "An unexpected error occurred.Try again.",
            );
        return ApiSuccessResponse.ok<User>(
            "User updated successfully",
            await this.userRepository.findOne({
                where: {id},
                relations: ["roles", "profiles", "companies", "notifications"],
            }),
        );
    }

    async deleteBySlug(slug: string) {
        const user = await this.userRepository.delete({slug});
        if (!user.affected || user.affected === 0)
            throw new EnigmaHttpException(
                HttpStatus.NOT_FOUND,
                `User with id: ${slug} was not found.`,
            );
        return ApiSuccessResponse.ok<null>("User deleted successfully.");
    }

    async deleteById(id: number) {
        const user = await this.userRepository.delete({id});
        if (!user.affected || user.affected === 0)
            throw new EnigmaHttpException(
                HttpStatus.NOT_FOUND,
                `User with id: ${id} was not found.`,
            );
        return ApiSuccessResponse.ok<null>("User deleted successfully.");
    }
}