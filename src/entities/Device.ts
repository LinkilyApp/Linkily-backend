import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Room } from "./Room";

@Entity()
export class Device {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    fingerprint!: string;

    @Column()
    brand!: string;

    @Column()
    model!: string;

    @Column()
    hardware!: string;

    @Column({ nullable: true })
    geocode?: string;

    @ManyToOne(() => User, user => user.devices)
    user!: User;

    @ManyToOne(() => Room, room => room.devices)
    room!: Room;
}