import { INestApplication } from '@nestjs/common';
import { get } from 'http';
import { createWriteStream } from 'fs';
import { ApiConfigService } from '../../modules/api-config/api.config.service';

export const swaggerStatic = (app: INestApplication) => {
  // for -----------------------------> swagger
  // get the swagger json file (if app is running in development mode)
  const port = app.get(ApiConfigService).PORT;
  const dev = app.get(ApiConfigService).NODE_ENV;
  // get the swagger json file (if app is running in development mode)
  if (dev === 'development') {
    const serverUrl = `http://localhost:${port}`;
    // write swagger ui files
    get(`${serverUrl}/api/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      // console.log(`Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`);
    });
    get(`${serverUrl}/api/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      // console.log(`Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`);
    });

    get(
      `${serverUrl}/api/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        // console.log(`Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`);
      },
    );

    get(`${serverUrl}/api/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      // console.log(`Swagger UI css file written to: '/swagger-static/swagger-ui.css'`);
    });
  }
  return;
};
