import { ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { BYPASS_KEY, IS_PUBLIC_KEY } from "../decorator";
import { IOutputResponse } from "../interface";
import { HttpMessage } from "../constant";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const bypass = this.reflector.getAllAndOverride<boolean>(BYPASS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic && bypass) return true;

    const req = context.switchToHttp().getRequest();

    const res: IOutputResponse = {
      code: HttpStatus.UNAUTHORIZED,
      status: false,
      msg: "Unauthorized",
      error: "",
    };

    if (!req.raw.headers.authorization) {
      res.error = "Token tidak ditemukan";
      throw new HttpException(res, res.code);
    }

    const [type, token] = req.raw.headers.authorization?.split(" ");

    if ((!type && !token) || !token) {
      res.error = "Format authorisasi adalah Bearer <token>";
      throw new HttpException(res, res.code);
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      const errMessage: IOutputResponse = {
        code: HttpStatus.FORBIDDEN,
        status: false,
        msg: "Unauthorized",
        error: HttpMessage.unauthorized,
      };

      throw new HttpException(errMessage, errMessage.code);
    }
    return user;
  }
}
