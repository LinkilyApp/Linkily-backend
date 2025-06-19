import { Request } from "express";
import { AppDataSource } from "../database/databaseSource";
import { Device } from "../entities/Device";

export class RoomService {
  constructor() {}

  async selfListMembers(req: Request) {
    try {
      const user = req.user;
      if (!user) {
        return {
          success: false,
          message: "User not found",
          data: [],
        };
      }

      const deviceRepository = AppDataSource.getRepository(Device);
      
      const devices = await deviceRepository.find({
        where: { room: { id: user.room.id } },
        relations: ["user", "room"],
        select: {
          id: true,
          fingerprint: true,
          brand: true,
          model: true,
          hardware: true,
          geocode: true,
          user: {
            id: true,
            username: true,
            email: true,
            phone: true,
          },
          room: {
            id: true,
            name: true,
          },
        },
        order: {
          user: {
            username: "ASC",
          },
        },
      });

      console.log(devices.map(device => ({
          id: device.id,
          fingerprint: device.fingerprint,
          brand: device.brand,
          model: device.model,
          hardware: device.hardware,
          geocode: device.geocode,
          isCurrentDevice: device.id === user.device.id,
          user: {
            id: device.user.id,
            username: device.user.username,
            email: device.user.email,
            phone: device.user.phone,
          },
        })));

      return {
        success: true,
        message: "Success",
        data: devices.map(device => ({
          id: device.id,
          fingerprint: device.fingerprint,
          brand: device.brand,
          model: device.model,
          hardware: device.hardware,
          geocode: device.geocode,
          isCurrentDevice: device.id === user.device.id,
          user: {
            id: device.user.id,
            username: device.user.username,
            email: device.user.email,
            phone: device.user.phone,
          },
        })),
      };
    } catch (error) {
      console.error("Error listing room members:", error);
      return {
        success: false,
        message: "Internal server error",
        data: [],
      };
    }
  }
}