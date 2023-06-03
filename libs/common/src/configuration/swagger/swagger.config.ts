import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * @swagger configuration swagger
 */
export const swaggerConfig = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Open API for team  The 🍊🍊🍊 Dogs 🦮 🔜 🤦🏽‍♂️')
    .setDescription('Week.08 Add Devises in API 🤦🏽‍')
    .setVersion('0.0.8')
    .addBearerAuth()
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  //create static swagger for vercel, heroku, etc
  // swaggerStatic(app);
  //end swagger configuration
  return SwaggerModule.setup('swagger', app, document);
};
