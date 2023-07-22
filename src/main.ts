import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { HttpException, HttpStatus, Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import * as fm from "@fastify/multipart";
import { ValidationMessage } from "./common";

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableCors();
  app.use(helmet({ hidePoweredBy: true, crossOriginResourcePolicy: false }));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await app.register(fm, {
    attachFieldsToBody: "keyValues",
    limits: { fileSize: 5 * 1024 * 1024 }, //max 5mb
    onFile: async (part) => {
      part["value"] = await part.toBuffer();
    },
  });
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  app.useGlobalPipes(
    new ValidationPipe({
      always: true,
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const mapped = {};
        errors.map((error) => {
          const msg = Object.values(error.constraints);
          const keys = Object.keys(error.constraints);
          mapped[error.property] = keys[0] === "isNotEmpty" ? ValidationMessage.isNotEmpty : msg[0];
        });

        throw new HttpException(mapped, HttpStatus.UNPROCESSABLE_ENTITY);
      },
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle("RKT Backend")
    .setVersion("0.1")
    .addBearerAuth({
      description: `Harus dengan format: Bearer <JWT>`,
      name: "Authorization",
      bearerFormat: "Bearer",
      scheme: "Bearer",
      type: "http",
      in: "Header",
    })
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      docExpansion: "none",
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT, "0.0.0.0");
  new Logger().verbose("Apps running on port " + process.env.PORT);
})();
