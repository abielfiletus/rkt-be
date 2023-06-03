import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { catchError, map, Observable } from "rxjs";
import { IOutputResponse } from "../interface";
import { StatusMessage } from "../constant/http-method.constant";
import Redis from "ioredis";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly redis: Redis;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        const res = context.switchToHttp().getResponse();

        const formatRes: IOutputResponse = {
          code: HttpStatus.OK,
          status: true,
          msg: StatusMessage[res.raw.statusCode],
          data,
        };

        return formatRes;
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          let fullRes = err.getResponse();

          if (typeof fullRes === "object" && fullRes["code"]) {
            fullRes = fullRes["error"];
          }
          const res: IOutputResponse = {
            code: err.getStatus(),
            status: false,
            msg: StatusMessage[err.getStatus()],
            error: fullRes,
          };
          throw new HttpException(res, res.code);
        }
        throw err;
      }),
    );
  }
}
