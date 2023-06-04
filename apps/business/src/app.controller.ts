import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class Data {
  @IsString()
  @IsOptional()
  name: string;
  @IsNumber()
  @IsOptional()
  age: number;
}
@Controller('business')
export class AppController {
  // @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Body() data: any, @Req() req): string {
    const { headers, body } = req;
    console.log(headers, 'headers');
    console.log(body, 'body');
    console.log(data, 'get data');
    return 'Hello World! This is the business app.';
  }

  @Post()
  getHelloPost(@Body() data: any, @Req() request): string {
    const { headers, body } = request;
    console.log(headers, 'headers');
    console.log(body, 'body');
    console.log(data, 'post data');
    return 'I am the post request.';
  }

  @Delete()
  getHelloDelete(@Body() data: any): string {
    console.log(data, 'delete data');
    return 'I am the delete request.';
  }
}
