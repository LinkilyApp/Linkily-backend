import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Device } from "./Device";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    phone?: string;

    @OneToMany(() => Device, device => device.user)
    devices!: Device[];
}