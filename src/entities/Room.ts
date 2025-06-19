import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Device } from "./Device";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column()
    password!: string;

    @OneToMany(() => Device, device => device.room)
    devices!: Device[];
}