import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

export default class JWTHelper {
  private jwtSecret: string;
  constructor() {
    this.jwtSecret = config.jwt.secret;
  }

  public generateAuthToken(email: string): string {
    return jwt.sign({ email }, this.jwtSecret, { expiresIn: "1h" });
  }

  public verifyAuthToken(token: string): string | JwtPayload {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      console.error("Invalid JWT:", error);
      return {
        email: "",
      };
    }
  }
}
