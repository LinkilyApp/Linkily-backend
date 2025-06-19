import { Request, Response } from "express";
import { DevicesService } from "./devicesService";

export class DevicesController {
  private devicesService: DevicesService;

  constructor() {
    this.devicesService = new DevicesService();
  }

  selfGetDeviceInfo = async (req: Request, res: Response) => {
    const result = await this.devicesService.selfGetDeviceInfo(req);
    this.sendResponse(res, result);
  };

  selfUpdateGeolocation = async (arg0: any, res: Response) => {
    const result = await this.devicesService.selfUpdateGeolocation(arg0);
    this.sendResponse(res, result);
  }

  private sendResponse(res: Response, result: any) {
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  }
}
