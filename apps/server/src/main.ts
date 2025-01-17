import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import supertokens from "supertokens-node";

import { AppModule } from "./app/app.module";
import { SupertokensExceptionFilter } from "./app/auth/auth.filter";

async function bootstrap() {
  const globalPrefix = "api";
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://localhost:4200"],
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new SupertokensExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
