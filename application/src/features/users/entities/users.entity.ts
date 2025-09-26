import {AbstractBaseEntity} from "@app/features/base/entities/abstract.base.entity";
import {Entity, Column, ManyToMany, JoinTable, BeforeInsert, BeforeUpdate} from "typeorm";

@Entity({name: "users", schema: "public", comment: "Users table"})
export class User extends AbstractBaseEntity {
    @Column({name: "username", type: "varchar", unique: false, nullable: false, length: 50})
    username: string;
    @Column({name: "first_name", type: "varchar", unique: false, nullable: false, length: 50})
    firstName: string;
    @Column({name: "last_name", type: "varchar", unique: false, nullable: false, length: 50})
    lastName: string;
    @Column({name: "email", type: "varchar", unique: true, nullable: false, length: 50})
    email: string;
    @Column({name: "phone", type: "varchar", unique: false, nullable: false, length: 50})
    phone?: string;
    @Column({name: "email_verified", type: "boolean", nullable: false, default: false})
    emailVerified: boolean;
    @Column({name: "phone_verified", type: "boolean", nullable: false, default: false})
    phoneVerified: boolean;
    @Column({name: "photo_url", type: "varchar", unique: false, nullable: true})
    photoUrl: string;

    @BeforeInsert()
    @BeforeUpdate()
    normalizeEmail() {
        this.email = this.email.toLowerCase();
    }

    @BeforeInsert()
    @BeforeUpdate()
    provideImageUrl() {
        if (!this.photoUrl) {
            this.photoUrl = `https://ui-avatars.com/api/?name=${this.firstName}+${this.lastName}&background=random&color=fff&size=200`;
        }
    }
}