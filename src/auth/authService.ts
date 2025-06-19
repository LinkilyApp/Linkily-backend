import { AppDataSource } from "../database/databaseSource";
import { User } from "../entities/User";
import { Room } from "../entities/Room";
import { Device } from "../entities/Device";
import { LoginCredentials } from "./authTypes";
import { generateToken, JwtPayload } from "../utils/util_jwt";

export class AuthService {
  async login(credentials: LoginCredentials): Promise<any> {
    if (
      !credentials.username ||
      !credentials.room ||
      !credentials.roomPassword ||
      !credentials.device
    ) {
      return {
        message: `Missing fields: ${!credentials.username ? "username" : ""} ${
          !credentials.room ? "room" : ""
        } ${!credentials.roomPassword ? "roomPassword" : ""} ${
          !credentials.device ? "device" : ""
        }`,
        success: false,
      };
    }

    try {
      const userRepository = AppDataSource.getRepository(User);
      const roomRepository = AppDataSource.getRepository(Room);
      const deviceRepository = AppDataSource.getRepository(Device);

      // Check if room exists and password matches
      const room = await roomRepository.findOne({
        where: { name: credentials.room },
      });

      if (!room) {
        return {
          message: "Room not found",
          success: false,
        };
      }

      if (room.password !== credentials.roomPassword) {
        return {
          message: "Invalid room password",
          success: false,
        };
      }

      // Find or create user
      let user = await userRepository.findOne({
        where: { username: credentials.username },
        relations: ["devices"],
      });

      if (!user) {
        user = userRepository.create({
          username: credentials.username,
        });
        await userRepository.save(user);
      }

      // Check if device exists
      let device = await deviceRepository.findOne({
        where: { fingerprint: credentials.device.fingerprint },
        relations: ["user", "room"],
      });

      if (device) {
        if (device.room.id !== room.id) {
          device.room = room;
          await deviceRepository.save(device);
        }
      } else {
        // Create new device
        device = deviceRepository.create({
          ...credentials.device,
          user: user,
          room: room,
        });
        await deviceRepository.save(device);
      }

      const tokenPayload: JwtPayload = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
        },
        room: {
          id: room.id,
          name: room.name,
        },
        device: {
          id: device.id,
          fingerprint: device.fingerprint,
        },
      };

      const token = generateToken(tokenPayload);

      return {
        message: "Login successful",
        success: true,
        data: {
          token: token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
          },
          room: {
            id: room.id,
            name: room.name,
          },
          device: {
            id: device.id,
            fingerprint: device.fingerprint,
            brand: device.brand,
            model: device.model,
            hardware: device.hardware,
          },
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        message: "Internal server error",
        success: false,
      };
    }
  }
}
