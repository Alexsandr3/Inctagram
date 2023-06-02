import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';

/**
 * Pipe setup for validation data
 * @param app
 */
export function pipeSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //data from input DTO
      //forbidNonWhitelisted: true, //stopping create data
      transform: true, //transform data to correct
      stopAtFirstError: true, //stop at first error

      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: errors => {
        const errorsForRes = [];
        errors.forEach(e => {
          for (const eKey in e.constraints) {
            errorsForRes.push({
              field: e.property,
              message: e.constraints[eKey],
            });
          }
        });
        throw new BadRequestException(errorsForRes);
      },
    }),
  );
}
