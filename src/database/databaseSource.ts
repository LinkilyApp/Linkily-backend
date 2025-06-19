import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Room } from "../entities/Room";
import { Device } from "../entities/Device";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Room, Device],
    migrations: [],
    subscribers: [],
});

export const initializeDatabase = async () => {
    await AppDataSource.initialize();
    
    const roomRepository = AppDataSource.getRepository(Room);
    const existingRoom = await roomRepository.count() > 0;
    
    if (!existingRoom) {
        const defaultRoom = roomRepository.create({
            name: "default",
            password: "aaaaaa"
        });
        await roomRepository.save(defaultRoom);
        
        console.log("Created default room");
    }
    
    console.log("Database initialized");
};