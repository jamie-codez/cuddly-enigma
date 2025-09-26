import {ApiProperty} from "@nestjs/swagger";
import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        type: String,
        description: "The full name of the user.",
        required: true,
        example: "John Doe",
    })
    @IsString({message: "Full name should be a string."})
    @IsNotEmpty({message: "Full name is required."})
    @MinLength(5, {message: "Full name must be at least 5 characters long."})
    @Matches(/^[a-zA-Z]+( [a-zA-Z]+)*$/, {
        message: "Full name must be letters separated by a space.",
    })
    readonly fullName: string;
    @ApiProperty({
        type: String,
        description: "The email address of the user.",
        required: true,
        example: "johndoe@domain-name.tld",
    })
    @IsEmail(
        {
            allow_ip_domain: true,
            allow_underscores: true,
            allow_display_name: true,
        },
        {message: "Please provide a valid email."},
    )
    @IsNotEmpty({message: "Email address is required."})
    readonly email: string;
    @ApiProperty({
        type: Array,
        description: "The names of the roles you want to assign the user.",
        required: true,
        default: ["user"],
        examples: ["user", "admin"],
    })
    @IsArray({message: "Roles has to be an array of strings."})
    @IsNotEmpty({message: "At least one role is required."})
    readonly roles: string[];
    @ApiProperty({
        type: String,
        description: "The password of the user being created.",
        required: true,
        example: "MyP@ssw0rd123",
    })
    @IsString({message: "Password has to be a string."})
    @IsNotEmpty({message: "Password is required"})
    @MinLength(10, {message: "Password must be at least 10 characters long."})
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@\-_$!%*?&])[A-Za-z\d@\-_$!%*?&]{10,}$/,
        {
            message:
                "Password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
    )
    readonly password: string;
}