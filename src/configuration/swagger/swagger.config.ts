import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * @swagger configuration swagger
 */
export const swaggerConfig = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Open API for team  The Orange Dogs 🦮 🔜 🤦🏽‍♂️')
    .setDescription('Week.02 Create profile user')
    .setVersion('0.0.2')
    .addBearerAuth()
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  //create static swagger for vercel, heroku, etc
  // swaggerStatic(app);
  //end swagger configuration
  return SwaggerModule.setup('swagger', app, document);
};
