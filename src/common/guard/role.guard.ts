import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorator";
import { HttpMethod } from "../constant/http-method.constant";
import { dbRawInstance } from "../database/database-raw-instance";
import { IOutputResponse } from "../interface";
import { HttpMessage } from "../constant";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();

    const url = req.raw.url.split("/");
    const module = url[3].replace(/(\?.*)/, "");
    let method = url[4] && url[4].replace(/(\?.*)/, "") === "approval" ? "APPROVE" : req.raw.method;
    method = url[4] && url[4].replace(/(\?.*)/, "") === "print" ? "DOWNLOAD" : method;
    method = HttpMethod[method];

    const [userDB, moduleDB] = await Promise.all([
      dbRawInstance().query(`SELECT role_id FROM "User" WHERE id = ${req.user?.id || 0}`),
      dbRawInstance().query(`SELECT id FROM "Module" WHERE name = '${module}'`),
    ]);

    const userDetail = userDB[0] ? (userDB[0][0] as Record<string, any>)?.role_id : null;
    const moduleDetail = moduleDB[0] ? (moduleDB[0][0] as Record<string, any>)?.id : null;

    const errMessage: IOutputResponse = {
      code: HttpStatus.FORBIDDEN,
      status: false,
      msg: "Forbidden",
      error: HttpMessage.forbidden,
    };

    if (!userDetail || !moduleDetail) throw new HttpException(errMessage, errMessage.code);

    const check = await dbRawInstance().query(
      `SELECT * FROM "Permission" WHERE role_id = ${userDetail} AND module_id = ${moduleDetail}`,
    );
    const permission = check[0] ? check[0][0] : null;

    if (!permission || !permission[method]) throw new HttpException(errMessage, errMessage.code);

    return true;
  }
}
