import { Request, Response } from "express";
import { AuthService } from "./authService";
import { LoginCredentials } from "./authTypes";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    const credentials: LoginCredentials = req.body;
    const result = await this.authService.login(credentials);
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
