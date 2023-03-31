import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { appConfig } from "./configuration/app.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const createdApp = appConfig(app);
  //configuration app
  await createdApp.listen(3000).then(async () => {
    console.log(await app.getUrl());
  });
}
bootstrap();
