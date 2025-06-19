import { Request, Response } from "express";
import { RoomService } from "./roomService";

export class RoomController {
  private roomService: RoomService;

  constructor() {
    this.roomService = new RoomService();
  }

  selfListMembers = async (req: Request, res: Response) => {
    const result = await this.roomService.selfListMembers(req);
    this.sendResponse(res, result);
  };

  private sendResponse(res: Response, result: any) {
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  }
}
