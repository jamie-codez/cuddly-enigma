import {BaseEntity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export abstract class AbstractBaseEntity extends BaseEntity {
    @PrimaryGeneratedColumn("increment", {name: "id", type: "bigint"})
    id: number;
    @Column({name: "slug", type: "varchar", nullable: false, unique: true, length: 50})
    slug: string;
    @Column({name: "deleted", type: "boolean", default: false, nullable: false})
    deleted: boolean;
    @Column({name: "active", type: "boolean", nullable: false, default: true})
    active: boolean;
    @Column({name: "created_by", type: "varchar", nullable: false, default: "system"})
    createdBy: string;
    @Column({name: "updated_by", type: "varchar", nullable: false, default: "system"})
    updatedBy: string;
    @CreateDateColumn({name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;
    @UpdateDateColumn({name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt: Date;
    @DeleteDateColumn({name: "deleted_at", type: "timestamp", nullable: true, default: null, onUpdate: "CURRENT_TIMESTAMP"})
    deletedAt: Date;

    toJson() {
        const {id, createdAt, updatedAt, ...rest} = this;
        return {id, createdAt, updatedAt, ...rest};
    }
}