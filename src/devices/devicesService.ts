import { Request } from "express";
import { AppDataSource } from "../database/databaseSource";
import { Device } from "../entities/Device";

export class DevicesService {
  constructor() {}

  async selfGetDeviceInfo(req: Request) {
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
      
      const device = await deviceRepository.findOne({
        where: { id: user.device.id },
        relations: ["user", "room"],
        select: {
          id: true,
          fingerprint: true,
          brand: true,
          model: true,
          hardware: true,
          user: {
            id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
      });

      if (!device) {
        return {
          success: false,
          message: "Device not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Success",
        data: {
          id: device.id,
          fingerprint: device.fingerprint,
          brand: device.brand,
          model: device.model,
          hardware: device.hardware,
          user: {
            id: device.user.id,
            username: device.user.username,
            email: device.user.email,
            phone: device.user.phone,
          },
        },
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

  async selfUpdateGeolocation(req: Request) {
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
      
      const device = await deviceRepository.findOne({
        where: { id: user.device.id },
      });

      if (!device) {
        return {
          success: false,
          message: "Device not found",
          data: null,
        };
      }

      device.geocode = req.body.geocode;
      await deviceRepository.save(device);

      return {
        success: true,
        message: "Success",
        data: device,
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
