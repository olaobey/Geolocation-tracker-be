import { IUser } from "../../model/user";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}